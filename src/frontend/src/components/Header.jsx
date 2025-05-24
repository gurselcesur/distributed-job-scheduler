import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="w-full bg-bg-medium text-text-white px-8 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-3xl font-bold text-primary">Cron Job Manager</h1>
      <nav className="flex gap-3">
        <Link
          to="/"
          className="bg-bg-light hover:bg-primary text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          Home
        </Link>
        <Link
          to="/new-job"
          className="bg-bg-light hover:bg-primary text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          New Job
        </Link>
        <Link
          to="/monitor"
          className="bg-bg-light hover:bg-primary text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          Monitor
        </Link>
      </nav>
    </header>
  );
}