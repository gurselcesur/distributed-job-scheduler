import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Home, Plus, Activity, Zap } from 'lucide-react';

export default function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="relative w-full bg-bg-glass backdrop-blur-xl border-b border-border-glass shadow-glass">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
      
      <div className="relative px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-emerald rounded-full animate-pulse-slow"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CronFlow
            </h1>
            <p className="text-xs text-text-muted">Distributed Job Scheduler</p>
          </div>
        </div>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-6">
            {/* Navigation */}
            <nav className="flex gap-2">
              <Link
                to="/"
                className={`group relative px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive('/') 
                    ? 'bg-primary text-white shadow-glow' 
                    : 'text-text-secondary hover:text-white hover:bg-bg-light/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span className="font-medium">Home</span>
                </div>
                {isActive('/') && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
              </Link>
              
              <Link
                to="/new-job"
                className={`group relative px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive('/new-job') 
                    ? 'bg-primary text-white shadow-glow' 
                    : 'text-text-secondary hover:text-white hover:bg-bg-light/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">New Job</span>
                </div>
                {isActive('/new-job') && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
              </Link>
              
              <Link
                to="/monitor"
                className={`group relative px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive('/monitor') 
                    ? 'bg-primary text-white shadow-glow' 
                    : 'text-text-secondary hover:text-white hover:bg-bg-light/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span className="font-medium">Monitor</span>
                </div>
                {isActive('/monitor') && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
              </Link>
            </nav>
            
            {/* User section */}
            <div className="flex items-center gap-4 border-l border-border-glass pl-6">
              <div className="flex items-center gap-3 px-3 py-2 bg-bg-light/30 rounded-xl backdrop-blur-sm">
                <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user?.username || 'User'}</p>
                  <p className="text-xs text-text-muted">Online</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
              >
                <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <nav className="flex gap-3">
            <Link
              to="/login"
              className="px-6 py-2 text-text-secondary hover:text-white bg-bg-light/30 hover:bg-bg-light/50 rounded-xl transition-all duration-300 font-medium backdrop-blur-sm"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-gradient-primary hover:shadow-glow text-white rounded-xl transition-all duration-300 font-medium transform hover:scale-105"
            >
              Sign Up
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}