import { useState } from 'react';
import { Clock, Terminal, User, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function NewJob() {
  const [schedule, setSchedule] = useState('');
  const [command, setCommand] = useState('');
  const [username, setUsername] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cronPresets = [
    { label: 'Every minute', value: '* * * * *' },
    { label: 'Every 5 minutes', value: '*/5 * * * *' },
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Every day at midnight', value: '0 0 * * *' },
    { label: 'Every Monday at 9 AM', value: '0 9 * * 1' },
    { label: 'Every month', value: '0 0 1 * *' }
  ];

  const validateCronExpression = (expression) => expression.trim().split(/\s+/).length === 5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (!validateCronExpression(schedule)) {
      setError('Invalid cron expression. It must include 5 parts: minute hour day month weekday.');
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
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold">Add New Cron Job</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <User className="w-4 h-4" />
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. tanay"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
                  required
                />
              </div>

              {/* Cron schedule */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Clock className="w-4 h-4" />
                  Cron Schedule
                </label>
                <input
                  type="text"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="* * * * * (minute hour day month weekday)"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg font-mono"
                  required
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {cronPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetSelect(preset.value)}
                      className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Command */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Terminal className="w-4 h-4" />
                  Command
                </label>
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="e.g. echo 'Hello World'"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding Job...
                  </>
                ) : (
                  'Add Job'
                )}
              </button>

              {/* Status */}
              {success && (
                <div className="flex items-center gap-2 p-4 bg-green-900/20 border border-green-700 rounded-lg text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  Job added successfully!
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Help panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold">Cron Format Help</h3>
              </div>
              <div className="text-sm text-gray-300 space-y-2">
                <p><strong>Format:</strong></p>
                <code className="block bg-gray-900 p-2 rounded text-green-400 font-mono">* * * * *</code>
                <p className="text-xs">minute hour day month weekday</p>
                <p><strong>Examples:</strong></p>
                <ul className="space-y-1 text-xs">
                  <li><code className="text-blue-400">0 0 * * *</code> — Daily at midnight</li>
                  <li><code className="text-blue-400">*/15 * * * *</code> — Every 15 minutes</li>
                  <li><code className="text-blue-400">0 9 * * 1-5</code> — Weekdays at 9 AM</li>
                </ul>
              </div>
            </div>

            {/* Preview */}
            {schedule && (
              <div className="mt-6 bg-gray-800 p-6 border border-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Preview</h3>
                <div className="text-sm space-y-2">
                  <div><span className="text-gray-400">User:</span> <span className="text-white">{username}</span></div>
                  <div><span className="text-gray-400">Schedule:</span> <span className="text-green-400 font-mono">{schedule}</span></div>
                  <div><span className="text-gray-400">Command:</span> <span className="text-blue-400 font-mono">{command}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}