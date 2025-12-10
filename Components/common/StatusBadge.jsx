import React from 'react';
import { Loader2, Clock, CheckCircle2, AlertTriangle, Archive } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  processing: {
    label: 'AI Processing',
    icon: Loader2,
    className: 'status-processing',
    animate: true
  },
  awaiting_review: {
    label: 'Awaiting Review',
    icon: Clock,
    className: 'status-awaiting'
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    className: 'status-completed'
  },
  flagged: {
    label: 'Flagged',
    icon: AlertTriangle,
    className: 'status-flagged'
  },
  archived: {
    label: 'Archived',
    icon: Archive,
    className: 'bg-gray-100 text-gray-600'
  }
};

export default function StatusBadge({ status, size = 'default' }) {
  const config = statusConfig[status] || statusConfig.processing;
  const Icon = config.icon;
  
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    default: 'px-3 py-1 text-sm',
    large: 'px-4 py-1.5 text-base'
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-medium rounded-full',
      config.className,
      sizeClasses[size]
    )}>
      <Icon className={cn('w-3.5 h-3.5', config.animate && 'animate-spin')} />
      {config.label}
    </span>
  );
}
