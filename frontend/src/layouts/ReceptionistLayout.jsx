import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  UserPlus,
  Users,
  ClipboardList,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Calendar,
  ShieldCheck,
  ChevronRight,
  User
} from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export default function ReceptionistLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format Current Date safely
  const [currentDateFormatted] = useState(() =>
    new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/receptionist/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/receptionist/wards',
      label: 'Wards & Rooms',
      icon: Building2,
    },
    {
      to: '/receptionist/admissions/new',
      label: 'Register Patient',
      icon: UserPlus,
    },
    {
      to: '/receptionist/patients',
      label: 'Patient Directory',
      icon: Users,
    },
    {
      to: '/receptionist/admissions',
      label: 'Admissions',
      icon: ClipboardList,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAF8] flex flex-col font-sans selection:bg-[#EAF7F0] selection:text-[#105C43]">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-30 w-full bg-white border-b border-[#E2EAE5] shadow-2xs">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Left: Mobile Toggle & VitalWatch Branding */}
            <div className="flex items-center gap-3 sm:gap-6">
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-[#64746C] hover:text-[#172B24] hover:bg-[#F7FAF8] focus:outline-hidden focus:ring-2 focus:ring-[#16845B]"
                aria-label="Toggle Navigation Drawer"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <NavLink to="/receptionist/dashboard" className="flex items-center">
                <Logo size="small" showTagline={false} />
              </NavLink>

              <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[#E2EAE5]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#16845B] bg-[#EAF7F0] px-2.5 py-0.5 rounded-full border border-[#CDEBDC]">
                  Reception Dashboard
                </span>
              </div>
            </div>

            {/* Right: Date, System status, Receptionist Profile Dropdown */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Current Date Display */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#64746C] bg-[#F7FAF8] px-3 py-1.5 rounded-xl border border-[#E2EAE5]">
                <Calendar className="w-3.5 h-3.5 text-[#16845B]" />
                <span>{currentDateFormatted}</span>
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-[#F7FAF8] border border-transparent hover:border-[#E2EAE5] transition-all cursor-pointer focus:outline-hidden"
                >
                  <img
                    src={
                      user?.avatar ||
                      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256'
                    }
                    alt={user?.name || 'Receptionist'}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-[#16845B]/30"
                  />
                  <div className="hidden md:flex flex-col text-left leading-tight">
                    <span className="text-xs font-bold text-[#172B24]">
                      {user?.name || 'Eleanor Jenkins'}
                    </span>
                    <span className="text-[10px] text-[#64746C]">
                      {user?.roleTitle || 'Admissions Officer'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#64746C] hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E2EAE5] py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-[#E2EAE5]">
                      <p className="text-xs font-bold text-[#172B24]">{user?.name || 'Eleanor Jenkins'}</p>
                      <p className="text-[11px] text-[#64746C] truncate">{user?.email || 'reception.desk@vitalwatch.hospital'}</p>
                      <span className="mt-1 inline-block text-[10px] font-semibold text-[#16845B] bg-[#EAF7F0] px-2 py-0.5 rounded">
                        Authorized Admissions Desk
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
                        to="/receptionist/admissions/new"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-[#172B24] hover:bg-[#F7FAF8] hover:text-[#16845B] flex items-center gap-2 cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-[#64746C]" />
                        <span>New Admission</span>
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
                to="/receptionist/admissions/new"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#16845B] hover:bg-[#105C43] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Assign Room</span>
              </NavLink>
            </div>

            {/* Navigation List */}
            <nav className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64746C] px-3 mb-2 block">
                Hospital Reception
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
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#16845B]" />}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="pt-4 border-t border-[#E2EAE5] space-y-2">
            <div className="px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[11px] text-[#64746C]">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16845B]" />
                <span>Hospital Portal Active</span>
              </div>
              <span>Workstation: Front Desk Main</span>
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
              to="/receptionist/admissions/new"
              onClick={() => setSidebarOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#16845B] text-white text-xs font-bold shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Assign Room</span>
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
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive
                        ? 'bg-[#EAF7F0] text-[#16845B] font-bold border border-[#CDEBDC]'
                        : 'text-[#172B24] hover:bg-[#F7FAF8]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
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

      {/* STAFF PROFILE MODAL */}
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
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256'
                }
                alt={user?.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#16845B]"
              />
              <div>
                <h3 className="text-lg font-bold text-[#172B24]">{user?.name || 'Eleanor Jenkins'}</h3>
                <p className="text-xs text-[#64746C]">{user?.roleTitle || 'Admissions Officer'}</p>
                <span className="mt-1 inline-block text-[10px] font-bold text-[#16845B] bg-[#EAF7F0] px-2 py-0.5 rounded">
                  Staff ID: {user?.id || 'USR-REC-01'}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#64746C] border-t border-[#E2EAE5] pt-4">
              <div className="flex justify-between py-1 border-b border-[#E2EAE5]/60">
                <span className="font-medium">Department</span>
                <span className="font-bold text-[#172B24]">Hospital Admissions &amp; Front Desk</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2EAE5]/60">
                <span className="font-medium">Email</span>
                <span className="font-bold text-[#172B24]">{user?.email || 'reception.desk@vitalwatch.hospital'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2EAE5]/60">
                <span className="font-medium">Access Tier</span>
                <span className="font-bold text-[#16845B]">Role-Based Access (Admissions &amp; Wards)</span>
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
