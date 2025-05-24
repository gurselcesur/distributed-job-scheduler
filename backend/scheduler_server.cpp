#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <sys/wait.h>
#include <time.h>

#define PORT 5050
#define MAX_TASKS 100
#define MAX_CMD_LEN 256
#define BUFFER_SIZE 1024
#define LOG_FILE "scheduler.log"

typedef struct {
    int id;
    char command[MAX_CMD_LEN];
} Task;

Task task_list[MAX_TASKS];
int task_count = 0;

void log_message(const char *message) {
    FILE *log = fopen(LOG_FILE, "a");
    if (log) {
        time_t now = time(NULL);
        fprintf(log, "[%s] %s\n", strtok(ctime(&now), "\n"), message);
        fclose(log);
    }
}

void execute_task(const char *cmd, int task_id) {
    pid_t pid = fork();
    if (pid == 0) {
        execl("/bin/sh", "sh", "-c", cmd, NULL);
        perror("exec failed");
        exit(1);
    } else if (pid > 0) {
        int status;
        waitpid(pid, &status, 0);
        char msg[512];
        snprintf(msg, sizeof(msg), "Executed Task %d: %s | Exit Status: %d", task_id, cmd, WEXITSTATUS(status));
        log_message(msg);
    } else {
        log_message("Error: fork failed");
    }
}

void handle_client(int client_socket) {
    char buffer[BUFFER_SIZE] = {0};
    read(client_socket, buffer, sizeof(buffer));
    printf("Received: %s\n", buffer);

    char *cmd = strtok(buffer, " \n");

    if (cmd == NULL) {
        write(client_socket, "ERR: Empty command\n", 20);
        close(client_socket);
        return;
    }

    if (strcmp(cmd, "PING") == 0) {
        write(client_socket, "PONG\n", 5);
    }
    else if (strcmp(cmd, "ADD") == 0) {
        char *task_cmd = strtok(NULL, "\n");
        if (task_cmd && task_count < MAX_TASKS) {
            Task new_task;
            new_task.id = task_count + 1;
            strncpy(new_task.command, task_cmd, MAX_CMD_LEN);
            task_list[task_count++] = new_task;

            char ack[128];
            snprintf(ack, sizeof(ack), "ACK: Task %d added and running...\n", new_task.id);
            write(client_socket, ack, strlen(ack));
            execute_task(task_cmd, new_task.id);
        } else {
            write(client_socket, "ERR: Invalid or too many tasks\n", 32);
        }
    }
    else if (strcmp(cmd, "LIST") == 0) {
        char list_msg[1024] = "Scheduled Tasks:\n";
        for (int i = 0; i < task_count; ++i) {
            char line[300];
            snprintf(line, sizeof(line), "Task %d: %s\n", task_list[i].id, task_list[i].command);
            strncat(list_msg, line, sizeof(list_msg) - strlen(list_msg) - 1);
        }
        write(client_socket, list_msg, strlen(list_msg));
    }
    else {
        write(client_socket, "ERR: Unknown command\n", 22);
    }

    close(client_socket);
}

int main() {
    int server_fd, client_socket;
    struct sockaddr_in address;
    int addrlen = sizeof(address);

    server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd == 0) {
        perror("socket failed");
        exit(EXIT_FAILURE);
    }

    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(PORT);

    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) < 0) {
        perror("bind failed");
        exit(EXIT_FAILURE);
    }

    if (listen(server_fd, 5) < 0) {
        perror("listen failed");
        exit(EXIT_FAILURE);
    }

    printf("Scheduler TCP server listening on port %d...\n", PORT);
    log_message("Scheduler started.");

    while (1) {
        client_socket = accept(server_fd, (struct sockaddr *)&address, (socklen_t *)&addrlen);
        if (client_socket < 0) {
            perror("accept failed");
            continue;
        }
        handle_client(client_socket);
    }

    return 0;
}