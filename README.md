# Distributed Job Scheduler

A distributed cron-based task scheduler that allows you to schedule jobs centrally on a server, which are then dispatched to and executed by individual clients. The system supports a **React + Express web frontend**, a **C++ server for scheduling**, and **C++ clients that execute jobs locally**.

##  Requirements

###  Backend

- C++17
- CMake
- `nlohmann/json.hpp` 

###  Frontend

- Node.js v16+
- npm or yarn
- Vite

---

##  Installation & Setup

### 1. Build the Server & Client

```bash
mkdir build && cd build
cmake ..
make
```

This will create:

- `scheduler_server`
- `scheduler_client`

---

### 2. Start the Server

```bash
cd ../src/backend
./scheduler_server
```

The server runs on port `5050` and reads/writes to `tasks.json`.

---

### 4. Start the Client

```bash
./scheduler_client
```

The client:
- Registers itself with the server using a username
- Opens port `6060` to receive tasks
- Executes received tasks using `sh -c`

---

### 5. Start the Express.js API

```bash
cd src/backend
npm install
node server.js
```

 The API listens on port `5050`.

---

### 6. Start the React Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

Use the UI to create new cron jobs for specific usernames.

---

## Example Workflow

1. Start the `scheduler_server`, `scheduler_client` and `server.js`.
2. Open [http://localhost:5173](http://localhost:5173) and add a job for a username (e.g., `tanay`).
3. The job is stored in `tasks.json`.
4. When the schedule time arrives, the server sends it to the client with the corresponding username.
5. The client receives the task and executes it.
6. The client supports the commands ADD username * * * * * echo Hello World format along with the LIST command.
