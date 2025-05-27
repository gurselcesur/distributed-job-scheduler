import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Activity, Zap, Server, Clock, Users, TrendingUp, Sparkles } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  const stats = [
    { icon: Clock, label: 'Active Jobs', value: '12', color: 'text-accent-cyan' },
    { icon: Server, label: 'Connected Agents', value: '3', color: 'text-accent-emerald' },
    { icon: TrendingUp, label: 'Success Rate', value: '98%', color: 'text-accent-orange' },
    { icon: Users, label: 'Total Users', value: '5', color: 'text-secondary' },
  ];

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-accent-purple/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <Header />
      
      <div className="relative z-10 px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow animate-pulse-slow">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent-orange animate-bounce-slow" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-extrabold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                CronFlow
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary mb-4 max-w-3xl mx-auto">
              Distributed Job Scheduler System
            </p>
            
            {user?.username && (
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-bg-glass backdrop-blur-xl rounded-2xl border border-border-glass shadow-glass animate-slide-up">
                <div className="w-3 h-3 bg-accent-emerald rounded-full animate-pulse"></div>
                <span className="text-text-main font-medium">
                  Welcome, <span className="text-white font-semibold">{user.username}</span>!
                </span>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 animate-slide-up" style={{animationDelay: '0.2s'}}>
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="group relative bg-bg-glass backdrop-blur-xl rounded-2xl border border-border-glass p-6 hover:shadow-glass transition-all duration-300 hover:scale-105 animate-scale-in"
                style={{animationDelay: `${0.1 * index}s`}}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br from-bg-light to-bg-medium group-hover:shadow-glow transition-all duration-300`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-text-muted">{stat.label}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-slide-up" style={{animationDelay: '0.4s'}}>
            <Link to="/new-job" className="group">
              <div className="relative bg-bg-glass backdrop-blur-xl rounded-3xl border border-border-glass p-8 hover:shadow-glass transition-all duration-500 hover:scale-105 overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent-purple rounded-2xl flex items-center justify-center shadow-glow group-hover:shadow-glow-pink transition-all duration-300">
                      <Plus className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
                    </div>
                    <div>
                                          <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                      New Job
                    </h3>
                      <p className="text-text-muted">Create cron job</p>
                    </div>
                  </div>
                  
                  <p className="text-text-secondary leading-relaxed mb-6">
                    Create a new scheduled job. Plan your tasks using cron expressions and distribute them to your agents.
                  </p>
                  
                  <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-4 transition-all duration-300">
                    <span>Create Job</span>
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300">
                      <Plus className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/monitor" className="group">
              <div className="relative bg-bg-glass backdrop-blur-xl rounded-3xl border border-border-glass p-8 hover:shadow-glass transition-all duration-500 hover:scale-105 overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/20 to-accent-emerald/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center shadow-glow group-hover:shadow-glow transition-all duration-300">
                      <Activity className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                                          <h3 className="text-2xl font-bold text-white group-hover:text-accent-cyan transition-colors duration-300">
                      Monitor Jobs
                    </h3>
                    <p className="text-text-muted">Real-time tracking</p>
                    </div>
                  </div>
                  
                  <p className="text-text-secondary leading-relaxed mb-6">
                    Monitor your running jobs in real-time. Check agent status and track system performance.
                  </p>
                  
                  <div className="flex items-center gap-2 text-accent-cyan font-medium group-hover:gap-4 transition-all duration-300">
                    <span>Start Monitoring</span>
                    <div className="w-6 h-6 bg-accent-cyan/20 rounded-full flex items-center justify-center group-hover:bg-accent-cyan/30 transition-colors duration-300">
                      <Activity className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>


        </div>
      </div>
    </div>
  );
}