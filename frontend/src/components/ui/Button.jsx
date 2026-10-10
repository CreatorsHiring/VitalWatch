import React from 'react';

const variantClasses = {
  primary: 'bg-teal-700 hover:bg-teal-800 text-white border border-transparent shadow-sm focus:ring-teal-600',
  secondary: 'bg-navy-800 hover:bg-navy-900 text-white border border-transparent shadow-sm focus:ring-navy-700',
  outline: 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-sm focus:ring-teal-600',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-400',
  danger: 'bg-red-700 hover:bg-red-800 text-white border border-transparent shadow-sm focus:ring-red-600',
  success: 'bg-emerald-700 hover:bg-emerald-800 text-white border border-transparent shadow-sm focus:ring-emerald-600',
};

const sizeClasses = {
  sm: 'px-2.5 py-1 text-xs gap-1.5',
  md: 'px-3.5 py-1.5 text-sm gap-2',
  lg: 'px-4 py-2 text-base gap-2.5',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseClass = 'clinical-btn';
  const variantStyle = variantClasses[variant] || variantClasses.primary;
  const sizeStyle = sizeClasses[size] || sizeClasses.md;
  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClass} ${variantStyle} ${sizeStyle} ${widthStyle} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
      ) : null}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
      )}
    </button>
  );
}
