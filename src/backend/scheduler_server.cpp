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
    char schedule[64]; // for "* * * * *"
    char command[MAX_CMD_LEN];
} Task;

void log_message(const char *message);

Task task_list[MAX_TASKS];
int task_count = 0;

void save_tasks_to_file(const char *filename) {
    FILE *file = fopen(filename, "w");
    if (!file) {
        log_message("Error: Unable to open tasks file for saving");
        return;
    }
    for (int i = 0; i < task_count; ++i) {
        fprintf(file,
            "{\"schedule\": \"%s\", \"command\": \"%s\", \"jobName\": \"task_%d\"}\n",
            task_list[i].schedule,
            task_list[i].command,
            task_list[i].id);
    }
    fclose(file);
}

void load_tasks_from_file(const char *filename) {
    FILE *file = fopen(filename, "r");
    if (!file) {
        log_message("No tasks file found to load");
        return;
    }
    task_count = 0;
    char line[512];
    while (fgets(line, sizeof(line), file) && task_count < MAX_TASKS) {
        Task new_task;
        char schedule[64] = {0}, command[MAX_CMD_LEN] = {0};

        char *sched_start = strstr(line, "\"schedule\": \"");
        char *cmd_start = strstr(line, "\"command\": \"");

        if (!sched_start || !cmd_start) continue;

        sched_start += strlen("\"schedule\": \"");
        char *sched_end = strchr(sched_start, '"');
        if (!sched_end) continue;
        strncpy(schedule, sched_start, sched_end - sched_start);
        schedule[sched_end - sched_start] = '\0';

        cmd_start += strlen("\"command\": \"");
        char *cmd_end = strchr(cmd_start, '"');
        if (!cmd_end) continue;
        strncpy(command, cmd_start, cmd_end - cmd_start);
        command[cmd_end - cmd_start] = '\0';

        new_task.id = task_count + 1;
        strncpy(new_task.schedule, schedule, sizeof(new_task.schedule) - 1);
        new_task.schedule[sizeof(new_task.schedule) - 1] = '\0';

        strncpy(new_task.command, command, MAX_CMD_LEN - 1);
        new_task.command[MAX_CMD_LEN - 1] = '\0';

        task_list[task_count++] = new_task;
    }
    fclose(file);
    char msg[128];
    snprintf(msg, sizeof(msg), "Loaded %d tasks from file.", task_count);
    log_message(msg);
}

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

int match_field(const char *field, int value) {
    if (strcmp(field, "*") == 0) {
        return 1;
    } else {
        int field_val = atoi(field);
        return field_val == value;
    }
}

int match_schedule(const char *schedule, struct tm *tm) {
    // schedule format: "M H D M W" where each can be * or a number
    char min_str[16], hour_str[16], day_str[16], month_str[16], weekday_str[16];
    if (sscanf(schedule, "%15s %15s %15s %15s %15s", min_str, hour_str, day_str, month_str, weekday_str) != 5) {
        return 0; // invalid schedule format
    }

    int min_match = match_field(min_str, tm->tm_min);
    int hour_match = match_field(hour_str, tm->tm_hour);
    int day_match = match_field(day_str, tm->tm_mday);
    int month_match = match_field(month_str, tm->tm_mon + 1); // tm_mon is 0-11
    int weekday_match = match_field(weekday_str, tm->tm_wday); // tm_wday is 0-6, Sunday=0

    return min_match && hour_match && day_match && month_match && weekday_match;
}

