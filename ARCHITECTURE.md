cron-scheduler/
├── agent/                          # Kullanıcının bilgisayarında çalışacak
│   ├── src/
│   │   ├── services/
│   │   │   ├── agentService.js     # registerAgent, getIPAddress
│   │   │   └── apiService.js       # fetchJobs, updateJobStatus
│   │   ├── core/
│   │   │   ├── jobScheduler.js     # fetch + run loop
│   │   │   └── jobRunner.js        # tek bir job'ı çalıştırır
│   │   ├── utils/
│   │   │   └── cronUtils.js        # isJobDue
│   │   └── bootstrap.js            # ana başlatıcı
│   └── package.json
├── relay-server/                   # Merkezi relay sunucusu
│   ├── src/
│   │   ├── services/
│   │   │   ├── tunnelManager.js    # Agent bağlantıları yönetimi
│   │   │   ├── authService.js      # Kullanıcı kimlik doğrulama
│   │   │   └── relayService.js     # Mesaj iletimi
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Agent.js
│   │   └── server.js
│   └── package.json
├── web-app/                        # Web arayüzü
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── Dashboard/
│   │   │   ├── JobManager/
│   │   │   └── AgentStatus/
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── websocket.js
│   │   └── App.jsx
│   └── package.json
└── docs/
    ├── SETUP.md
    └── SECURITY.md