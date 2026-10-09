import React from 'react';
import { ArrowRight, LogIn, Activity, BellRing, Users2 } from 'lucide-react';
import DashboardPreview from './DashboardPreview';

export default function Hero({ onOpenLogin }) {
  const handleScrollToFeatures = (e) => {
    e.preventDefault();
    const featuresElement = document.getElementById('features');
    if (featuresElement) {
      featuresElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-[#EAF7F0]/60 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-80 h-80 bg-[#F7FAF8] rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-7">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF7F0] border border-[#CDEBDC] text-[#16845B] text-xs font-semibold tracking-wider uppercase">
              <Activity className="w-3.5 h-3.5" />
              <span>INTELLIGENT PATIENT MONITORING</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-[#172B24] leading-[1.15]">
              See the Warning Signs.{' '}
              <span className="text-[#16845B] block sm:inline">Act Before They Escalate.</span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-[#64746C] leading-relaxed max-w-xl">
              VitalWatch helps hospital teams monitor vital-sign trends, identify concerning changes, and respond sooner with clear, explainable alerts — supporting safer, more informed patient care.
            </p>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a
                href="#features"
                onClick={handleScrollToFeatures}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#16845B] hover:bg-[#105C43] text-white text-base font-semibold shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-center group"
              >
                <span>Explore VitalWatch</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                type="button"
                onClick={onOpenLogin}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#F7FAF8] text-[#172B24] text-base font-semibold border border-[#E2EAE5] shadow-2xs hover:border-[#16845B]/50 transition-all duration-200 cursor-pointer text-center"
              >
                <LogIn className="w-4 h-4 text-[#16845B]" />
                <span>Staff Login</span>
              </button>
            </div>

            {/* Value Indicators */}
            <div className="pt-4 border-t border-[#E2EAE5]/80 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="flex items-center gap-2.5 text-xs text-[#172B24] font-medium">
                <div className="w-6 h-6 rounded-full bg-[#EAF7F0] flex items-center justify-center text-[#16845B] shrink-0">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <span>Continuous Vital Monitoring</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-[#172B24] font-medium">
                <div className="w-6 h-6 rounded-full bg-[#EAF7F0] flex items-center justify-center text-[#16845B] shrink-0">
                  <BellRing className="w-3.5 h-3.5" />
                </div>
                <span>Explainable Early Warnings</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-[#172B24] font-medium">
                <div className="w-6 h-6 rounded-full bg-[#EAF7F0] flex items-center justify-center text-[#16845B] shrink-0">
                  <Users2 className="w-3.5 h-3.5" />
                </div>
                <span>Connected Care Teams</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Telemetry Dashboard Preview */}
          <div className="lg:col-span-6 w-full lg:pl-4">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
