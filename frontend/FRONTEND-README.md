# Frontend - Distributed Job Scheduler

This is the React frontend for the distributed cron job scheduler system. It provides a modern, secure web interface for managing cron jobs and monitoring agents across your network.

## ✅ Features Implemented

- **Authentication System**
  - User registration with validation
  - Secure login with JWT tokens
  - Protected routes with automatic redirects
  - Session persistence with localStorage
  - Logout functionality

- **Modern UI/UX**
  - Dark theme with professional design
  - Responsive layout for all screen sizes
  - Loading states and error handling
  - Form validation with user feedback
  - Icon-based navigation with Lucide React

- **Job Management**
  - Create new cron jobs with visual form
  - Cron expression presets for common schedules
  - Real-time job preview
  - Input validation and error messages

- **Monitoring Dashboard**
  - Dual-tab interface for Tasks and Agents
  - Real-time data fetching every 30 seconds
  - Agent status monitoring
  - Task execution tracking

## 🛠️ Tech Stack

- **React 19** - Latest React with modern hooks
- **React Router DOM 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Vite** - Fast build tool and dev server

## 📦 Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## ⚙️ Usage

### Development Mode

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🔐 Authentication Flow

1. **Registration**: New users can create accounts with username/password
2. **Login**: Existing users authenticate and receive JWT tokens
3. **Protected Routes**: All main features require authentication
4. **Session Management**: Tokens are stored in localStorage for persistence
5. **Logout**: Secure token removal and redirect to login

## 📱 Pages & Components

### Pages
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration
- **Home** (`/`) - Dashboard with quick actions
- **New Job** (`/new-job`) - Create cron jobs
- **Monitor** (`/monitor`) - View tasks and agents

### Components
- **Header** - Navigation with user info and logout
- **ProtectedRoute** - Route wrapper for authentication
- **Login/Register Forms** - Authentication components

## 🎨 Design System

### Colors
- **Primary**: Blue theme (`#3182ce`)
- **Background**: Dark theme (`#1a202c`, `#2d3748`, `#4a5568`)
- **Text**: Light colors for dark background
- **Status**: Green for success, Red for errors

### Typography
- Clean, modern fonts
- Proper hierarchy with size variations
- Monospace for code/commands

## 🔌 API Integration

The frontend communicates with the relay server at `http://localhost:3000`:

### Authentication Endpoints
- `POST /users` - User registration
- `POST /login` - User authentication
- `GET /protected` - Protected route example

### Data Endpoints
- `GET /agents` - Fetch registered agents
- `POST /agents` - Register new agent

### External Services
- `http://localhost:5050/tasks` - Task management (C++ server)

## 🛡️ Security Features

- JWT token-based authentication
- Protected routes with automatic redirects
- Input validation and sanitization
- CORS-enabled API communication
- Secure token storage and management

## 🚀 Getting Started

1. **Start the Relay Server** (required for authentication):
```bash
cd ../relay-server
node src/server.js
```

2. **Start the Frontend**:
```bash
npm run dev
```

3. **Access the Application**:
   - Open `http://localhost:5173`
   - Register a new account or login
   - Start managing your cron jobs!

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Header.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Monitor.jsx
│   │   └── NewJob.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
└── vite.config.js
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file for custom configuration:
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_TASKS_API_URL=http://localhost:5050
```

### Tailwind Configuration
Custom theme colors and utilities are defined in `tailwind.config.js`

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure relay server has CORS enabled
2. **Authentication Issues**: Check if relay server is running on port 3000
3. **Build Errors**: Clear node_modules and reinstall dependencies
4. **Styling Issues**: Verify Tailwind CSS is properly configured

### Development Tips

- Use browser dev tools for debugging
- Check network tab for API call issues
- Monitor console for JavaScript errors
- Use React Developer Tools extension

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for new components (optional)
3. Add proper error handling
4. Test authentication flows
5. Ensure responsive design

## 📄 License

This project is part of the distributed job scheduler system. 