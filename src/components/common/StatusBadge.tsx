import React from 'react';
import { RiskLevel } from '../../types/risk';

interface StatusBadgeProps {
  type?: 'risk' | 'condition' | 'trend' | 'status';
  riskLevel?: RiskLevel;
  statusText?: string;
  variant?: 'green' | 'amber' | 'red' | 'blue' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type = 'status',
  riskLevel,
  statusText,
  variant,
  size = 'md',
  className = '',
}) => {
  let resolvedVariant = variant || 'neutral';
  let label = statusText || '';

  if (type === 'risk' && riskLevel) {
    if (riskLevel === 'HIGH') {
      resolvedVariant = 'red';
      label = 'HIGH RISK';
    } else if (riskLevel === 'MODERATE') {
      resolvedVariant = 'amber';
      label = 'MODERATE RISK';
    } else {
      resolvedVariant = 'green';
      label = 'LOW RISK';
    }
  }

  const variantStyles = {
    green: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    amber: 'bg-amber-50 text-amber-900 border-amber-200/80',
    red: 'bg-rose-50 text-rose-800 border-rose-200/80',
    blue: 'bg-sky-50 text-sky-800 border-sky-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded',
    md: 'text-xs font-semibold px-2.5 py-1 rounded-md',
    lg: 'text-sm font-semibold px-3 py-1.5 rounded-md',
  };

  const dotColors = {
    green: 'bg-emerald-600',
    amber: 'bg-amber-500',
    red: 'bg-rose-600',
    blue: 'bg-sky-600',
    neutral: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border ${variantStyles[resolvedVariant]} ${sizeStyles[size]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[resolvedVariant]}`} />
      <span>{label}</span>
    </span>
  );
};
