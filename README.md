# ⚙️ Distributed Job Scheduler

A NAT-friendly, real-time distributed job scheduling system.  
Submit shell commands from a central dashboard and execute them remotely on multiple worker agents — even behind NAT. This scheduler persists tasks in a JSON-formatted flat file.

---

## 🚀 Features

- Centralized REST API for job submissions
- WebSocket-based real-time communication with worker agents
- Lightweight, cross-platform workers (Node.js)
- Simple dashboard UI for submitting jobs and viewing logs
- NAT-resilient communication (workers initiate connection)
- Dockerized setup for local testing and deployment

---

## 📦 Tech Stack

| Component        | Technology      |
|------------------|------------------|
| Backend API      | Node.js + Express |
| WebSocket Server | `ws` module       |
| Frontend UI      | Basic HTML/CSS/JS or React |
| Worker Agent     | Node.js           |
| Deployment       | Docker + Compose  |

---

## 🧱 Project Structure
distributed-job-scheduler/
├── src/
│   ├── backend/      → Express API + WebSocket Server
│   ├── frontend/     → HTML dashboard and JS scripts
├── worker/           → Worker agent logic
├── docker/           → Dockerfiles and docker-compose
├── README.md
└── ARCHITECTURE.md

---

## 🛠️ Getting Started

### 🔧 Prerequisites

- Node.js (v18+ recommended)
- Docker (optional but recommended)

---

## 🧪 Running Locally (Dev Mode)

### 1. Install dependencies

```bash
npm install
```

### 2. Start the backend server

```bash
node src/backend/server.js
```

### 3. Start a worker agent (in another terminal)

```bash
node worker/agent.js
```

### 4. Open the frontend dashboard

Open your browser and go to:

```
http://localhost:3000
```

From here you can submit jobs and monitor their execution.

---

## 🧠 C Backend Task Scheduler – TCP Command Reference

The backend C scheduler listens on TCP port 5050 and supports the following commands using `nc`. It persists tasks in a JSON-formatted flat file for task storage.

### 🔹 ADD

Add a new scheduled task.

**Format:**
```
echo 'ADD * * * * * echo Hello every minute!' | nc localhost 5050
```

Tasks are stored with a generated `jobName` in the file, which is used for identification in logs and persistence.

**Example:**
```
echo 'ADD * * * * * echo Hello every minute!' | nc localhost 5050
```

### 🔹 LIST

List all scheduled tasks.
```
echo 'LIST' | nc localhost 5050
```

### 🔹 REMOVE

Remove a task by its ID.
```
echo 'REMOVE 2' | nc localhost 5050
```

**Example:**
```
echo 'REMOVE 2' | nc localhost 5050
```

### 🔹 CLEAR

Delete all tasks.
```
echo 'CLEAR' | nc localhost 5050
```

### 🔹 STATUS

Show how many tasks are currently loaded.
```
echo 'STATUS' | nc localhost 5050
```

### 🔹 SAVE

Save tasks to `tasks.db`.  
`tasks.db` is a line-based JSON file, with each line representing one task:
```json
{"schedule": "* * * * *", "command": "echo Hello", "jobName": "task_1"}
```

```
echo 'SAVE' | nc localhost 5050
```

### 🔹 LOAD

Load tasks from `tasks.db`.  
`tasks.db` is a line-based JSON file, with each line representing one task:
```json
{"schedule": "* * * * *", "command": "echo Hello", "jobName": "task_1"}
```

```
echo 'LOAD' | nc localhost 5050
```

### 🔹 PING

Check if the server is alive.
```
echo 'PING' | nc localhost 5050
```

Returns `PONG`