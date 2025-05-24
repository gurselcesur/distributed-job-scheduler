import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-dark text-text-main gap-12 px-4 text-center">
      <h1 className="text-9xl font-extrabold text-primary drop-shadow-lg">
        Cron Job Manager
      </h1>

      <div className="flex flex-wrap justify-center gap-8">
        <Link to="/new-job">
          <button className="w-64 py-6 text-2xl bg-primary hover:bg-primary-dark text-white rounded-2xl shadow-xl transition-transform duration-200 hover:scale-105">
          ➕ Add New Job
          </button>
        </Link>
        <Link to="/monitor">
          <button className="w-64 py-6 text-2xl bg-primary-light hover:bg-primary text-white rounded-2xl shadow-xl transition-transform duration-200 hover:scale-105">
            📊 Monitor Jobs
          </button>
        </Link>
      </div>

      <p className="max-w-2xl text-text-secondary text-lg leading-relaxed mt-12">
        This is a local Cron Job monitoring tool designed for 1–2 machines.  
        Define cron expressions, monitor job executions in real-time, and get notified about delays or failures — all through a sleek interface.
      </p>
    </div>
  );
}