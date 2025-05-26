cron-scheduler/
├── agent/                          # Kullanıcının bilgisayarında çalışacak
│   ├── src/
│   │   ├── services/
│   │   │   ├── cronService.js      # Cron job yönetimi
│   │   │   ├── tunnelService.js    # Tunnel bağlantısı
│   │   │   └── authService.js      # Kimlik doğrulama
│   │   ├── models/
│   │   │   └── LocalJob.js
│   │   ├── utils/
│   │   │   ├── systemInfo.js       # Sistem bilgileri
│   │   │   └── security.js
│   │   └── agent.js
│   └── package.json
├── relay-server/                    # Merkezi relay sunucusu
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