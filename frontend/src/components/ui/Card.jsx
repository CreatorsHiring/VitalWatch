import React from 'react';

export function Card({
  title,
  subtitle,
  actions,
  children,
  footer,
  className = '',
  bodyClassName = 'p-4 md:p-5',
}) {
  return (
    <div className={`clinical-card ${className}`}>
      {(title || subtitle || actions) && (
        <div className="px-4 py-3 md:px-5 md:py-3.5 border-b border-slate-200 flex items-center justify-between gap-4">
          <div>
            {title && <h3 className="text-sm md:text-base font-semibold text-slate-900 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
      {footer && (
        <div className="px-4 py-3 md:px-5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
}
