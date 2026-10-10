import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Pill,
  Activity,
  ActivitySquare,
  X,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { APP_METADATA } from '../../styles/tokens';

export const navItems = [
  {
    name: 'Overview',
    path: '/overview',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: 'Patients',
    path: '/patients',
    icon: Users,
    badge: '12 Active',
  },
  {
    name: 'Alerts',
    path: '/alerts',
    icon: AlertTriangle,
    badge: '3 Critical',
    badgeVariant: 'bg-red-900/80 text-red-200 border border-red-700/50',
  },
  {
    name: 'Medication Safety',
    path: '/medication-safety',
    icon: Pill,
    badge: null,
  },
  {
    name: 'Monitoring Activity',
    path: '/monitoring-activity',
    icon: Activity,
    badge: 'Live',
    badgeVariant: 'bg-emerald-900/80 text-emerald-200 border border-emerald-700/50',
  },
];

export function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/70 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-navy-950 text-slate-300 flex flex-col border-r border-navy-800 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header / Brand */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-navy-900 bg-navy-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-teal-800/80 border border-teal-600/50 flex items-center justify-center text-teal-200 shadow-sm">
              <ActivitySquare className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h1 className="font-bold text-base text-white tracking-wide leading-none flex items-center gap-1.5">
                {APP_METADATA.name}
              </h1>
              <span className="text-[10px] uppercase font-semibold text-teal-400 tracking-wider">
                Clinical Safety
              </span>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section Label */}
        <div className="px-4 pt-5 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Clinical Operations
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    isActive
                      ? 'bg-teal-900/40 text-white font-semibold border-l-4 border-teal-500 pl-2'
                      : 'text-slate-300 hover:bg-navy-900/80 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                          item.badgeVariant || 'bg-navy-800 text-slate-300 border border-navy-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Live System Status Widget */}
        <div className="p-3 m-3 bg-navy-900/70 border border-navy-800/80 rounded-lg text-xs space-y-2 shrink-0">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-slate-400">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              Telemetry Feed
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
              <CheckCircle2 className="w-3 h-3" /> Live
            </span>
          </div>
          <div className="text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>ML Risk Model:</span>
              <span className="text-slate-300 font-mono">v2.4 (Active)</span>
            </div>
            <div className="flex justify-between">
              <span>Bedside Devices:</span>
              <span className="text-slate-300 font-mono">12 Connected</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-3 border-t border-navy-900 text-[10px] text-slate-400 shrink-0 flex items-center justify-between">
          <span>VitalWatch Engine</span>
          <span className="font-mono text-slate-300">{APP_METADATA.version}</span>
        </div>
      </aside>
    </>
  );
}
