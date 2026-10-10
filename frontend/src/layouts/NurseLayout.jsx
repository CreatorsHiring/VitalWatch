import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  HeartPulse,
  Activity,
  AlertTriangle,
  Pill,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Search,
  Bell,
  ShieldAlert,
  Clock,
  User,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markNotificationRead, getAllAlerts } from '../services/api';

export default function NurseLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [notificationsList, setNotificationsList] = useState([]);
  const [unacknowledgedAlertsCount, setUnacknowledgedAlertsCount] = useState(0);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Fetch notifications & alert count periodically
  const fetchLiveStatus = async () => {
    try {
      const [notifRes, alertsRes] = await Promise.all([
        getNotifications().catch(() => ({ notifications: [] })),
        getAllAlerts('unacknowledged').catch(() => ({ alerts: [] })),
      ]);

      if (notifRes?.notifications) {
        setNotificationsList(notifRes.notifications);
      }
      if (alertsRes?.alerts) {
        setUnacknowledgedAlertsCount(alertsRes.alerts.length);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchLiveStatus();
    const timer = setInterval(fetchLiveStatus, 15000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMarkAsRead = async (notifId, e) => {
    if (e) e.stopPropagation();
    try {
      await markNotificationRead(notifId);
      setNotificationsList((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
      );
    } catch {
      // optimistic local update
      setNotificationsList((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
      );
    }
  };

  const unreadNotifsCount = notificationsList.filter((n) => !n.isRead).length;

  const navItems = [
    {
      to: '/nurse/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/nurse/patients',
      label: 'My Patients',
      icon: HeartPulse,
    },
    {
      to: '/nurse/logs',
      label: 'Patient Logs',
      icon: Activity,
    },
    {
      to: '/nurse/alerts',
      label: 'Clinical Alerts',
      icon: AlertTriangle,
      badge: unacknowledgedAlertsCount > 0 ? unacknowledgedAlertsCount : null,
    },
    {
      to: '/nurse/check-medicine',
      label: 'Check Medicine',
      icon: Pill,
    },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/nurse/dashboard?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] flex flex-col font-sans selection:bg-[#EAF7F0] selection:text-[#105C43]">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-30 w-full bg-white border-b border-[#E2EAE5] shadow-2xs">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Left: Mobile Toggle & Brand & Title */}
            <div className="flex items-center gap-3 sm:gap-6">
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-[#64746C] hover:text-[#172B24] hover:bg-[#F7FAF8] focus:outline-hidden focus:ring-2 focus:ring-[#16845B]"
                aria-label="Toggle Navigation Drawer"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <NavLink to="/nurse/dashboard" className="flex items-center">
                <Logo size="small" showTagline={false} />
              </NavLink>

              <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[#E2EAE5]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#16845B] bg-[#EAF7F0] px-2.5 py-0.5 rounded-full border border-[#CDEBDC]">
                  Nurse Dashboard
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Telemetry</span>
                </div>
              </div>
            </div>

            {/* Center: Global Patient Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex items-center flex-1 max-w-md mx-6"
            >
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64746C]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search patient by name, ID (e.g. PAT-1001), or room..."
                  className="w-full pl-10 pr-4 py-2 bg-[#F7FAF8] border border-[#E2EAE5] rounded-xl text-xs text-[#172B24] placeholder-[#64746C] focus:bg-white focus:outline-hidden focus:border-[#16845B] focus:ring-2 focus:ring-[#16845B]/15 transition-all"
                />
              </div>
            </form>

            {/* Right: Notifications & Nurse Profile Dropdown */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Notifications Popover */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2.5 rounded-xl text-[#64746C] hover:text-[#172B24] hover:bg-[#F7FAF8] border border-transparent hover:border-[#E2EAE5] transition-all cursor-pointer focus:outline-hidden"
                  aria-label="Clinical Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs animate-pulse">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E2EAE5] py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-[#E2EAE5] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-[#16845B]" />
                        <h4 className="text-xs font-bold text-[#172B24]">Clinical Notifications</h4>
                      </div>
                      <span className="text-[10px] font-semibold text-[#64746C] bg-[#F7FAF8] px-2 py-0.5 rounded-md border border-[#E2EAE5]">
                        {unreadNotifsCount} Unread
                      </span>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-[#E2EAE5]/60">
                      {notificationsList.length === 0 ? (
                        <div className="p-6 text-center text-xs text-[#64746C]">
                          No active notifications or alerts.
                        </div>
                      ) : (
                        notificationsList.map((notif) => {
                          const isCritical = notif.priority === 'critical';
                          const isHigh = notif.priority === 'high';

                          return (
                            <div
                              key={notif.id}
                              onClick={() => {
                                handleMarkAsRead(notif.id);
                                setNotifDropdownOpen(false);
                                if (notif.patientId) {
                                  navigate(`/nurse/patients/${notif.patientId}`);
                                } else {
                                  navigate('/nurse/alerts');
                                }
                              }}
                              className={`p-3.5 text-xs transition-colors cursor-pointer hover:bg-[#F7FAF8] ${
                                !notif.isRead ? 'bg-[#EAF7F0]/40' : 'bg-white'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`w-2 h-2 rounded-full ${
                                      isCritical
                                        ? 'bg-rose-500'
                                        : isHigh
                                        ? 'bg-amber-500'
                                        : 'bg-[#16845B]'
                                    }`}
                                  />
                                  <span className="font-bold text-[#172B24] truncate">
                                    {notif.title}
                                  </span>
                                </div>
                                <span className="text-[10px] text-[#64746C] shrink-0 flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" />
                                  {new Date(notif.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              <p className="mt-1 text-[11px] text-[#64746C] line-clamp-2">
                                {notif.message}
                              </p>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-[10px] font-semibold text-[#16845B] hover:underline flex items-center gap-0.5">
                                  <span>View Patient</span>
                                  <ChevronRight className="w-3 h-3" />
                                </span>
                                {!notif.isRead && (
                                  <button
                                    type="button"
                                    onClick={(e) => handleMarkAsRead(notif.id, e)}
                                    className="text-[10px] text-[#64746C] hover:text-[#16845B]"
                                  >
                                    Mark Read
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="p-2 border-t border-[#E2EAE5] bg-[#F7FAF8] text-center">
                      <NavLink
                        to="/nurse/alerts"
                        onClick={() => setNotifDropdownOpen(false)}
                        className="text-xs font-semibold text-[#16845B] hover:text-[#105C43] inline-flex items-center gap-1"
                      >
                        <span>View All Clinical Alerts</span>
                        <ExternalLink className="w-3 h-3" />
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>

              {/* Nurse Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-[#F7FAF8] border border-transparent hover:border-[#E2EAE5] transition-all cursor-pointer focus:outline-hidden group"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#EAF7F0] border border-[#CDEBDC] text-[#16845B] flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-[#E2F5EC] transition-colors">
                    <User className="w-4 h-4 text-[#16845B]" />
                  </div>
                  <div className="hidden md:flex flex-col text-left leading-tight">
                    <span className="text-xs font-bold text-[#172B24]">
                      {user?.name || 'Sarah Vance, RN'}
                    </span>
                    <span className="text-[10px] text-[#64746C]">
                      {user?.roleTitle || 'Senior Caretaker'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#64746C] hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E2EAE5] py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-[#E2EAE5]">
                      <p className="text-xs font-bold text-[#172B24]">{user?.name || 'Sarah Vance, RN'}</p>
                      <p className="text-[11px] text-[#64746C] truncate">{user?.email || 'nurse.vance@vitalwatch.hospital'}</p>
                      <span className="mt-1 inline-block text-[10px] font-semibold text-[#16845B] bg-[#EAF7F0] px-2 py-0.5 rounded">
                        Authorized Nursing Station
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setProfileModalOpen(true);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-[#172B24] hover:bg-[#F7FAF8] hover:text-[#16845B] flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-[#64746C]" />
                        <span>Staff Profile</span>
                      </button>

                      <NavLink
                        to="/nurse/check-medicine"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-[#172B24] hover:bg-[#F7FAF8] hover:text-[#16845B] flex items-center gap-2 cursor-pointer"
                      >
                        <Pill className="w-3.5 h-3.5 text-[#64746C]" />
                        <span>Safety Medication Check</span>
                      </NavLink>
                    </div>

                    <div className="border-t border-[#E2EAE5] pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER: SIDEBAR + CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E2EAE5] justify-between p-4 shrink-0">
          <div className="space-y-6">
            {/* Quick Action Button */}
            <div>
              <NavLink
                to="/nurse/check-medicine"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#16845B] hover:bg-[#105C43] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
              >
                <Pill className="w-4 h-4" />
                <span>+ Check Medicine</span>
              </NavLink>
            </div>

            {/* Navigation List */}
            <nav className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64746C] px-3 mb-2 block">
                Clinical Telemetry
              </span>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.end
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-[#EAF7F0] text-[#16845B] font-bold border border-[#CDEBDC]'
                        : 'text-[#172B24] hover:bg-[#F7FAF8] hover:text-[#16845B]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-[#16845B]' : 'text-[#64746C] group-hover:text-[#16845B]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#16845B]" />}
                    </div>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="pt-4 border-t border-[#E2EAE5] space-y-2">
            <div className="px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[11px] text-[#64746C]">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-0.5">
                <HeartPulse className="w-3.5 h-3.5 text-[#16845B]" />
                <span>Station: Wards &amp; ICU Care</span>
              </div>
              <span>Deterioration ML Guard: Active</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* MOBILE DRAWER BACKDROP */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* MOBILE DRAWER */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-white p-5 flex flex-col justify-between shadow-2xl transition-transform duration-300 lg:hidden ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#E2EAE5] pb-4">
              <Logo size="small" showTagline={false} />
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-[#64746C] hover:bg-[#F7FAF8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <NavLink
              to="/nurse/check-medicine"
              onClick={() => setSidebarOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#16845B] text-white text-xs font-bold shadow-xs"
            >
              <Pill className="w-4 h-4" />
              <span>+ Check Medicine</span>
            </NavLink>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.end
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive
                        ? 'bg-[#EAF7F0] text-[#16845B] font-bold border border-[#CDEBDC]'
                        : 'text-[#172B24] hover:bg-[#F7FAF8]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-[#E2EAE5]">
            <button
              onClick={() => {
                setSidebarOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* MAIN OUTLET CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* NURSE PROFILE MODAL */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full border border-[#E2EAE5] shadow-2xl relative">
            <button
              onClick={() => setProfileModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-full text-[#64746C] hover:bg-[#F7FAF8]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#EAF7F0] border-2 border-[#CDEBDC] flex items-center justify-center text-[#16845B] shadow-xs shrink-0">
                <User className="w-8 h-8 text-[#16845B]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#172B24]">{user?.name || 'Sarah Vance, RN'}</h3>
                <p className="text-xs text-[#64746C]">{user?.roleTitle || 'Senior Inpatient Caretaker'}</p>
                <span className="mt-1 inline-block text-[10px] font-bold text-[#16845B] bg-[#EAF7F0] px-2 py-0.5 rounded border border-[#CDEBDC]">
                  Clinical Lic: #RN-884920
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#64746C] border-t border-[#E2EAE5] pt-4">
              <div className="flex justify-between py-1 border-b border-[#E2EAE5]/60">
                <span className="font-medium">Assigned Care Units</span>
                <span className="font-bold text-[#172B24]">General Ward A, B &amp; ICU</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2EAE5]/60">
                <span className="font-medium">Email</span>
                <span className="font-bold text-[#172B24]">{user?.email || 'nurse.vance@vitalwatch.hospital'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2EAE5]/60">
                <span className="font-medium">Clinical Privileges</span>
                <span className="font-bold text-[#16845B]">Telemetry Review, Alert Ack, Med Scan</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setProfileModalOpen(false)}
                className="px-4 py-2 bg-[#16845B] text-white text-xs font-semibold rounded-xl hover:bg-[#105C43]"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
