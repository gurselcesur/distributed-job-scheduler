distributed-job-scheduler/
├── src/
│   ├── backend/
│   │   ├── server.js              # Express server entry point
│   │   ├── websocket.js           # WebSocket server
│   │   ├── routes/
│   │   │   └── jobs.js            # /jobs endpoints
│   │   ├── controllers/
│   │   │   └── jobController.js   # Job addition, status etc. logic
│   │   ├── queue/
│   │   │   └── jobQueue.js        # In-memory job queue (Map etc.)
│   │   └── utils/
│   │       └── logger.js          # Simple logging mechanism
│
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