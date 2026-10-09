import React from 'react';

export default function Logo({ size = 'default', showTagline = true, className = '' }) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Brand Icon: Minimal Shield with Heartbeat / Cross */}
      <div
        className={`relative flex items-center justify-center rounded-xl bg-[#16845B] text-white shadow-sm ring-1 ring-[#105C43]/20 shrink-0 ${
          isLarge ? 'w-11 h-11' : isSmall ? 'w-8 h-8' : 'w-10 h-10'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isLarge ? 'w-6 h-6' : isSmall ? 'w-4 h-4' : 'w-5 h-5'}
        >
          {/* Shield Outline */}
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          {/* Embedded Heartbeat Wave */}
          <path d="M8 12.5h2l1.2-3 1.8 6 1.2-3h2.3" stroke="white" strokeWidth="2.2" />
        </svg>
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white"></div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-bold tracking-tight text-[#172B24] ${
              isLarge ? 'text-2xl' : isSmall ? 'text-lg' : 'text-xl'
            }`}
          >
            Vital<span className="text-[#16845B]">Watch</span>
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium tracking-wide text-[#64746C] hidden sm:inline-block">
            Smarter Monitoring. Safer Care.
          </span>
        )}
      </div>
    </div>
  );
}
