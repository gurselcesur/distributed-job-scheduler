
# Relay Server – Cron Job Scheduler Backend

This is the backend component of a distributed cron job scheduler system. It handles user registration, authentication, agent management, and exposes a RESTful API with JWT-based access control.

## ✅ Features Implemented

- SQLite database using Sequelize ORM
- User registration with hashed passwords (bcrypt)
- Secure login system using JWT
- Agent registration and listing
- Protected API routes using middleware
- Express server running on `http://localhost:3000`

## 🛠️ Tech Stack

- Node.js
- Express.js
- SQLite3
- Sequelize
- bcrypt (for password hashing)
- jsonwebtoken (for authentication)

## 📦 Installation

1. Navigate to `relay-server` directory:

```
cd relay-server
```

2. Install dependencies:

```
npm install
```

## ⚙️ Usage

Start the server:

```
node src/server.js
```

This will create a `database.sqlite` file in the root directory if it doesn't already exist.

## 🧪 API Endpoints

### 🔐 Authentication

#### POST /users
Registers a new user.

**Request body:**
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

#### POST /login
Authenticates the user and returns a JWT token.

**Request body:**
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN_HERE"
}
```

### 👥 Users & Agents

#### GET /agents
Returns the list of all registered agents.

#### POST /agents
Registers a new agent.

**Request body:**
```json
{
  "hostname": "my-machine",
  "ip": "192.168.1.2"
}
```

### 📋 Job Endpoints

#### POST /jobs
Create a new scheduled job (authenticated).

**Headers:**
Authorization: Bearer YOUR_TOKEN  
Content-Type: application/json

**Body:**
```json
{
  "command": "echo Hello",
  "schedule": "*/5 * * * *",
  "agentId": 1
}
```

---

#### GET /jobs
Returns the jobs created by the authenticated user, with agent info.

**Headers:**
Authorization: Bearer YOUR_TOKEN

**Response:**
```json
[
  {
    "id": 1,
    "command": "echo Hello",
    "schedule": "*/5 * * * *",
    "agentId": 1,
    "Agent": {
      "hostname": "my-laptop",
      "ip": "192.168.1.55"
    }
  }
]
```

---

### 🧠 Job Notes
- `schedule` uses standard cron format (e.g., `*/5 * * * *`)
- Jobs are linked to a specific agent using `agentId`
- Only the owner user (via JWT) can see their jobs


### 🔒 Protected Example

#### GET /protected
Access this route only with a valid token.

**Header:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "message": "Hello testuser, you are authorized."
}
```

## 🔐 Environment Variables (optional)

You can use a `.env` file for secrets:

```
SECRET_KEY=your-secret-key
```

Then install and use dotenv:

```
npm install dotenv
```

## 📁 Folder Structure

```
relay-server/
├── src/
│   ├── models/
│   │   ├── index.js
│   │   ├── User.js
│   │   └── Agent.js
│   └── server.js
├── database.sqlite
├── .gitignore
├── package.json
└── README.md
```

## 🧼 .gitignore

Make sure to ignore the following:

```
node_modules
database.sqlite
.env
```

## 🚀 Next Steps

- Add agent-heartbeat and scheduling logic
- Add frontend UI
- Add Docker support
