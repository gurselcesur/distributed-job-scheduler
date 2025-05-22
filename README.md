# ⚙️ Distributed Job Scheduler

A NAT-friendly, real-time distributed job scheduling system.  
Submit shell commands from a central dashboard and execute them remotely on multiple worker agents — even behind NAT.

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