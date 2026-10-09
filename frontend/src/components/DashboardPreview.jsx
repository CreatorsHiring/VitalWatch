import React, { useState, useEffect } from 'react';
import {
  Activity,
  Heart,
  Thermometer,
  Wind,
  AlertTriangle,
  TrendingUp,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default function DashboardPreview() {
  const [pulseTime, setPulseTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
  const [bpm, setBpm] = useState(88);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      // Subtle natural variation in BPM for realism
      setBpm(87 + Math.floor(Math.sin(Date.now() / 3000) * 3));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full rounded-2xl bg-white border border-[#E2EAE5] shadow-xl overflow-hidden font-sans">
      {/* Top Header Bar: Demo status & Patient ID */}
      <div className="bg-[#105C43] text-white px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#0D4B36]">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-gentle-pulse"></div>
          <span className="text-xs font-semibold tracking-wider uppercase">
            VitalWatch Live Monitor
          </span>
          <span className="hidden sm:inline-block text-[11px] bg-[#16845B]/60 text-emerald-100 px-2 py-0.5 rounded-md font-mono">
            Ward 4B • Bed 12
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 bg-white/10 text-emerald-100 rounded-sm border border-white/20">
            Demo Preview
          </span>
          <span className="text-xs text-emerald-200 font-mono hidden md:inline-block">
            {pulseTime}
          </span>
        </div>
      </div>

      {/* Patient Meta Strip */}
      <div className="bg-[#F7FAF8] px-4 sm:px-5 py-3 border-b border-[#E2EAE5] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white border border-[#E2EAE5] flex items-center justify-center text-[#16845B] font-semibold">
            EV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-[#172B24] text-sm">Eleanor Vance</h4>
              <span className="text-[#64746C] text-xs">| 68y Female</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-[#105C43]">
                Post-Op Day 2
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#64746C] mt-0.5">
              <span>MRN: #VW-89241</span>
              <span>•</span>
              <span>Attending: Dr. S. Mehta</span>
            </div>
          </div>
        </div>

        {/* NEWS2 Early Warning Score Badge */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1.5 rounded-lg shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <div className="text-right">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-700">NEWS2 Score</span>
            <span className="font-mono font-bold text-xs">4 • Moderate Risk</span>
          </div>
        </div>
      </div>

      {/* Main Monitoring Body */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* ECG Waveform Card */}
        <div className="bg-[#0F1D17] rounded-xl p-4 text-emerald-400 border border-emerald-950/40 relative overflow-hidden shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-semibold tracking-wider text-emerald-300">
                LEAD II • ECG REAL-TIME (1 mV)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{bpm} BPM</span>
            </div>
          </div>

          {/* Simulated High-Resolution ECG SVG */}
          <div className="relative h-20 w-full overflow-hidden flex items-center">
            <svg
              viewBox="0 0 600 80"
              className="w-full h-full text-emerald-400 stroke-current fill-none preserve-3d"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Grid Lines for Medical realism */}
              <defs>
                <pattern id="ecgGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(16, 185, 129, 0.08)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ecgGrid)" />

              {/* Continuous Wave Path */}
              <path
                d="M 0 40 
                   L 40 40 L 48 40 L 52 35 L 56 45 L 60 40 L 70 40 
                   L 75 40 L 80 43 L 84 10 L 89 65 L 93 35 L 97 40 L 105 40 
                   L 115 40 L 125 32 L 135 40 L 170 40 
                   L 190 40 L 198 40 L 202 35 L 206 45 L 210 40 L 220 40 
                   L 225 40 L 230 43 L 234 10 L 239 65 L 243 35 L 247 40 L 255 40 
                   L 265 40 L 275 32 L 285 40 L 320 40 
                   L 340 40 L 348 40 L 352 35 L 356 45 L 360 40 L 370 40 
                   L 375 40 L 380 43 L 384 10 L 389 65 L 393 35 L 397 40 L 405 40 
                   L 415 40 L 425 32 L 435 40 L 470 40 
                   L 490 40 L 498 40 L 502 35 L 506 45 L 510 40 L 520 40 
                   L 525 40 L 530 43 L 534 10 L 539 65 L 543 35 L 547 40 L 555 40 
                   L 565 40 L 575 32 L 585 40 L 600 40"
                className="animate-ecg"
              />
            </svg>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0F1D17] to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* 4-Metric Vital Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Heart Rate */}
          <div className="bg-[#F7FAF8] rounded-xl p-3 border border-[#E2EAE5] hover:border-[#16845B]/40 transition-colors">
            <div className="flex items-center justify-between text-[#64746C] mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Heart Rate</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-bold font-mono text-[#172B24]">{bpm}</span>
              <span className="text-[11px] text-[#64746C]">bpm</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-amber-700 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+14 vs baseline</span>
            </div>
          </div>

          {/* SpO2 */}
          <div className="bg-[#F7FAF8] rounded-xl p-3 border border-[#E2EAE5] hover:border-[#16845B]/40 transition-colors">
            <div className="flex items-center justify-between text-[#64746C] mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">SpO₂</span>
              <Wind className="w-3.5 h-3.5 text-cyan-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-bold font-mono text-[#172B24]">94</span>
              <span className="text-[11px] text-[#64746C]">%</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-700 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Target &gt; 92%</span>
            </div>
          </div>

          {/* Blood Pressure */}
          <div className="bg-[#F7FAF8] rounded-xl p-3 border border-[#E2EAE5] hover:border-[#16845B]/40 transition-colors">
            <div className="flex items-center justify-between text-[#64746C] mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Blood Pressure</span>
              <Activity className="w-3.5 h-3.5 text-[#16845B]" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-bold font-mono text-[#172B24]">128/82</span>
              <span className="text-[10px] text-[#64746C]">mmHg</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#64746C] mt-1">
              <span>MAP: 97 mmHg</span>
            </div>
          </div>

          {/* Temperature */}
          <div className="bg-[#F7FAF8] rounded-xl p-3 border border-[#E2EAE5] hover:border-[#16845B]/40 transition-colors">
            <div className="flex items-center justify-between text-[#64746C] mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Temp</span>
              <Thermometer className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-bold font-mono text-amber-800">37.8</span>
              <span className="text-[11px] text-[#64746C]">°C</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-amber-700 mt-1">
              <span>Low-grade rise</span>
            </div>
          </div>
        </div>

        {/* Explainable Alert Panel (Key feature showcase) */}
        <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-3.5 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="text-xs sm:text-sm font-bold text-amber-950">
                    Clinical Review Recommended
                  </h5>
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900">
                    Explainable Trigger
                  </span>
                </div>
                <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                  <strong>Trigger factor:</strong> Heart rate elevation (+18 bpm over 2h) coupled with temperature rise to 37.8°C. Oxygen saturation dipped to 94% on room air.
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 bg-white/90 text-slate-700 px-2 py-0.5 rounded border border-amber-200">
                    <Clock className="w-3 h-3 text-[#16845B]" /> Detected 14m ago
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/90 text-slate-700 px-2 py-0.5 rounded border border-amber-200">
                    <ShieldCheck className="w-3 h-3 text-[#16845B]" /> Protocol: Sepsis Screen Tier 1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="bg-[#F7FAF8] px-4 sm:px-5 py-2.5 border-t border-[#E2EAE5] flex items-center justify-between text-xs text-[#64746C]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-medium text-[#172B24]">Device Telemetry Active</span>
          <span className="hidden sm:inline-block text-[#64746C]">• Last verified 30s ago</span>
        </div>
        <div className="text-[11px] font-medium text-[#16845B] flex items-center gap-1">
          <span>Continuous Trend Analysis</span>
        </div>
      </div>
    </div>
  );
}
