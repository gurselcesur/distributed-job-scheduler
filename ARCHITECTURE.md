distributed-job-scheduler/
├── src/
│   ├── backend/
│   │   ├── scheduler_server       # executable
│   │   ├── scheduler_server.cpp   # cpp program
│   │   ├── scheduler.log          # a clear log for the program
│   │   └── tasks.json             # database for the tasks
│   │   
│   ├── frontend/
│   │   ├── index.html             # Main page
│   │   ├── submit.html            # Job submission page
│   │   ├── view.html              # Job viewing page
│   │   └── js/
│   │       └── main.js            # Form submission, fetch operations
│
├── worker/
│   ├── agent.js                   # Worker agent WebSocket client
│   └── utils.js                   # Command execution & log sending
│
├── docker/
│   ├── Dockerfile.server          # Backend + frontend image
│   ├── Dockerfile.worker          # Worker image
│   └── docker-compose.yml         # Launches everything
│
├── ARCHITECTURE.md                # Architecture documentation
├── README.md                      # Project summary and usage
├── package.json                   # Project dependencies
└── .gitignore