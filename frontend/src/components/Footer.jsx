import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowUp, Building2, Stethoscope } from 'lucide-react';
import Logo from './Logo';

export default function Footer({ onOpenLogin }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/' + href);
      return;
    }

    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-[#E2EAE5] text-[#172B24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Column 1: Brand Info (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="default" showTagline={true} />
            <p className="text-sm text-[#64746C] leading-relaxed max-w-sm">
              An explainable early-warning and continuous patient-monitoring platform designed to help hospital staff identify deterioration early and safeguard patient outcomes.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#16845B] font-medium bg-[#EAF7F0] w-fit px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
              <span>Designed for Hospital &amp; Clinical Workflows</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#172B24]">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-[#64746C]">
              <li>
                <a
                  href="#home"
                  onClick={(e) => handleNavClick(e, '#home')}
                  className="hover:text-[#16845B] transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleNavClick(e, '#features')}
                  className="hover:text-[#16845B] transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleNavClick(e, '#how-it-works')}
                  className="hover:text-[#16845B] transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#patient-safety"
                  onClick={(e) => handleNavClick(e, '#patient-safety')}
                  className="hover:text-[#16845B] transition-colors"
                >
                  Patient Safety
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Staff Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#172B24]">
              Staff Access
            </h4>
            <ul className="space-y-2 text-sm text-[#64746C]">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/login/receptionist')}
                  className="hover:text-[#16845B] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#16845B]" />
                  <span>Receptionist Login</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/login/caretaker')}
                  className="hover:text-[#16845B] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-[#16845B]" />
                  <span>Nurse / Caretaker Login</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="text-xs text-[#16845B] font-semibold hover:underline pt-1 cursor-pointer"
                >
                  Open Role Selector Modal &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: System Telemetry / Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#172B24]">
              Security &amp; Standards
            </h4>
            <p className="text-xs text-[#64746C] leading-relaxed">
              Engineered to support HL7/FHIR compatibility, audit timestamps, and role-based access control (RBAC).
            </p>
            <div className="text-[11px] text-[#64746C] space-y-1">
              <div className="flex items-center gap-1 text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>System Status: All Services Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Disclaimer Banner in Footer */}
        <div className="p-4 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-xs text-[#64746C] mb-8 leading-relaxed">
          <span className="font-semibold text-[#172B24]">Medical Prototype Disclaimer: </span>
          VitalWatch is a clinical decision-support prototype. Alerts and vital trend analyses are intended to support professional review and do not constitute a diagnosis or replace clinical judgment.
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#E2EAE5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64746C]">
          <p>© 2026 VitalWatch. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span className="text-slate-400">Production-Ready UI Prototype</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-[#F7FAF8] hover:bg-[#EAF7F0] text-[#172B24] hover:text-[#16845B] transition-colors flex items-center gap-1 cursor-pointer"
              aria-label="Scroll back to top"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
