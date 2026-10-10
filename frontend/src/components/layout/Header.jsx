import React, { useState, useEffect } from 'react';
import { Menu, Bell, Clock, ShieldCheck, User, ChevronDown } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { APP_METADATA } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';

export function Header({ onOpenMobileMenu, currentTitle }) {
  const { currentRole, changeRole, roles } = useApp();
  const [timeStr, setTimeStr] = useState('');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shrink-0 shadow-subtle z-10">
      {/* Left section: Mobile menu toggle, Title & Breadcrumbs */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-teal-600"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <Breadcrumbs />
          <h2 className="text-base md:text-lg font-bold text-slate-900 tracking-tight leading-tight">
            {currentTitle || 'Overview'}
          </h2>
        </div>
      </div>

      {/* Right section: UTC Clock, Notification Bell, Role Selector */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* UTC Live Telemetry Sync Clock */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded text-slate-700 text-xs font-mono font-medium border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-teal-700" />
          <span>{timeStr || '12:00:00 UTC'}</span>
        </div>

        {/* Notifications Indicator */}
        <div className="relative">
          <button
            type="button"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors relative focus:outline-none focus:ring-2 focus:ring-teal-600"
            aria-label="Clinical Alerts Notifications"
            title="Active Critical Alerts"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white animate-pulse" />
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* Role Switcher Dropdown Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 py-1 px-2.5 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <div className="w-7 h-7 rounded-full bg-teal-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {currentRole.name[0]}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-none flex items-center gap-1">
                {currentRole.name}
                <ShieldCheck className="w-3 h-3 text-teal-600" />
              </span>
              <span className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                {currentRole.title}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {/* Role Selection Dropdown Menu */}
          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 text-xs">
              <div className="px-3 py-2 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                Frontend Role Preview (Demo)
              </div>
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    changeRole(r.id);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    r.id === currentRole.id ? 'bg-teal-50 text-teal-900 font-bold border-l-2 border-teal-600' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{r.title}</div>
                  </div>
                  {r.id === currentRole.id && <ShieldCheck className="w-4 h-4 text-teal-600" />}
                </button>
              ))}
              <div className="px-3 py-1.5 border-t border-slate-100 text-[10px] text-slate-400 bg-slate-50 rounded-b-lg">
                Frontend-only role preview control.
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
