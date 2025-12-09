import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RiskBadge({ risk, size = 'default', showIcon = true }) {
  const colors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-emerald-100 text-emerald-700',
  };

  const sizes = {
    small: 'text-xs px-2 py-0.5',
    default: 'text-sm px-3 py-1',
  };

  const icons = {
    high: AlertTriangle,
    medium: AlertCircle,
    low: CheckCircle,
  };

  const Icon = icons[risk];

  return (
    <span className={cn('rounded-full font-medium inline-flex items-center gap-1', colors[risk], sizes[size])}>
      {showIcon && <Icon className="w-3 h-3" />}
      {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
    </span>
  );
}
