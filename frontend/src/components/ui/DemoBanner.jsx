import React from 'react';
import { Database, ShieldAlert } from 'lucide-react';
import { APP_METADATA } from '../../styles/tokens';

export function DemoBanner() {
  return (
    <div className="bg-slate-900 text-slate-300 border-b border-slate-800 px-4 py-1.5 text-xs flex items-center justify-between shrink-0 font-medium">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-teal-900/80 text-teal-300 text-[10px] uppercase font-bold tracking-wider border border-teal-700/50">
          Demo Mode
        </span>
        <div className="flex items-center gap-1.5 text-slate-300">
          <Database className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span className="truncate">{APP_METADATA.syntheticDataNotice}</span>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-2 text-slate-400 text-[11px]">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>HIPAA / Non-PHI Compliant Test Bed</span>
      </div>
    </div>
  );
}
