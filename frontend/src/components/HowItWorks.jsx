import React from 'react';
import { UserPlus, Activity, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Register the Patient',
      description:
        'Reception staff create the patient record, document essential information, and assign the appropriate ward and care team.',
      icon: UserPlus,
      role: 'Receptionist Workflow',
    },
    {
      number: '02',
      title: 'Monitor Vital Signs',
      description:
        'Readings and patient observations are collected and displayed with timestamps, trends, and data-quality indicators.',
      icon: Activity,
      role: 'Continuous Observation',
    },
    {
      number: '03',
      title: 'Review and Respond',
      description:
        'When concerning patterns are identified, staff can review the supporting evidence, acknowledge the alert, and follow their clinical protocols.',
      icon: CheckCircle2,
      role: 'Clinical Caretaker Action',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="text-xs font-bold tracking-widest text-[#16845B] uppercase bg-[#EAF7F0] px-3 py-1 rounded-full border border-[#CDEBDC]">
            Workflow Architecture
          </span>
          <h2 className="mt-3.5 text-3xl sm:text-4xl font-extrabold text-[#172B24] tracking-tight">
            How VitalWatch Connects the Hospital Care Journey
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64746C] leading-relaxed">
            A continuous, transparent bridge from patient admission to active bedside response.
          </p>
        </div>

        {/* 3 Steps with connecting line on desktop */}
        <div className="relative">
          {/* Desktop Connecting horizontal line */}
          <div className="hidden lg:block absolute top-28 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-[#E2EAE5] via-[#16845B]/40 to-[#E2EAE5] -z-0"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="bg-white rounded-2xl border border-[#E2EAE5] p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#16845B]/40 transition-all duration-300 relative group"
                >
                  {/* Step Top: Number badge and Icon */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#EAF7F0] text-[#16845B] flex items-center justify-center font-mono font-bold text-xl ring-4 ring-white shadow-xs group-hover:bg-[#16845B] group-hover:text-white transition-all">
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="font-mono text-3xl font-extrabold text-[#E2EAE5] group-hover:text-[#16845B]/30 transition-colors">
                        {step.number}
                      </span>
                    </div>

                    <div className="inline-block px-2.5 py-1 rounded-md bg-[#F7FAF8] text-[#16845B] text-[11px] font-semibold tracking-wider uppercase mb-2 border border-[#E2EAE5]">
                      {step.role}
                    </div>

                    {/* Step Title */}
                    <h3 className="text-xl font-bold text-[#172B24] mb-3 group-hover:text-[#16845B] transition-colors">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-sm text-[#64746C] leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Step footer index / progress indicator */}
                  <div className="mt-8 pt-4 border-t border-[#E2EAE5]/60 flex items-center justify-between text-xs text-[#64746C]">
                    <span className="font-medium">Step {index + 1} of 3</span>
                    {index < 2 && (
                      <span className="hidden lg:flex items-center gap-1 text-[#16845B] font-semibold">
                        Next step <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                    {index === 2 && (
                      <span className="flex items-center gap-1 text-[#16845B] font-semibold">
                        Protocols active <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
