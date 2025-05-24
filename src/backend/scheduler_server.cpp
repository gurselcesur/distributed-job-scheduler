// ===========================
// scheduler_server.cpp
// ===========================

#include <iostream>
#include <fstream>
#include <vector>
#include <map>
#include <thread>
#include <mutex>
#include <sstream>
#include <chrono>
#include <ctime>
#include <netinet/in.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <nlohmann/json.hpp>

#define SERVER_PORT 5050
#define BUFFER_SIZE 1024

using json = nlohmann::json;

struct Task {
    int id;
    std::string username;
    std::string schedule;
    std::string command;
};

std::vector<Task> tasks;
std::map<std::string, int> user_ports; // username -> client listener port
std::map<std::string, std::string> user_ips; // username -> client IP
std::mutex task_mutex;
int next_task_id = 1;

void logMessage(const std::string& msg) {
    std::time_t now = std::time(nullptr);
    std::string timestamp = std::ctime(&now);
    timestamp.pop_back(); // remove newline
    std::cout << timestamp << ": " << msg << std::endl;
}

void loadTasksFromFile() {
    std::ifstream in("tasks.json");
    if (!in.is_open()) return;
    json j;
    in >> j;
    tasks.clear();
    for (const auto& item : j) {
        Task t;
        t.id = item["id"].get<int>();
        t.username = item["username"].get<std::string>();
        t.schedule = item["schedule"].get<std::string>();
        t.command = item["command"].get<std::string>();
        tasks.push_back(t);
        if (t.id >= next_task_id) {
            next_task_id = t.id + 1;
        }
    }
    logMessage("Loaded tasks from file");
}

void saveTasksToFile() {
    json j = json::array();
    for (const auto& t : tasks) {
        j.push_back({
            {"id", t.id},
            {"username", t.username},
            {"schedule", t.schedule},
            {"command", t.command}
        });
    }
    std::ofstream out("tasks.json");
    out << j.dump(2) << std::endl;
}

bool matchSchedule(const std::string& sched, const std::tm& tm) {
    std::istringstream ss(sched);
    std::string m, h, d, mo, w;
    ss >> m >> h >> d >> mo >> w;
    return (m == "*" || std::stoi(m) == tm.tm_min) &&
           (h == "*" || std::stoi(h) == tm.tm_hour) &&
           (d == "*" || std::stoi(d) == tm.tm_mday) &&
           (mo == "*" || std::stoi(mo) == tm.tm_mon + 1) &&
           (w == "*" || std::stoi(w) == tm.tm_wday);
}

void schedulerLoop() {
    while (true) {
        std::this_thread::sleep_for(std::chrono::seconds(60));
        std::time_t now = std::time(nullptr);
        std::tm tm = *std::localtime(&now);

        {
            std::lock_guard<std::mutex> lock(task_mutex);
            loadTasksFromFile();  // <-- Refresh tasks from disk
        }

        std::lock_guard<std::mutex> lock(task_mutex);
        for (const auto& task : tasks) {
            if (matchSchedule(task.schedule, tm)) {
                if (user_ips.find(task.username) == user_ips.end() || user_ports.find(task.username) == user_ports.end()) {
                    logMessage("User " + task.username + " not connected. Skipping task " + std::to_string(task.id));
                    continue;
                }

                std::string ip = user_ips[task.username];
                int port = user_ports[task.username];

                int sock = socket(AF_INET, SOCK_STREAM, 0);
                struct sockaddr_in cli{};
                cli.sin_family = AF_INET;
                cli.sin_port = htons(port);
                inet_pton(AF_INET, ip.c_str(), &cli.sin_addr);

                if (connect(sock, (struct sockaddr*)&cli, sizeof(cli)) >= 0) {
                    send(sock, task.command.c_str(), task.command.length(), 0);
                    close(sock);
                    logMessage("Dispatched task to " + task.username + ": " + task.command);
                } else {
                    logMessage("Failed to connect to " + task.username);
                }
            }
        }
    }
}

void handleClient(int sock, std::string ip) {
    char buffer[BUFFER_SIZE] = {0};
    read(sock, buffer, BUFFER_SIZE);
    std::istringstream ss(buffer);
    std::string line;
    while (std::getline(ss, line)) {
        std::istringstream cmd(line);
        std::string type;
        cmd >> type;
        if (type == "REGISTER") {
            std::string user; int port;
            cmd >> user >> port;
            user_ports[user] = port;
            user_ips[user] = ip;
            logMessage("User " + user + " registered from IP " + ip + " on port " + std::to_string(port));
        } else if (type == "ADD") {
            std::string user, m, h, d, mo, w;
            cmd >> user >> m >> h >> d >> mo >> w;
            std::string rest;
            std::getline(cmd, rest);
            while (!rest.empty() && rest[0] == ' ') rest.erase(0, 1);

            Task t = {next_task_id++, user, m + " " + h + " " + d + " " + mo + " " + w, rest};
            tasks.push_back(t);
            saveTasksToFile();
            logMessage("User " + user + " added task: [" + t.schedule + "] " + t.command);
        } else if (type == "LIST") {
            std::string list_user;
            cmd >> list_user;

            {
                std::lock_guard<std::mutex> lock(task_mutex);
                loadTasksFromFile();  // Ensure latest tasks are loaded
            }

            std::ostringstream out;
            std::lock_guard<std::mutex> lock(task_mutex);
            for (const auto& t : tasks) {
                if (t.username == list_user) {
                    out << "Task " << t.id << ": [" << t.schedule << "] " << t.command << "\n";
                }
            }
            std::string result = out.str();
            send(sock, result.c_str(), result.length(), 0);
        }
    }
    close(sock);
}

int main() {
    loadTasksFromFile();
    std::thread(schedulerLoop).detach();

    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in address{};
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(SERVER_PORT);

    bind(server_fd, (struct sockaddr*)&address, sizeof(address));
    listen(server_fd, 10);
    std::cout << "Server listening on port " << SERVER_PORT << "...\n";

    while (true) {
        struct sockaddr_in client;
        socklen_t len = sizeof(client);
        int sock = accept(server_fd, (struct sockaddr*)&client, &len);
        std::string ip = inet_ntoa(client.sin_addr);
        std::thread(handleClient, sock, ip).detach();
    }
}