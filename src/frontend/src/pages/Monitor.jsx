import { useEffect, useState } from 'react';
import { Activity, CheckCircle, XCircle, RefreshCw, Terminal } from 'lucide-react';

export default function Monitor() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5050/tasks');
      if (!res.ok) throw new Error('Failed to load tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError('Error loading tasks: ' + err.message);
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-bg-dark text-text-main p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Task List</h2>
          </div>
          
          <button
            onClick={fetchTasks}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-bg-medium hover:bg-bg-light rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400 mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-text-secondary">Loading tasks...</span>
            </div>
          </div>
        )}

        {/* Task List */}
        {!loading && !error && (
          <div className="bg-bg-medium rounded-lg border border-bg-light overflow-hidden">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary">No tasks found</p>
              </div>
            ) : (
              <div className="divide-y divide-bg-light">
                {tasks.map((task) => (
                  <div 
                    key={task.id}
                    className="p-4 hover:bg-bg-light/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-primary/20 rounded">
                          <Terminal className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">ID: {task.id}</h3>
                          <p className="text-sm text-text-secondary mt-1">Command: {task.command}</p>
                          <p className="text-sm text-text-secondary">Schedule: {task.schedule}</p>
                          <p className="text-sm text-text-secondary">User: {task.username}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-6 text-center text-text-secondary text-sm">
          <p>Auto-refresh every 30 seconds • Total {tasks.length} tasks</p>
        </div>
      </div>
    </div>
  );
}