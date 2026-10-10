import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels = {
  overview: 'Overview',
  patients: 'Patient Directory',
  alerts: 'Alert Center',
  'medication-safety': 'Medication Safety',
  'monitoring-activity': 'Monitoring Activity',
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-slate-500 font-medium">
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li>
          <Link
            to="/overview"
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const label = routeLabels[value] || value.replace(/-/g, ' ');

          return (
            <li key={to} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              {isLast ? (
                <span className="text-slate-800 font-semibold capitalize">{label}</span>
              ) : (
                <Link
                  to={to}
                  className="text-slate-500 hover:text-slate-800 transition-colors capitalize"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