void check_and_run_tasks() {
    time_t now = time(NULL);
    struct tm *tm = localtime(&now);

    char debug_msg[128];
    snprintf(debug_msg, sizeof(debug_msg), "Checking tasks at %02d:%02d", tm->tm_hour, tm->tm_min);
    log_message(debug_msg);

    for (int i = 0; i < task_count; ++i) {
        snprintf(debug_msg, sizeof(debug_msg), "Evaluating Task %d: [%s] %s", task_list[i].id, task_list[i].schedule, task_list[i].command);
        log_message(debug_msg);

        if (match_schedule(task_list[i].schedule, tm)) {
            log_message("→ Match found, executing task.");
            execute_task(task_list[i].command, task_list[i].id);
        } else {
            log_message("→ No match for this task.");
        }
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
        char *min = strtok(NULL, " ");
        char *hour = strtok(NULL, " ");
        char *day = strtok(NULL, " ");
        char *month = strtok(NULL, " ");
        char *weekday = strtok(NULL, " ");
        char *task_cmd = strtok(NULL, "\n");
        if (min && hour && day && month && weekday && task_cmd && task_count < MAX_TASKS) {
            Task new_task;
            new_task.id = task_count + 1;
            snprintf(new_task.schedule, sizeof(new_task.schedule), "%s %s %s %s %s", min, hour, day, month, weekday);
            strncpy(new_task.command, task_cmd, MAX_CMD_LEN - 1);
            new_task.command[MAX_CMD_LEN - 1] = '\0';
            task_list[task_count++] = new_task;

            char ack[128];
            snprintf(ack, sizeof(ack), "ACK: Task %d added with schedule '%s'\n", new_task.id, new_task.schedule);
            write(client_socket, ack, strlen(ack));
            save_tasks_to_file("tasks.json");
        } else {
            write(client_socket, "ERR: Invalid schedule/command or too many tasks\n", 47);
        }
    }
    else if (strcmp(cmd, "LIST") == 0) {
        char list_msg[1024] = "Scheduled Tasks:\n";
        for (int i = 0; i < task_count; ++i) {
            char line[350];
            snprintf(line, sizeof(line), "Task %d: [%s] %s\n", task_list[i].id, task_list[i].schedule, task_list[i].command);
            strncat(list_msg, line, sizeof(list_msg) - strlen(list_msg) - 1);
        }
        write(client_socket, list_msg, strlen(list_msg));
    }
    else if (strcmp(cmd, "REMOVE") == 0) {
        char *id_str = strtok(NULL, " \n");
        if (id_str) {
            int id = atoi(id_str);
            int found = 0;
            for (int i = 0; i < task_count; ++i) {
                if (task_list[i].id == id) {
                    found = 1;
                    // Shift tasks to remove the task
                    for (int j = i; j < task_count - 1; ++j) {
                        task_list[j] = task_list[j + 1];
                    }
                    task_count--;
                    char ack[128];
                    snprintf(ack, sizeof(ack), "ACK: Task %d removed\n", id);
                    write(client_socket, ack, strlen(ack));
                    save_tasks_to_file("tasks.json");
                    break;
                }
            }
            if (!found) {
                write(client_socket, "ERR: Task ID not found\n", 23);
            }
        } else {
            write(client_socket, "ERR: No Task ID provided\n", 26);
        }
    }
    else if (strcmp(cmd, "CLEAR") == 0) {
        task_count = 0;
        save_tasks_to_file("tasks.json");
        write(client_socket, "All tasks cleared.\n", 19);
    }
    else if (strcmp(cmd, "STATUS") == 0) {
        char status_msg[64];
        snprintf(status_msg, sizeof(status_msg), "STATUS: %d tasks loaded.\n", task_count);
        write(client_socket, status_msg, strlen(status_msg));
    }
    else if (strcmp(cmd, "SAVE") == 0) {
        save_tasks_to_file("tasks.json");
        write(client_socket, "Tasks saved.\n", 13);
    }
    else if (strcmp(cmd, "LOAD") == 0) {
        load_tasks_from_file("tasks.json");
        write(client_socket, "Tasks loaded.\n", 14);
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

    load_tasks_from_file("tasks.json");

    fd_set readfds;
    int max_sd = server_fd;
    struct timeval tv;

    while (1) {
        FD_ZERO(&readfds);
        FD_SET(server_fd, &readfds);

        tv.tv_sec = 60; // wait max 60 seconds
        tv.tv_usec = 0;

        int activity = select(max_sd + 1, &readfds, NULL, NULL, &tv);

        if (activity < 0) {
            perror("select error");
            continue;
        }

        if (activity == 0) {
            // Timeout occurred, run scheduled tasks
            check_and_run_tasks();
            continue;
        }

        if (FD_ISSET(server_fd, &readfds)) {
            client_socket = accept(server_fd, (struct sockaddr *)&address, (socklen_t *)&addrlen);
            if (client_socket < 0) {
                perror("accept failed");
                continue;
            }
            handle_client(client_socket);
        }
    }

    return 0;
}