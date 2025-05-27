import { useEffect, useState } from 'react';
import { Activity, CheckCircle, XCircle, RefreshCw, Terminal, Server, Clock, Zap, AlertCircle, TrendingUp, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import apiService from '../services/api';

export default function Monitor() {
  const [jobs, setJobs] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('jobs');
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.getJobs();
      setJobs(data);
    } catch (err) {
      setError('Error loading jobs: ' + err.message);
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.getAgents();
      setAgents(data);
    } catch (err) {
      setError('Error loading agents: ' + err.message);
      console.error('Error loading agents:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = () => {
    if (activeTab === 'jobs') {
      fetchJobs();
    } else {
      fetchAgents();
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-accent-emerald';
      case 'completed': return 'text-accent-cyan';
      case 'failed': return 'text-accent-rose';
      default: return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return Activity;
      case 'completed': return CheckCircle;
      case 'failed': return XCircle;
      default: return Clock;
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Bu işi silmek istediğinize emin misiniz?')) {
      return;
    }
    
    setDeleteLoading(jobId);
    setError('');
    
    try {
      await apiService.deleteJob(jobId);
      // İş başarıyla silindikten sonra listeyi güncelle
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (err) {
      setError('İş silinirken hata oluştu: ' + err.message);
      console.error('İş silinirken hata:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent-emerald/10 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      <Header />
      
      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center shadow-glow">
                  {activeTab === 'jobs' ? (
                    <Activity className="w-8 h-8 text-white" />
                  ) : (
                    <Server className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-emerald rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  {activeTab === 'jobs' ? 'Job Monitoring' : 'Agent Status'}
                </h1>
                <p className="text-text-secondary">
                  {activeTab === 'jobs' ? 'Track active jobs in real-time' : 'Monitor connected agents status'}
                </p>
              </div>
            </div>
            
            <button
              onClick={fetchData}
              disabled={loading}
              className="group flex items-center gap-3 px-6 py-3 bg-bg-glass backdrop-blur-xl border border-border-glass rounded-2xl hover:shadow-glass transition-all duration-300 disabled:opacity-50 hover:scale-105"
            >
              <RefreshCw className={`w-5 h-5 text-accent-cyan ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} />
              <span className="font-medium text-white">Refresh</span>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <button
                onClick={() => setActiveTab('jobs')}
              className={`group relative px-6 py-3 rounded-2xl transition-all duration-30
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'bg-bg-glass backdrop-blur-xl border border-border-glass text-text-secondary hover:text-white hover:shadow-glass'
              }`}
            > 
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5" />
                <span className="font-medium">Jobs</span>
                <div className="px-2 py-1 bg-white/20 rounded-lg text-xs font-semibold">
                  {jobs.length}
                </div>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('agents')}
              className={`group relative px-6 py-3 rounded-2xl transition-all duration-300 ${
                activeTab === 'agents'
                  ? 'bg-gradient-secondary text-white shadow-glow'
                  : 'bg-bg-glass backdrop-blur-xl border border-border-glass text-text-secondary hover:text-white hover:shadow-glass'
              }`}
            >
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5" />
                <span className="font-medium">Agents</span>
                <div className="px-2 py-1 bg-white/20 rounded-lg text-xs font-semibold">
                  {agents.length}
                </div>
              </div>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 animate-slide-up">
              <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-red-400 font-semibold mb-1">Error Occurred</h3>
                  <p className="text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20 animate-fade-in">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-secondary rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                </div>
                <div className="text-center">
                  <p className="text-white font-medium">Loading data...</p>
                  <p className="text-text-secondary text-sm">Please wait</p>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
              {activeTab === 'jobs' ? (
                // Jobs Tab
                jobs.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="bg-bg-glass backdrop-blur-xl rounded-3xl border border-border-glass p-12 max-w-md mx-auto">
                      <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Activity className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">No Jobs Yet</h3>
                      <p className="text-text-secondary mb-6">There are no running jobs on the system.</p>
                      <button className="px-6 py-3 bg-gradient-primary rounded-xl text-white font-medium hover:shadow-glow transition-all duration-300">
                        Create Your First Job
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {jobs.map((job, index) => (
                      <div 
                        key={job.id}
                        className="group bg-bg-glass backdrop-blur-xl rounded-2xl border border-border-glass p-6 hover:shadow-glass transition-all duration-300 hover:scale-[1.02] animate-scale-in"
                        style={{animationDelay: `${0.1 * index}s`}}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent-purple rounded-xl flex items-center justify-center">
                                <Terminal className="w-7 h-7 text-white" />
                              </div>
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-emerald rounded-full border-2 border-bg-dark"></div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-white">Job #{job.id}</h3>
                                <div className="px-3 py-1 bg-primary/20 rounded-lg">
                                  <span className="text-primary text-sm font-medium">Active</span>
                                </div>
                              </div>
                              <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-text-muted mb-1">Command</p>
                                  <p className="text-white font-mono bg-bg-medium px-3 py-1 rounded-lg">{job.command}</p>
                                </div>
                                <div>
                                  <p className="text-text-muted mb-1">Schedule</p>
                                  <p className="text-accent-cyan font-medium">{job.schedule}</p>
                                </div>
                                <div>
                                  <p className="text-text-muted mb-1">User</p>
                                  <p className="text-white">{job.username}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-text-muted text-sm">Last Run</p>
                              <p className="text-white font-medium">2 minutes ago</p>
                            </div>
                            <div className="w-3 h-3 bg-accent-emerald rounded-full animate-pulse"></div>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              disabled={deleteLoading === job.id}
                              className="p-2 bg-red-500/20 rounded-xl hover:bg-red-500/30 transition-colors duration-300"
                              title="İşi Sil"
                            >
                              {deleteLoading === job.id ? (
                                <RefreshCw className="w-5 h-5 text-red-400 animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5 text-red-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                // Agents Tab
                agents.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="bg-bg-glass backdrop-blur-xl rounded-3xl border border-border-glass p-12 max-w-md mx-auto">
                      <div className="w-20 h-20 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Server className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">No Agents Found</h3>
                      <p className="text-text-secondary mb-6">No agents are connected to the system.</p>
                      <button className="px-6 py-3 bg-gradient-secondary rounded-xl text-white font-medium hover:shadow-glow transition-all duration-300">
                        Agent Setup Guide
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {agents.map((agent, index) => (
                      <div 
                        key={agent.id}
                        className="group bg-bg-glass backdrop-blur-xl rounded-2xl border border-border-glass p-6 hover:shadow-glass transition-all duration-300 hover:scale-[1.02] animate-scale-in"
                        style={{animationDelay: `${0.1 * index}s`}}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-14 h-14 bg-gradient-secondary rounded-xl flex items-center justify-center">
                                <Server className="w-7 h-7 text-white" />
                              </div>
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-emerald rounded-full border-2 border-bg-dark animate-pulse"></div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-white">{agent.hostname}</h3>
                                <div className="px-3 py-1 bg-accent-emerald/20 rounded-lg">
                                  <span className="text-accent-emerald text-sm font-medium">Online</span>
                                </div>
                              </div>
                              <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-text-muted mb-1">IP Address</p>
                                  <p className="text-white font-mono">{agent.ip}</p>
                                </div>
                                <div>
                                  <p className="text-text-muted mb-1">Last Seen</p>
                                  <p className="text-accent-cyan">
                                    {agent.lastSeen ? new Date(agent.lastSeen).toLocaleString('en-US') : 'Never'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-text-muted mb-1">Status</p>
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-accent-emerald rounded-full animate-pulse"></div>
                                    <span className="text-accent-emerald font-medium">Active</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-text-muted text-sm">Uptime</p>
                              <p className="text-white font-medium">2 days 14 hours</p>
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="w-12 h-1 bg-bg-medium rounded-full overflow-hidden">
                                <div className="w-8/12 h-full bg-gradient-to-r from-accent-emerald to-accent-cyan"></div>
                              </div>
                              <p className="text-xs text-text-muted text-center">CPU: 67%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}