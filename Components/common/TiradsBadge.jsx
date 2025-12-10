import React from 'react';
import { cn } from '@/lib/utils';

const tiradsConfig = {
  1: { className: 'tirads-1', label: 'Benign' },
  2: { className: 'tirads-2', label: 'Not Suspicious' },
  3: { className: 'tirads-3', label: 'Mildly Suspicious' },
  4: { className: 'tirads-4', label: 'Moderately Suspicious' },
  5: { className: 'tirads-5', label: 'Highly Suspicious' }
};

export default function TiradsBadge({ category, showLabel = false, size = 'default' }) {
  if (!category || category < 1 || category > 5) return null;
  
  const config = tiradsConfig[category];
  
  const sizeClasses = {
    small: 'w-6 h-6 text-sm',
    default: 'w-8 h-8 text-base',
    large: 'w-12 h-12 text-xl'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        'flex items-center justify-center rounded-full font-bold shadow-sm',
        config.className,
        sizeClasses[size]
      )}>
        {category}
      </div>
      {showLabel && (
        <div className="text-sm">
          <div className="font-medium text-[#0C2D5C]">TI-RADS {category}</div>
          <div className="text-[#9CA3AF] text-xs">{config.label}</div>
        </div>
      )}
    </div>
  );
}
