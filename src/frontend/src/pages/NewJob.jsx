import { useState } from 'react';

export default function NewJob() {
  const [schedule, setSchedule] = useState('');
  const [command, setCommand] = useState('');
  const [jobName, setJobName] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const job = { schedule, command, jobName };

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
      }
    } catch (err) {
      console.error('Failed to send job:', err);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-text-main p-8">
      <h2 className="text-3xl text-text-white font-bold mb-6">➕ Add New Job</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          placeholder="Cron Schedule (e.g. * * * * *)"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          className="p-3 rounded bg-bg-medium text-text-white"
          required
        />
        <input
          type="text"
          placeholder="Command (e.g. echo Hello)"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="p-3 rounded bg-bg-medium text-text-white"
          required
        />
        <input
          type="text"
          placeholder="Job Name (e.g. task_1)"
          value={jobName}
          onChange={(e) => setJobName(e.target.value)}
          className="p-3 rounded bg-bg-medium text-text-white"
          required
        />

        <button type="submit" className="bg-primary hover:bg-primary-dark p-3 rounded text-white">
          Save Job
        </button>
        {success && <p className="text-accent-success">Job added successfully!</p>}
      </form>
    </div>
  );
}