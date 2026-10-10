/**
 * VitalWatch Design System Tokens
 * Standardized color palettes, clinical risk severity standards, and typography scale.
 */

export const CLINICAL_SEVERITY = {
  CRITICAL: {
    label: 'Critical Risk',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-800',
    badgeBorder: 'border-red-200',
    dotColor: 'bg-red-600',
    iconColor: 'text-red-600',
  },
  HIGH: {
    label: 'High Risk',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    dotColor: 'bg-amber-600',
    iconColor: 'text-amber-600',
  },
  WARNING: {
    label: 'Warning',
    badgeBg: 'bg-yellow-50',
    badgeText: 'text-yellow-800',
    badgeBorder: 'border-yellow-200',
    dotColor: 'bg-yellow-600',
    iconColor: 'text-yellow-600',
  },
  STABLE: {
    label: 'Stable',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
    dotColor: 'bg-emerald-600',
    iconColor: 'text-emerald-600',
  },
  INFO: {
    label: 'Informational',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-800',
    badgeBorder: 'border-blue-200',
    dotColor: 'bg-blue-600',
    iconColor: 'text-blue-600',
  },
  NEUTRAL: {
    label: 'Inactive',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-200',
    dotColor: 'bg-slate-400',
    iconColor: 'text-slate-500',
  }
};

export const APP_METADATA = {
  name: 'VitalWatch',
  tagline: 'Explainable Patient Monitoring & Medication Safety',
  version: 'v1.0.4-phase1',
  syntheticDataNotice: 'Synthetic Demo Environment — Simulated Clinical Telemetry & Patient Data',
  currentUser: {
    name: 'Dr. Sarah Jenkins, MD',
    role: 'Attending Physician',
    department: 'Medical ICU',
    avatarInitials: 'SJ',
  }
};
