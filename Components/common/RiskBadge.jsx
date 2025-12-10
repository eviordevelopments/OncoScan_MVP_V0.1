import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

const riskConfig = {
  high: {
    label: 'HIGH RISK',
    className: 'badge-high-risk',
    icon: AlertCircle
  },
  medium: {
    label: 'MEDIUM RISK',
    className: 'badge-medium-risk',
    icon: AlertTriangle
  },
  low: {
    label: 'LOW RISK',
    className: 'badge-low-risk',
    icon: CheckCircle
  }
};

export default function RiskBadge({ risk, size = 'default', showIcon = true }) {
  const config = riskConfig[risk] || riskConfig.low;
  const Icon = config.icon;
  
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    default: 'px-3 py-1.5 text-sm',
    large: 'px-5 py-2 text-base'
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-bold rounded-full shadow-sm',
      config.className,
      sizeClasses[size]
    )}>
      {showIcon && <Icon className="w-4 h-4" />}
      {config.label}
    </span>
  );
}
