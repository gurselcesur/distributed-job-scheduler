#include <iostream>
#include <thread>
#include <string>
#include <sstream>
#include <cstring>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <sys/wait.h>

#define SERVER_PORT 5050
#define CLIENT_PORT 6060
#define BUFFER_SIZE 1024

std::string username;
std::string server_ip = "127.0.0.1";

// Background thread: accepts execution commands from server
void startListener() {
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(CLIENT_PORT);

    bind(server_fd, (struct sockaddr*)&addr, sizeof(addr));
    listen(server_fd, 5);
    std::cout << "Task listener running on port " << CLIENT_PORT << "...\n";

    while (true) {
        int client_fd = accept(server_fd, nullptr, nullptr);
        if (client_fd >= 0) {
            char buffer[BUFFER_SIZE] = {0};
            read(client_fd, buffer, BUFFER_SIZE);
            std::string command(buffer);
            std::cout << "Received task: " << command << std::endl;

            pid_t pid = fork();
            if (pid == 0) {
                execl("/bin/sh", "sh", "-c", command.c_str(), NULL);
                exit(1);
            } else if (pid > 0) {
                int status;
                waitpid(pid, &status, 0);
                std::cout << "Task finished with exit code " << WEXITSTATUS(status) << "\n";
            }
            close(client_fd);
        }
    }
}

// Foreground: send commands to server
void sendCommand(const std::string& msg) {
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in serv{};
    serv.sin_family = AF_INET;
    serv.sin_port = htons(SERVER_PORT);
    inet_pton(AF_INET, server_ip.c_str(), &serv.sin_addr);

    if (connect(sock, (struct sockaddr*)&serv, sizeof(serv)) >= 0) {
        send(sock, msg.c_str(), msg.length(), 0);

        char buffer[BUFFER_SIZE] = {0};
        int len = read(sock, buffer, BUFFER_SIZE);
        if (len > 0) {
            std::cout << std::string(buffer, len);
        }

        close(sock);
    } else {
        std::cerr << "Failed to connect to server\n";
    }
}

int main() {
    std::cout << "Enter username: ";
    std::getline(std::cin, username);

    std::thread listener(startListener);

    // Register with the server
    std::ostringstream register_msg;
    register_msg << "REGISTER " << username << " " << CLIENT_PORT << "\n";
    sendCommand(register_msg.str());

    std::cout << "\nType commands (ADD, LIST, exit):\n";
    std::string input;
    while (true) {
        std::cout << "> ";
        std::getline(std::cin, input);
        if (input == "exit") break;

        if (!input.empty()) {
            sendCommand(input + "\n");
        }
    }

    listener.detach(); // or listener.join() before exiting
    return 0;
}