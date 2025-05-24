import { useEffect, useState } from 'react';

export default function Monitor() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/logs')
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error('Failed to fetch logs:', err));
  }, []);

  return (
    <div className="min-h-screen bg-bg-dark text-text-main p-8">
      <h2 className="text-3xl text-text-white font-bold mb-6">📊 Monitor Logs</h2>

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-bg-light text-sm uppercase">
            <th className="p-3">Job Name</th>
            <th className="p-3">Scheduled</th>
            <th className="p-3">Executed</th>
            <th className="p-3">Delay (s)</th>
            <th className="p-3">Success</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index} className="border-b border-bg-medium hover:bg-bg-medium/70">
              <td className="p-3">{log.jobName}</td>
              <td className="p-3">{log.scheduled}</td>
              <td className="p-3">{log.executed}</td>
              <td className="p-3">{log.delaySeconds}</td>
              <td className="p-3">
                {log.success ? (
                  <span className="text-accent-success">✅</span>
                ) : (
                  <span className="text-accent-error">❌</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}