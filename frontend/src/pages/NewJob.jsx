import { useState } from 'react';
import { Clock, Terminal, User, CheckCircle, AlertCircle, Info, Plus, Sparkles, Code, Calendar } from 'lucide-react';
import Header from '../components/Header';

export default function NewJob() {
  const [schedule, setSchedule] = useState('');
  const [command, setCommand] = useState('');
  const [username, setUsername] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cronPresets = [
    { label: 'Every minute', value: '* * * * *', icon: '⏱️' },
    { label: 'Every 5 minutes', value: '*/5 * * * *', icon: '🕐' },
    { label: 'Every hour', value: '0 * * * *', icon: '⏰' },
    { label: 'Daily (midnight)', value: '0 0 * * *', icon: '🌙' },
    { label: 'Monday 09:00', value: '0 9 * * 1', icon: '📅' },
    { label: 'Monthly', value: '0 0 1 * *', icon: '📆' }
  ];

  const validateCronExpression = (expression) => expression.trim().split(/\s+/).length === 5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (!validateCronExpression(schedule)) {
              setError('Invalid cron expression. Must contain 5 parts: minute hour day month day-of-week.');
      setLoading(false);
      return;
    }

    if (!username.trim()) {
      setError('Username is required.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5050/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, schedule, username })
      });

      if (res.ok) {
        setSuccess(true);
        setSchedule('');
        setCommand('');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const errorText = await res.text();
        setError(`Failed to add job: ${errorText}`);
      }
    } catch (err) {
              setError('Network error: Could not connect to server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (value) => setSchedule(value);

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-purple/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <Header />
      
      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent-purple rounded-2xl flex items-center justify-center shadow-glow">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent-orange animate-bounce-slow" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              New <span className="bg-gradient-primary bg-clip-text text-transparent">Cron Job</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Create scheduled jobs and distribute them to your agents
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="xl:col-span-2 animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="bg-bg-glass backdrop-blur-xl rounded-3xl border border-border-glass p-8 shadow-glass">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Username Field */}
                  <div className="group">
                    <label className="flex items-center gap-3 text-lg font-semibold mb-4 text-white">
                      <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g: john"
                        className="w-full p-4 bg-bg-medium/50 backdrop-blur-sm border border-border-glass rounded-2xl text-white placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 group-hover:border-border-light"
                        required
                      />
                      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Cron Schedule Field */}
                  <div className="group">
                    <label className="flex items-center gap-3 text-lg font-semibold mb-4 text-white">
                      <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      Cron Schedule
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={schedule}
                        onChange={(e) => setSchedule(e.target.value)}
                        placeholder="* * * * * (minute hour day month day-of-week)"
                        className="w-full p-4 bg-bg-medium/50 backdrop-blur-sm border border-border-glass rounded-2xl font-mono text-white placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 group-hover:border-border-light"
                        required
                      />
                      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    
                    {/* Preset Buttons */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                      {cronPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handlePresetSelect(preset.value)}
                          className="group flex items-center gap-2 p-3 bg-bg-medium/30 hover:bg-bg-light/30 border border-border-glass hover:border-primary/50 rounded-xl transition-all duration-300 hover:scale-105"
                        >
                          <span className="text-lg">{preset.icon}</span>
                          <div className="text-left">
                            <p className="text-sm font-medium text-white">{preset.label}</p>
                            <p className="text-xs text-text-muted font-mono">{preset.value}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Command Field */}
                  <div className="group">
                    <label className="flex items-center gap-3 text-lg font-semibold mb-4 text-white">
                      <div className="w-8 h-8 bg-gradient-to-br from-accent-cyan to-accent-emerald rounded-lg flex items-center justify-center">
                        <Terminal className="w-4 h-4 text-white" />
                      </div>
                      Command
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        placeholder="e.g: echo Hello World"
                        className="w-full p-4 bg-bg-medium/50 backdrop-blur-sm border border-border-glass rounded-2xl font-mono text-white placeholder-text-muted focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all duration-300 group-hover:border-border-light"
                        required
                      />
                      <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full p-4 bg-gradient-primary hover:shadow-glow rounded-2xl text-white font-semibold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      {loading ? (
                        <>
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Adding Job...
                        </>
                      ) : (
                        <>
                          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                          Add Job
                        </>
                      )}
                    </div>
                  </button>

                  {/* Status Messages */}
                  {success && (
                    <div className="flex items-center gap-4 p-4 bg-accent-emerald/10 backdrop-blur-xl border border-accent-emerald/30 rounded-2xl animate-slide-up">
                      <div className="w-12 h-12 bg-accent-emerald/20 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-accent-emerald" />
                      </div>
                      <div>
                        <h3 className="text-accent-emerald font-semibold">Success!</h3>
                        <p className="text-accent-emerald/80">Job added successfully.</p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-4 p-4 bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl animate-slide-up">
                      <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-red-400 font-semibold">Error!</h3>
                        <p className="text-red-300">{error}</p>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Help Panel */}
            <div className="xl:col-span-1 space-y-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
              {/* Cron Help */}
              <div className="bg-bg-glass backdrop-blur-xl rounded-3xl border border-border-glass p-6 shadow-glass">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-cyan to-primary rounded-xl flex items-center justify-center">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Cron Format Help</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-text-secondary mb-2 font-medium">Format:</p>
                    <div className="bg-bg-medium rounded-xl p-3 border border-border-glass">
                      <code className="text-accent-emerald font-mono text-lg">* * * * *</code>
                    </div>
                    <p className="text-xs text-text-muted mt-2">minute hour day month day-of-week</p>
                  </div>
                  
                  <div>
                    <p className="text-text-secondary mb-3 font-medium">Examples:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2 bg-bg-medium/30 rounded-lg">
                        <code className="text-accent-cyan font-mono text-sm">0 0 * * *</code>
                        <span className="text-text-muted text-sm">— Daily midnight</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-bg-medium/30 rounded-lg">
                        <code className="text-accent-cyan font-mono text-sm">*/15 * * * *</code>
                        <span className="text-text-muted text-sm">— Every 15 minutes</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-bg-medium/30 rounded-lg">
                        <code className="text-accent-cyan font-mono text-sm">0 9 * * 1-5</code>
                        <span className="text-text-muted text-sm">— Weekdays 09:00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              {schedule && (
                <div className="bg-bg-glass backdrop-blur-xl rounded-3xl border border-border-glass p-6 shadow-glass animate-scale-in">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-secondary rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Preview</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-bg-medium/30 rounded-xl border border-border-glass">
                      <p className="text-text-muted text-sm mb-1">Schedule:</p>
                      <code className="text-accent-cyan font-mono text-lg">{schedule}</code>
                    </div>
                    {command && (
                      <div className="p-3 bg-bg-medium/30 rounded-xl border border-border-glass">
                        <p className="text-text-muted text-sm mb-1">Command:</p>
                        <code className="text-white font-mono">{command}</code>
                      </div>
                    )}
                    {username && (
                      <div className="p-3 bg-bg-medium/30 rounded-xl border border-border-glass">
                        <p className="text-text-muted text-sm mb-1">User:</p>
                        <span className="text-white font-medium">{username}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="bg-bg-glass backdrop-blur-xl rounded-3xl border border-border-glass p-6 shadow-glass">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-orange to-accent-rose rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Tips</h3>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent-emerald rounded-full mt-2"></div>
                    <p className="text-text-secondary">You can quickly get started using the preset templates above.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent-cyan rounded-full mt-2"></div>
                    <p className="text-text-secondary">Make sure your commands are secure.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent-purple rounded-full mt-2"></div>
                    <p className="text-text-secondary">You can track your jobs from the Monitor page.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}