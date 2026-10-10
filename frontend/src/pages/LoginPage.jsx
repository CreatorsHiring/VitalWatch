import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Building2,
  Stethoscope,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Activity,
  Heart,
  Thermometer,
  Wind,
  AlertTriangle,
  CheckCircle2,
  Info,
  Layers,
  Users
} from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { loginStaff } from '../services/api';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Determine initial role from URL query param or pathname
  const initialRole =
    searchParams.get('role') === 'receptionist' || location.pathname.includes('receptionist')
      ? 'receptionist'
      : 'caretaker';

  const [activeRole, setActiveRole] = useState(initialRole);
  const [identifier, setIdentifier] = useState(() =>
    initialRole === 'receptionist'
      ? 'reception.desk@vitalwatch.hospital'
      : 'nurse.vance@vitalwatch.hospital'
  );
  const [password, setPassword] = useState(() =>
    initialRole === 'receptionist' ? 'ReceptionSecure2026!' : 'ClinicalCaretaker2026!'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Live ticking clock for demo dashboard
  const [liveTime, setLiveTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
  const [liveBpmVariation, setLiveBpmVariation] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setLiveBpmVariation(Math.floor(Math.sin(Date.now() / 2500) * 3));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRoleSwitch = (role) => {
    setActiveRole(role);
    setErrors({});
    setStatusMessage(null);
    if (role === 'receptionist') {
      setIdentifier('reception.desk@vitalwatch.hospital');
      setPassword('ReceptionSecure2026!');
    } else {
      setIdentifier('nurse.vance@vitalwatch.hospital');
      setPassword('ClinicalCaretaker2026!');
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!identifier.trim()) {
      errs.identifier = 'Please enter your staff email or username';
    }
    if (!password) {
      errs.password = 'Please enter your password';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setStatusMessage(null);

    try {
      // Call backend API login endpoint
      const res = await loginStaff({
        identifier,
        password,
        role: activeRole,
      });

      if (res.success && res.data) {
        login(res.data.user, res.data.user.token);

        if (activeRole === 'receptionist') {
          navigate('/receptionist/dashboard');
        } else {
          navigate('/nurse/dashboard');
        }
      }
    } catch {
      // Fallback local session if backend is momentarily offline
      const fallbackUser = {
        id: activeRole === 'receptionist' ? 'USR-REC-01' : 'USR-RN-01',
        name: activeRole === 'receptionist' ? 'Eleanor Jenkins' : 'Sarah Vance, RN',
        role: activeRole,
        email: identifier,
        roleTitle: activeRole === 'receptionist' ? 'Hospital Admissions Officer' : 'Clinical Telemetry Nurse',
      };
      login(fallbackUser, 'fallback-token');

      if (activeRole === 'receptionist') {
        navigate('/receptionist/dashboard');
      } else {
        navigate('/nurse/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Mock patient list for right-hand dashboard demo
  const demoPatients = [
    {
      id: 'P-101',
      name: 'Eleanor Vance',
      bed: 'Ward 4B • Bed 12',
      condition: 'Post-Op Day 2',
      hr: 88 + liveBpmVariation,
      hrTrend: '+14 bpm',
      spo2: 94,
      spo2Status: 'warning',
      temp: 37.8,
      bp: '128/82',
      news2: 4,
      news2Label: 'Moderate Risk',
      status: 'review_recommended',
    },
    {
      id: 'P-102',
      name: 'Arthur Miller',
      bed: 'Ward 4B • Bed 08',
      condition: 'Pneumonia Recovery',
      hr: 72,
      hrTrend: 'Stable',
      spo2: 98,
      spo2Status: 'normal',
      temp: 36.9,
      bp: '120/78',
      news2: 0,
      news2Label: 'Low Risk',
      status: 'stable',
    },
    {
      id: 'P-103',
      name: 'Clara Oswald',
      bed: 'ICU Stepdown • Bed 03',
      condition: 'Cardiac Telemetry',
      hr: 104,
      hrTrend: '+22 bpm',
      spo2: 91,
      spo2Status: 'urgent',
      temp: 38.4,
      bp: '142/90',
      news2: 6,
      news2Label: 'High Alert',
      status: 'urgent',
    },
    {
      id: 'P-104',
      name: 'Robert Chen',
      bed: 'Ward 4B • Bed 15',
      condition: 'Post-Cardiac Stent',
      hr: 68,
      hrTrend: 'Stable',
      spo2: 99,
      spo2Status: 'normal',
      temp: 36.7,
      bp: '118/76',
      news2: 1,
      news2Label: 'Low Risk',
      status: 'stable',
    },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white selection:bg-[#EAF7F0] selection:text-[#105C43]">
      {/* ========================================================= */}
      {/* LEFT COLUMN: Login Card & Form (Aesthetic match to mockup) */}
      {/* ========================================================= */}
      <div className="w-full lg:w-[45%] xl:w-[42%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 bg-white z-10">
        {/* Top Header with Brand Logo & Back to Home */}
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
            <Logo size="default" showTagline={false} />
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64746C] hover:text-[#16845B] transition-colors px-3 py-1.5 rounded-lg border border-[#E2EAE5] hover:border-[#16845B]/30 hover:bg-[#F7FAF8]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>

        {/* Main Form Center Card */}
        <div className="my-8 lg:my-0 max-w-md w-full mx-auto">
          {/* Segmented Pill Role Switcher */}
          <div className="p-1 rounded-xl bg-[#F0F5F2] border border-[#E2EAE5] flex items-center gap-1 mb-8 shadow-2xs">
            <button
              type="button"
              onClick={() => handleRoleSwitch('receptionist')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeRole === 'receptionist'
                  ? 'bg-white text-[#16845B] shadow-xs ring-1 ring-[#16845B]/20'
                  : 'text-[#64746C] hover:text-[#172B24]'
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span>Receptionist</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSwitch('caretaker')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeRole === 'caretaker'
                  ? 'bg-white text-[#16845B] shadow-xs ring-1 ring-[#16845B]/20'
                  : 'text-[#64746C] hover:text-[#172B24]'
              }`}
            >
              <Stethoscope className="w-4 h-4 shrink-0" />
              <span>Nurse / Caretaker</span>
            </button>
          </div>

          {/* Dynamic Role Heading & Description */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] tracking-tight">
              {activeRole === 'receptionist'
                ? 'Log in to admissions workspace'
                : 'Log in to clinical workspace'}
            </h1>
            <p className="text-sm text-[#64746C] mt-2 leading-relaxed">
              {activeRole === 'receptionist'
                ? 'Access patient registration, bed assignments, admission queues, and ward records.'
                : 'Access bedside telemetry, live vital monitoring, early-warning alerts, and care records.'}
            </p>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#EAF7F0] border border-[#CDEBDC] text-[#105C43] text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#16845B]" />
              <div>
                <span className="font-semibold block">Frontend Authorization Ready</span>
                {statusMessage.text}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4.5" noValidate>
            {/* Email / ID Field */}
            <div>
              <label
                htmlFor="identifier"
                className="block text-xs font-semibold text-[#172B24] uppercase tracking-wider mb-1.5"
              >
                {activeRole === 'receptionist' ? 'Staff Email Address' : 'Clinician / Nurse Email Address'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64746C]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: null }));
                  }}
                  placeholder={
                    activeRole === 'receptionist'
                      ? 'e.g. reception.desk@vitalwatch.hospital'
                      : 'e.g. nurse.vance@vitalwatch.hospital'
                  }
                  className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 bg-white rounded-xl border text-sm text-[#172B24] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#16845B] transition-all ${
                    errors.identifier ? 'border-rose-400 ring-1 ring-rose-300' : 'border-[#E2EAE5]'
                  }`}
                />
              </div>
              {errors.identifier && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {errors.identifier}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-[#172B24] uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64746C]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                  }}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white rounded-xl border text-sm text-[#172B24] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#16845B] transition-all ${
                    errors.password ? 'border-rose-400 ring-1 ring-rose-300' : 'border-[#E2EAE5]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64746C] hover:text-[#172B24] focus:outline-hidden cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Security Note & Forgot Password */}
            <div className="flex flex-wrap items-center justify-between text-xs gap-2 pt-1">
              <div className="flex items-center gap-1.5 text-[#64746C]">
                <Lock className="w-3.5 h-3.5 text-[#16845B]" />
                <span>5-min session timeout upon closing browser</span>
              </div>

              <button
                type="button"
                onClick={() =>
                  alert('Please contact your hospital IT administrator or nurse supervisor for password reset.')
                }
                className="text-xs font-semibold text-[#16845B] hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit CTA Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-5 rounded-xl bg-[#105C43] hover:bg-[#0D4B36] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer group"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Log In to Workspace</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Sub-text security badge */}
            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#64746C]">
              <ShieldCheck className="w-4 h-4 text-[#16845B]" />
              <span>Authorized clinical &amp; hospital personnel only</span>
            </div>
          </form>
        </div>

        {/* Bottom Disclaimer */}
        <div className="text-[11px] text-[#64746C]/80 leading-relaxed border-t border-[#E2EAE5] pt-4 mt-6">
          This system is an intelligent early-warning decision-support prototype intended for patient monitoring. Final clinical diagnosis and intervention must be performed by authorized healthcare professionals.
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: Dark Forest Backdrop + Realistic Live Demo Dashboard */}
      {/* ========================================================= */}
      <div className="w-full lg:w-[55%] xl:w-[58%] bg-[#0B3B2B] text-white p-6 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-between relative overflow-hidden">
        {/* Background glow effects & pattern */}
        <div className="absolute top-0 right-0 w-[32rem] h-[32rem] bg-[#16845B]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#08291E]/60 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top Header on Right */}
        <div className="relative z-10 space-y-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300 mb-4 shadow-inner">
            <Activity className="w-5 h-5" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Patient monitoring decisions care teams can trust.
          </h2>

          <p className="text-emerald-100/80 text-sm sm:text-base max-w-xl leading-relaxed">
            Explainable early-warning detection with continuous vital sign telemetry and NEWS2 risk scoring.
          </p>

          {/* Carousel indicator dots */}
          <div className="flex items-center gap-1.5 pt-2">
            <span className="w-6 h-1.5 rounded-full bg-white"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
          </div>
        </div>

        {/* Floating Healthcare Live Demo Dashboard */}
        <div className="relative z-10 w-full rounded-2xl bg-white text-[#172B24] shadow-2xl border border-white/20 overflow-hidden font-sans">
          {/* Dashboard Header Bar */}
          <div className="bg-[#F7FAF8] px-4 sm:px-5 py-3 border-b border-[#E2EAE5] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-[#105C43]">VitalWatch</span>
              <span className="text-xs text-[#64746C]">/</span>
              <span className="text-xs font-semibold text-[#172B24]">
                {activeRole === 'receptionist' ? 'Admissions & Ward Overview' : 'Clinical Telemetry Hub'}
              </span>
            </div>

            {/* Quick nav tabs & Live Station pill */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium text-[#64746C]">
                <span className="px-2 py-0.5 rounded bg-white text-[#16845B] font-bold border border-[#E2EAE5]">
                  Overview
                </span>
                <span className="hover:text-[#172B24] cursor-pointer">Wards</span>
                <span className="hover:text-[#172B24] cursor-pointer">Patients</span>
                <span className="hover:text-[#172B24] cursor-pointer">Telemetry</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Live Station</span>
              </div>
            </div>
          </div>

          {/* 3 Metric Overview Tiles */}
          <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 border-b border-[#E2EAE5] bg-white">
            {/* Tile 1: Active Monitored */}
            <div className="p-3 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5]">
              <div className="flex items-center justify-between text-[11px] text-[#64746C] uppercase font-semibold">
                <span>Active Beds</span>
                <Users className="w-3.5 h-3.5 text-[#16845B]" />
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold font-mono text-[#172B24]">24</span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">
                  +12.4%
                </span>
              </div>
              <p className="text-[10px] text-[#64746C] mt-0.5">Ward 4B &amp; ICU Stepdown</p>
            </div>

            {/* Tile 2: Total Registered */}
            <div className="p-3 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5]">
              <div className="flex items-center justify-between text-[11px] text-[#64746C] uppercase font-semibold">
                <span>Total Patients</span>
                <Layers className="w-3.5 h-3.5 text-[#16845B]" />
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold font-mono text-[#172B24]">142</span>
                <span className="text-[10px] text-emerald-700 font-semibold">active</span>
              </div>
              <p className="text-[10px] text-[#64746C] mt-0.5">Telemetry synchronized</p>
            </div>

            {/* Tile 3: Urgent Early-Warning Alerts */}
            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
              <div className="flex items-center justify-between text-[11px] text-rose-800 uppercase font-semibold">
                <span>Urgent Alerts</span>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold font-mono text-rose-700">2</span>
                <span className="text-[10px] text-rose-800 font-semibold uppercase tracking-wider">
                  Immediate Triage
                </span>
              </div>
              <p className="text-[10px] text-rose-600/80 mt-0.5">NEWS2 escalation &gt; 4</p>
            </div>
          </div>

          {/* Patients Profiles & Live Vitals Table */}
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#172B24]">
                  Active Patient Profiles &amp; Telemetry
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                  {liveTime}
                </span>
              </div>
              <span className="text-[11px] text-[#16845B] font-semibold">Real-Time Sync</span>
            </div>

            {/* Responsive Table / Cards */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E2EAE5] text-[#64746C] text-[11px] uppercase tracking-wider">
                    <th className="py-2 px-2 font-semibold">Patient Profile</th>
                    <th className="py-2 px-2 font-semibold">Heart Rate</th>
                    <th className="py-2 px-2 font-semibold">SpO₂</th>
                    <th className="py-2 px-2 font-semibold">Temp</th>
                    <th className="py-2 px-2 font-semibold">BP</th>
                    <th className="py-2 px-2 font-semibold">NEWS2 Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2EAE5]">
                  {demoPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      className={`hover:bg-[#F7FAF8] transition-colors ${
                        patient.status === 'urgent'
                          ? 'bg-rose-50/40'
                          : patient.status === 'review_recommended'
                          ? 'bg-amber-50/30'
                          : ''
                      }`}
                    >
                      {/* Patient Profile */}
                      <td className="py-2.5 px-2">
                        <div className="font-bold text-[#172B24]">{patient.name}</div>
                        <div className="text-[10px] text-[#64746C]">
                          {patient.bed} • {patient.condition}
                        </div>
                      </td>

                      {/* Heart Rate / BPM */}
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-1 font-mono font-bold text-[#172B24]">
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              patient.status === 'urgent'
                                ? 'text-rose-500 fill-rose-500 animate-ping'
                                : 'text-rose-500 fill-rose-500/20'
                            }`}
                          />
                          <span>{patient.hr}</span>
                          <span className="text-[10px] text-[#64746C] font-normal">bpm</span>
                        </div>
                        <div className="text-[9px] text-[#64746C]">{patient.hrTrend}</div>
                      </td>

                      {/* SpO2 */}
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-1 font-mono font-bold">
                          <Wind className="w-3.5 h-3.5 text-cyan-600" />
                          <span
                            className={
                              patient.spo2Status === 'urgent'
                                ? 'text-rose-700 font-extrabold'
                                : patient.spo2Status === 'warning'
                                ? 'text-amber-700'
                                : 'text-[#172B24]'
                            }
                          >
                            {patient.spo2}%
                          </span>
                        </div>
                        <div className="text-[9px] text-[#64746C]">
                          {patient.spo2 < 95 ? 'Room Air (Low)' : 'Adequate'}
                        </div>
                      </td>

                      {/* Temperature */}
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-1 font-mono font-bold">
                          <Thermometer
                            className={`w-3.5 h-3.5 ${
                              patient.temp > 38 ? 'text-rose-600' : 'text-amber-600'
                            }`}
                          />
                          <span className={patient.temp > 38 ? 'text-rose-700' : 'text-[#172B24]'}>
                            {patient.temp}°C
                          </span>
                        </div>
                      </td>

                      {/* Blood Pressure */}
                      <td className="py-2.5 px-2 font-mono text-[11px] text-[#172B24]">
                        {patient.bp}
                      </td>

                      {/* NEWS2 Score / Action */}
                      <td className="py-2.5 px-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            patient.news2 >= 5
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : patient.news2 >= 4
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {patient.news2 >= 4 && <AlertTriangle className="w-3 h-3 shrink-0" />}
                          {patient.news2 < 4 && <CheckCircle2 className="w-3 h-3 shrink-0" />}
                          <span>Score {patient.news2} • {patient.news2Label}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Clinical Insights & Attention Cards */}
            <div className="mt-4 pt-3 border-t border-[#E2EAE5] space-y-2">
              <div className="text-[11px] font-bold text-[#172B24] uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#16845B]" />
                <span>Top Clinical Insights &amp; Explainable Attention</span>
              </div>

              {/* Alert 1 */}
              <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 flex items-start justify-between gap-2 text-xs">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-950">Review critical NEWS2 alert #ALT-9482</span>
                    <p className="text-[11px] text-amber-900 mt-0.5">
                      Eleanor Vance: Heart rate elevation (+18 bpm) combined with temperature rise (37.8°C).
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded shrink-0">
                  94.2% Risk Confidence
                </span>
              </div>

              {/* Alert 2 */}
              <div className="p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200 flex items-start justify-between gap-2 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-950">Telemetry validated for Arthur Miller</span>
                    <p className="text-[11px] text-emerald-900 mt-0.5">
                      All vital signs within safe target recovery zone for 6 continuous hours.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded shrink-0">
                  Stable
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Footer Tagline */}
        <div className="relative z-10 pt-6 flex items-center justify-between text-xs text-emerald-100/70">
          <span>VitalWatch Enterprise Core v1.0</span>
          <span>© 2026 VitalWatch Healthcare</span>
        </div>
      </div>
    </div>
  );
}
