import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Building2, Stethoscope, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectRole = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-[#E2EAE5] transition-all transform scale-100 z-10"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-[#64746C] hover:bg-[#F7FAF8] hover:text-[#172B24] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#16845B]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#EAF7F0] text-[#16845B] text-xs font-semibold uppercase tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5" />
            Hospital Staff Portal
          </div>
          <h2 id="login-modal-title" className="text-2xl font-bold text-[#172B24] tracking-tight">
            Select Your Role to Continue
          </h2>
          <p className="text-sm text-[#64746C] mt-1">
            Authorized healthcare staff can access their role-specific monitoring and admission dashboards.
          </p>
        </div>

        {/* Role Options */}
        <div className="space-y-4">
          {/* Option 1: Receptionist */}
          <div
            onClick={() => handleSelectRole('/login/receptionist')}
            className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4.5 rounded-xl border border-[#E2EAE5] bg-white hover:border-[#16845B] hover:bg-[#F7FAF8] transition-all cursor-pointer shadow-xs hover:shadow-md"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectRole('/login/receptionist');
              }
            }}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#EAF7F0] text-[#16845B] flex items-center justify-center shrink-0 group-hover:bg-[#16845B] group-hover:text-white transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base text-[#172B24] group-hover:text-[#16845B] transition-colors">
                    Receptionist Login
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600">
                    Admissions
                  </span>
                </div>
                <p className="text-xs text-[#64746C] mt-1 leading-relaxed max-w-xs">
                  Register patients, manage admissions, and assign rooms.
                </p>
              </div>
            </div>
            <div className="mt-3 sm:mt-0 flex items-center gap-1 text-xs font-semibold text-[#16845B] group-hover:translate-x-0.5 transition-transform shrink-0">
              <span>Login as Receptionist</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Option 2: Nurse / Caretaker */}
          <div
            onClick={() => handleSelectRole('/login/caretaker')}
            className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4.5 rounded-xl border border-[#E2EAE5] bg-white hover:border-[#16845B] hover:bg-[#F7FAF8] transition-all cursor-pointer shadow-xs hover:shadow-md"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectRole('/login/caretaker');
              }
            }}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#EAF7F0] text-[#16845B] flex items-center justify-center shrink-0 group-hover:bg-[#16845B] group-hover:text-white transition-colors">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base text-[#172B24] group-hover:text-[#16845B] transition-colors">
                    Nurse / Caretaker Login
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-[#EAF7F0] text-[#16845B]">
                    Clinical
                  </span>
                </div>
                <p className="text-xs text-[#64746C] mt-1 leading-relaxed max-w-xs">
                  Monitor assigned patients, review alerts, and access care records.
                </p>
              </div>
            </div>
            <div className="mt-3 sm:mt-0 flex items-center gap-1 text-xs font-semibold text-[#16845B] group-hover:translate-x-0.5 transition-transform shrink-0">
              <span>Login as Nurse / Caretaker</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="mt-6 pt-4 border-t border-[#E2EAE5] flex items-center justify-between text-xs text-[#64746C]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#16845B]" />
            <span>Encrypted HIPAA/GDPR aligned session</span>
          </div>
          <span className="text-[11px] text-slate-400">VitalWatch Core v1.0</span>
        </div>
      </div>
    </div>
  );
}
