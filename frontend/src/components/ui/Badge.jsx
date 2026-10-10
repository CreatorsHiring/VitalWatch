import React from 'react';
import { CLINICAL_SEVERITY } from '../../styles/tokens';

export function Badge({
  children,
  severity = 'NEUTRAL',
  showDot = true,
  size = 'md',
  className = '',
}) {
  const config = CLINICAL_SEVERITY[severity] || CLINICAL_SEVERITY.NEUTRAL;

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${config.badgeBg} ${config.badgeText} ${config.badgeBorder} ${sizeClasses[size]} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} shrink-0`} />
      )}
      <span>{children || config.label}</span>
    </span>
  );
}
