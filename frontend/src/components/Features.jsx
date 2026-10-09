import React from 'react';
import {
  Activity,
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  Users,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Activity,
      title: 'Real-Time Vital Monitoring',
      description:
        'Track key vital signs such as heart rate, oxygen saturation, temperature, and blood pressure in one place.',
      badge: 'Continuous Telemetry'
    },
    {
      icon: AlertTriangle,
      title: 'Explainable Early-Warning Alerts',
      description:
        'Highlight concerning readings and trends with clear explanations of the measurements that triggered an alert.',
      badge: 'Explainable Logic'
    },
    {
      icon: UserCheck,
      title: 'Patient Profiles & Medical History',
      description:
        'Keep patient records, admission details, allergies, and relevant medical history organized for authorized staff.',
      badge: 'Patient Centric'
    },
    {
      icon: ShieldAlert,
      title: 'Medication Safety Checks',
      description:
        'Support staff in reviewing documented allergies, medical conditions, and medication-interaction warnings before administration.',
      badge: 'Safety Checks'
    },
    {
      icon: Users,
      title: 'Ward & Caretaker Management',
      description:
        'Help reception staff assign patients to wards and authorized care teams monitor their assigned patients.',
      badge: 'Team Workflow'
    },
    {
      icon: Clock,
      title: 'Timestamped Patient Records',
      description:
        'Review previous readings, missing measurements, alert history, and acknowledgements through a chronological timeline.',
      badge: 'Audit Trail'
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-[#F7FAF8] border-y border-[#E2EAE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-[#16845B] uppercase bg-[#EAF7F0] px-3 py-1 rounded-full border border-[#CDEBDC]">
            Core Capabilities
          </span>
          <h2 className="mt-3.5 text-3xl sm:text-4xl font-extrabold text-[#172B24] tracking-tight">
            Everything Your Care Team Needs to Stay Ahead
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64746C] leading-relaxed">
            Bring patient monitoring, timely alerts, and essential care information together in one clear workflow.
          </p>
        </div>

        {/* 6-Card Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative bg-white p-7 rounded-2xl border border-[#E2EAE5] shadow-xs hover:shadow-md hover:border-[#16845B]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Icon & Badge Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#EAF7F0] text-[#16845B] flex items-center justify-center group-hover:bg-[#16845B] group-hover:text-white transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#64746C] bg-[#F7FAF8] border border-[#E2EAE5] px-2.5 py-1 rounded-full group-hover:border-[#16845B]/30 group-hover:text-[#16845B] transition-colors">
                      {feature.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#172B24] group-hover:text-[#16845B] transition-colors mb-2.5">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#64746C] leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom subtle indicator */}
                <div className="mt-6 pt-4 border-t border-[#E2EAE5]/60 flex items-center justify-between text-xs text-[#64746C]">
                  <span className="font-medium text-[11px] text-[#64746C]/80">Part of VitalWatch Core</span>
                  <span className="text-[#16845B] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 font-semibold text-[11px]">
                    Learn more <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
