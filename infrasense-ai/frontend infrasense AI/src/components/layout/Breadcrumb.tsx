import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map route paths to friendly titles
  const routeMap: Record<string, string> = {
    citizen: 'Citizen Portal',
    dashboard: 'Dashboard',
    report: 'Report Damage',
    new: 'New Report',
    reports: 'Report History',
    officer: 'Officer Operations',
    requests: 'Citizen Requests',
  };

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 select-none py-1">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const title = routeMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

        return (
          <React.Fragment key={to}>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            {last ? (
              <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                {title}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
              >
                {title}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
