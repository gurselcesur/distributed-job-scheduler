import { useState } from 'react';
import { Clock, Terminal, Tag, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function NewJob() {
  const [schedule, setSchedule] = useState('');
  const [command, setCommand] = useState('');
  const [jobName, setJobName] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Cron expression presets
  const cronPresets = [
    { label: 'Every minute', value: '* * * * *' },
    { label: 'Every 5 minutes', value: '*/5 * * * *' },
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Every day at midnight', value: '0 0 * * *' },
    { label: 'Every Monday at 9 AM', value: '0 9 * * 1' },
    { label: 'Every month', value: '0 0 1 * *' }
  ];

  const validateCronExpression = (expression) => {
    const parts = expression.trim().split(/\s+/);
    return parts.length === 5;
  };

  const handleSubmit = async (e) => {
    setError('');
    setSuccess(false);
    setLoading(true);

    // Validation
    if (!validateCronExpression(schedule)) {
      setError('Invalid cron expression. Must have 5 parts (minute hour day month weekday)');
      setLoading(false);
      return;
    }

    const job = { 
      expression: schedule, 
      command, 
      jobName 
    };

    try {
      const res = await fetch('http://localhost:8080/add-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });

      if (res.ok) {
        setSuccess(true);
        setSchedule('');
        setCommand('');
        setJobName('');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const errorData = await res.text();
        setError(`Failed to add job: ${errorData}`);
      }
    } catch (err) {
      setError('Network error: Could not connect to server');
      console.error('Failed to send job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (presetValue) => {
    setSchedule(presetValue);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Add New Cron Job</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Job Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Tag className="w-4 h-4" />
                  Job Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. daily_backup, send_emails"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  required
                />
              </div>

              {/* Cron Schedule */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Clock className="w-4 h-4" />
                  Cron Schedule
                </label>
                <input
                  type="text"
                  placeholder="* * * * * (minute hour day month weekday)"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
                  required
                />
                
                {/* Quick presets */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {cronPresets.map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handlePresetSelect(preset.value)}
                      className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 hover:text-white transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Command */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Terminal className="w-4 h-4" />
                  Command
                </label>
                <input
                  type="text"
                  placeholder="e.g. echo 'Hello World', /usr/bin/backup.sh"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
                  required
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed p-3 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
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

              {/* Status Messages */}
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
            </div>
          </div>

          {/* Help Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Cron Format Help</h3>
              </div>
              
              <div className="space-y-4 text-sm text-gray-300">
                <div>
                  <p className="font-medium text-gray-200">Format:</p>
                  <code className="block mt-1 p-2 bg-gray-900 rounded text-green-400 font-mono">
                    * * * * *
                  </code>
                  <p className="text-xs mt-1 text-gray-400">
                    minute hour day month weekday
                  </p>
                </div>

                <div>
                  <p className="font-medium text-gray-200">Special Characters:</p>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li><code className="text-green-400">*</code> - Any value</li>
                    <li><code className="text-green-400">*/5</code> - Every 5 units</li>
                    <li><code className="text-green-400">1-5</code> - Range 1 to 5</li>
                    <li><code className="text-green-400">1,3,5</code> - Specific values</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-gray-200">Examples:</p>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li><code className="text-blue-400">0 0 * * *</code> - Daily at midnight</li>
                    <li><code className="text-blue-400">*/15 * * * *</code> - Every 15 minutes</li>
                    <li><code className="text-blue-400">0 9 * * 1-5</code> - Weekdays at 9 AM</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Current Job Preview */}
            {schedule && (
              <div className="mt-6 bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <span className="ml-2 text-white">{jobName || 'unnamed_job'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Schedule:</span>
                    <span className="ml-2 text-green-400 font-mono">{schedule}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Command:</span>
                    <span className="ml-2 text-blue-400 font-mono">{command || 'No command'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}