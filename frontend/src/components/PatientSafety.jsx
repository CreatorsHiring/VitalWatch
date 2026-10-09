import React from 'react';
import { ShieldCheck, Eye, HelpCircle, HeartHandshake, ArrowRight, AlertCircle } from 'lucide-react';

export default function PatientSafety() {
  const principles = [
    {
      icon: Eye,
      title: 'Explainable Alerts',
      description: 'Show which readings or trends contributed to an alert with clear metric breakdowns.',
    },
    {
      icon: HelpCircle,
      title: 'Data Awareness',
      description: 'Identify missing, stale, or questionable readings instead of silently treating them as normal.',
    },
    {
      icon: HeartHandshake,
      title: 'Human Oversight',
      description: 'Support clinical review and triage rather than replacing professional human judgment.',
    },
  ];

  const handleScrollToFeatures = (e) => {
    e.preventDefault();
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="patient-safety" className="py-20 lg:py-28 bg-[#EAF7F0]/60 border-t border-[#CDEBDC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#CDEBDC] shadow-sm">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF7F0] border border-[#16845B]/20 text-[#16845B] text-xs font-semibold tracking-wider uppercase mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              Patient Safety &amp; Ethics
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172B24] tracking-tight">
              Technology That Supports Better Clinical Decisions
            </h2>

            <p className="mt-4 text-base sm:text-lg text-[#64746C] leading-relaxed">
              VitalWatch is designed to make important changes easier to recognize and patient information easier to review — while keeping healthcare professionals at the center of every care decision.
            </p>
          </div>

          {/* Three Compact Principles */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <div
                  key={principle.title}
                  className="bg-[#F7FAF8] rounded-2xl p-6 border border-[#E2EAE5] flex flex-col justify-between hover:border-[#16845B]/40 hover:bg-white transition-all"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#EAF7F0] text-[#16845B] flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#172B24] mb-2">
                      {principle.title}
                    </h3>
                    <p className="text-sm text-[#64746C] leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA & Safety Disclaimer Box */}
          <div className="mt-10 pt-8 border-t border-[#E2EAE5] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-3 text-xs text-[#64746C] max-w-2xl">
              <AlertCircle className="w-4 h-4 text-[#16845B] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-[#172B24]">Clinical Prototype Notice:</strong> VitalWatch is a clinical decision-support prototype. Alerts are intended to support professional review and do not constitute a diagnosis or replace clinical judgment.
              </p>
            </div>

            <a
              href="#features"
              onClick={handleScrollToFeatures}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16845B] hover:bg-[#105C43] text-white text-sm font-semibold transition-colors shrink-0 shadow-2xs"
            >
              <span>Explore Features</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
