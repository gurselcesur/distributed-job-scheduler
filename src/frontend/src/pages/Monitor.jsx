import { useEffect, useState } from 'react';
import { Activity, Clock, CheckCircle, XCircle, RefreshCw, Calendar, Terminal, AlertTriangle } from 'lucide-react';

export default function Monitor() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, success, failed
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/logs');
      if (!res.ok) throw new Error('Failed to fetch logs');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      setError('Failed to fetch logs: ' + err.message);
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (success) => {
    return success ? 'text-primary' : 'text-red-400';
  };

  const getDelayColor = (delay) => {
    if (delay < 1) return 'text-primary';
    if (delay < 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Filter and search logs
  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || 
      (filter === 'success' && log.success) || 
      (filter === 'failed' && !log.success);
    
    const matchesSearch = searchTerm === '' || 
      log.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.output && log.output.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  // Statistics
  const totalJobs = logs.length;
  const successfulJobs = logs.filter(log => log.success).length;
  const failedJobs = totalJobs - successfulJobs;
  const avgDelay = logs.length > 0 ? 
    (logs.reduce((sum, log) => sum + (log.delay || 0), 0) / logs.length).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-bg-dark text-text-main p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Job Monitor</h2>
          </div>
          
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-bg-medium hover:bg-bg-light rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-bg-medium rounded-lg p-6 border border-bg-light">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-text-secondary text-sm">Total Jobs</p>
                <p className="text-2xl font-bold text-white">{totalJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-medium rounded-lg p-6 border border-bg-light">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-text-secondary text-sm">Successful</p>
                <p className="text-2xl font-bold text-primary">{successfulJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-medium rounded-lg p-6 border border-bg-light">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600 rounded-lg">
                <XCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-text-secondary text-sm">Failed</p>
                <p className="text-2xl font-bold text-red-400">{failedJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-medium rounded-lg p-6 border border-bg-light">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-600 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-text-secondary text-sm">Avg Delay</p>
                <p className="text-2xl font-bold text-white">{avgDelay}s</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-bg-medium rounded-lg p-6 mb-6 border border-bg-light">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-bg-light text-text-secondary hover:bg-bg-light hover:text-text-main'
                }`}
              >
                All ({totalJobs})
              </button>
              <button
                onClick={() => setFilter('success')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'success' 
                    ? 'bg-primary text-white' 
                    : 'bg-bg-light text-text-secondary hover:bg-bg-light hover:text-text-main'
                }`}
              >
                Success ({successfulJobs})
              </button>
              <button
                onClick={() => setFilter('failed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'failed' 
                    ? 'bg-primary text-white' 
                    : 'bg-bg-light text-text-secondary hover:bg-bg-light hover:text-text-main'
                }`}
              >
                Failed ({failedJobs})
              </button>
            </div>

            <input
              type="text"
              placeholder="Search jobs or output..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-bg-light border border-bg-light rounded-lg text-white placeholder-text-secondary focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400 mb-6">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-text-secondary">Loading logs...</span>
            </div>
          </div>
        )}

        {/* Logs Table */}
        {!loading && !error && (
          <div className="bg-bg-medium rounded-lg border border-bg-light overflow-hidden">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary">No logs found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-bg-light">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-text-secondary uppercase tracking-wider">
                        Job Name
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-text-secondary uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Scheduled
                        </div>
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-text-secondary uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Executed
                        </div>
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-text-secondary uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Delay
                        </div>
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-text-secondary uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-text-secondary uppercase tracking-wider">
                        Output
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log, index) => (
                      <tr 
                        key={index} 
                        className="border-b border-bg-light hover:bg-bg-light/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-primary/20 rounded">
                              <Terminal className="w-3 h-3 text-primary" />
                            </div>
                            <span className="font-medium text-white">{log.jobName}</span>
                          </div>
                        </td>
                        <td className="p-4 text-text-secondary text-sm font-mono">
                          {log.scheduledAt ? formatDateTime(log.scheduledAt) : 'N/A'}
                        </td>
                        <td className="p-4 text-text-secondary text-sm font-mono">
                          {log.executedAt ? formatDateTime(log.executedAt) : 'N/A'}
                        </td>
                        <td className="p-4">
                          <span className={`text-sm font-medium ${getDelayColor(log.delay || 0)}`}>
                            {log.delay || 0}s
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {log.success ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-primary" />
                                <span className="text-primary text-sm font-medium">Success</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-red-400" />
                                <span className="text-red-400 text-sm font-medium">Failed</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          {log.output ? (
                            <code className="text-xs bg-bg-dark px-2 py-1 rounded text-primary font-mono max-w-xs truncate block">
                              {log.output}
                            </code>
                          ) : (
                            <span className="text-text-secondary text-sm">No output</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-6 text-center text-text-secondary text-sm">
          <p>Auto-refresh every 30 seconds • Showing {filteredLogs.length} of {totalJobs} logs</p>
        </div>
      </div>
    </div>
  );
}