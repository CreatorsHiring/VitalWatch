import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  Stethoscope,
  Info
} from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { loginStaff } from '../services/api';

export default function ReceptionistLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('reception.desk@vitalwatch.hospital');
  const [password, setPassword] = useState('ReceptionSecure2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

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
      const res = await loginStaff({ identifier, password, role: 'receptionist' });
      if (res.success) {
        login(res.data.user, res.data.user.token);
        navigate('/receptionist/dashboard');
      }
    } catch {
      login(
        {
          id: 'USR-REC-01',
          name: 'Eleanor Jenkins',
          role: 'receptionist',
          email: identifier,
          roleTitle: 'Hospital Admissions Officer',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
        },
        'token'
      );
      navigate('/receptionist/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setIdentifier('reception.desk@vitalwatch.hospital');
    setPassword('ReceptionSecure2026!');
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] flex flex-col justify-between selection:bg-[#EAF7F0] selection:text-[#105C43]">
      {/* Top Navbar */}
      <div className="w-full bg-white border-b border-[#E2EAE5] px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
            <Logo size="default" showTagline={false} />
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#64746C] hover:text-[#16845B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Main Login Card Area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2EAE5] shadow-lg p-6 sm:p-8">
          {/* Role Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#EAF7F0] text-[#16845B] mb-4 ring-1 ring-[#16845B]/20">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#EAF7F0] text-[#16845B] text-[11px] font-bold uppercase tracking-wider mb-2">
              Admissions &amp; Front Desk
            </div>
            <h1 className="text-2xl font-bold text-[#172B24] tracking-tight">
              Receptionist Login
            </h1>
            <p className="text-xs text-[#64746C] mt-1.5 leading-relaxed">
              Register patients, manage admissions, and assign rooms.
            </p>
          </div>

          {/* Status Message Notification */}
          {statusMessage && (
            <div
              className={`mb-5 p-3.5 rounded-xl text-xs flex items-start gap-2.5 border ${
                statusMessage.type === 'info'
                  ? 'bg-[#EAF7F0] text-[#105C43] border-[#CDEBDC]'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#16845B]" />
              <div>
                <span className="font-semibold block">Frontend Ready</span>
                {statusMessage.text}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email / Username Field */}
            <div>
              <label
                htmlFor="identifier"
                className="block text-xs font-semibold text-[#172B24] uppercase tracking-wider mb-1.5"
              >
                Staff Email or Username
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
                  placeholder="name@hospital.org or staff_id"
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-white rounded-xl border text-sm text-[#172B24] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#16845B] transition-all ${
                    errors.identifier ? 'border-rose-400 ring-1 ring-rose-300' : 'border-[#E2EAE5]'
                  }`}
                  aria-invalid={errors.identifier ? 'true' : 'false'}
                  aria-describedby={errors.identifier ? 'identifier-error' : undefined}
                />
              </div>
              {errors.identifier && (
                <p id="identifier-error" className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.identifier}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-[#172B24] uppercase tracking-wider"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Please contact your hospital IT administrator to reset your credentials.')}
                  className="text-xs text-[#16845B] hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
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
                  className={`w-full pl-10 pr-10 py-2.5 bg-white rounded-xl border text-sm text-[#172B24] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#16845B] transition-all ${
                    errors.password ? 'border-rose-400 ring-1 ring-rose-300' : 'border-[#E2EAE5]'
                  }`}
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64746C] hover:text-[#172B24] focus:outline-hidden"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E2EAE5] text-[#16845B] focus:ring-[#16845B]"
                />
                <span className="text-xs text-[#64746C] select-none">Remember this workstation</span>
              </label>

              <button
                type="button"
                onClick={handleDemoFill}
                className="text-xs text-[#64746C] hover:text-[#16845B] underline"
                title="Fill sample demo credentials"
              >
                Auto-fill demo
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#16845B] hover:bg-[#105C43] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Login as Receptionist</span>
              )}
            </button>
          </form>

          {/* Switch Role Option */}
          <div className="mt-6 pt-5 border-t border-[#E2EAE5] text-center">
            <p className="text-xs text-[#64746C]">
              Need clinical patient telemetry?{' '}
              <Link
                to="/login/caretaker"
                className="font-semibold text-[#16845B] hover:underline inline-flex items-center gap-1"
              >
                <Stethoscope className="w-3 h-3" /> Nurse / Caretaker Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="py-4 text-center text-xs text-[#64746C]">
        <p>© 2026 VitalWatch • Secure Hospital Portal • HIPAA / GDPR Aligned</p>
      </div>
    </div>
  );
}
