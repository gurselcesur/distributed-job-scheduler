# CronFlow - Distributed Job Scheduling System

A modern, distributed job scheduling system that enables centralized management and execution of periodic and event-driven tasks across multiple remote nodes. Built with contemporary web technologies and network programming techniques.

## 🚀 Features

- **Distributed Architecture**: Execute jobs on remote agents behind NAT without port forwarding
- **Real-time Monitoring**: Track job execution status, timestamps, and performance metrics
- **Web-based Interface**: Modern React frontend with intuitive job management
- **Cron Expression Support**: Flexible scheduling with standard cron syntax
- **Secure Authentication**: JWT-based user authentication and session management
- **Agent Health Monitoring**: Real-time agent status and heartbeat tracking
- **Cross-network Execution**: Works seamlessly across different network topologies

## 📋 System Requirements

- **Node.js** v16+ 
- **npm** or **yarn**
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## 🏗️ Architecture

The system consists of four main components:

1. **Frontend**: React-based user interface with TailwindCSS
3. **Relay Server**: Handles NAT traversal and agent communication
4. **Distributed Agents**: Lightweight services running on target machines

```
┌─────────────┐    HTTP/REST    ┌─────────────┐    WebSocket    ┌─────────┐
│   Frontend  │ ◄──────────────► │   Backend   │ ◄──────────────► │  Agent  │
│   (React)   │                 │  (Node.js)  │                 │ (Node.js)│
└─────────────┘                 └─────────────┘                 └─────────┘
                                        │
                                        │ WebSocket
                                        ▼
                                ┌─────────────┐
                                │Relay Server │
                                │  (Node.js)  │
                                └─────────────┘
```

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/gurselcesur/distributed-job-scheduler.git
cd distributed-job-scheduler
```

### 2. Setup Relay Server
```bash
cd relay-server
npm install
node src/server.js
```
The relay server runs on `http://localhost:3000`

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend runs on `http://localhost:5173`

### 4. Setup Agent(s)
```bash
cd agent
npm install
node src/AgentMainEntry.js
```

## 🚦 Getting Started

### First Time Setup
1. Visit `http://localhost:5173`
2. Register a new account on the registration page
3. Login with your credentials
4. The dashboard will show system statistics and connected agents

### Creating Your First Job
1. Navigate to "New Job" from the dashboard
2. Select target agent from the dropdown
3. Enter your command (e.g., `echo "Hello World"`)
4. Set cron schedule using:
   - Preset options (Every minute, hourly, daily, etc.)
   - Custom cron expression (e.g., `0 9 * * 1-5` for weekdays at 9 AM)
5. Click "Create Job"

### Monitoring Jobs
- **Jobs Tab**: View all scheduled jobs, execution status, and logs
- **Agents Tab**: Monitor connected agents and their health status
- **Real-time Updates**: Dashboard refreshes every 30 seconds automatically

## 📚 API Reference

### Authentication Endpoints
- `POST /login` - User authentication
- `POST /users` - User registration

### Job Management
- `GET /jobs` - List all jobs (auth required)
- `POST /jobs` - Create new job (auth required)
- `PATCH /jobs/:id` - Update job status
- `DELETE /jobs/:id` - Delete job (auth required)

### Agent Management
- `GET /agents` - List all agents
- `POST /agents` - Register new agent
- `POST /agents/heartbeat` - Agent health check

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Encrypted credential storage
- **Agent Authorization**: Server-validated connections
- **Command Signing**: Signed tokens prevent unauthorized execution

## 📊 Cron Expression Examples

| Expression | Description |
|------------|-------------|
| `* * * * *` | Every minute |
| `0 * * * *` | Every hour |
| `0 9 * * *` | Daily at 9:00 AM |
| `0 9 * * 1-5` | Weekdays at 9:00 AM |
| `0 0 1 * *` | First day of every month |
| `0 9 * * MON` | Every Monday at 9:00 AM |

## 🐛 Troubleshooting

### Common Issues

**Agents not connecting**:
- Check if relay server is running on port 3000
- Verify agent configuration and network connectivity
- Check firewall settings

**Jobs not executing**:
- Ensure target agent is online and connected
- Verify cron expression syntax
- Check agent logs for execution errors

**Authentication failures**:
- Verify JWT secret is consistent across services
- Check token expiration settings
- Clear browser cookies and re-login

## 🚧 Development

### Project Structure
```
distributed-job-scheduler/
├── frontend/         # React frontend application
├── relay-server/     # Node.js db & WebSocket relay server
├── agent/            # Distributed agent service
```

### Running in Development Mode
```bash

# Terminal 1: Relay Server  
cd relay-server/src && node server.js

# Terminal 2: ngrok  
npx ngrok http 3000

# Terminal 3: Agent
cd agent/src && node AgentMainEntry.js

# Terminal 4: Frontend
cd frontend && npm run dev

```

## 👥 Authors

- **Gürsel Cesur**
- **Tanay Alpkonur** 
- **Kerem Kaya**

## 🙏 Acknowledgments

- Built as part of CS 447 - Computer Networks course
- Inspired by traditional cron scheduling with modern distributed systems approach
- Thanks to the open-source community for the amazing tools and libraries

---

**Note**: This system is designed for educational and development purposes. For production use, consider additional security measures, load balancing, and monitoring solutions.