import React from 'react';
import { cn } from '@/lib/utils';

export default function GlassCard({ 
  children, 
  className, 
  variant = 'default',
  hover = false,
  padding = 'default',
  ...props 
}) {
  const variants = {
    default: 'glass-card',
    subtle: 'glass-card-subtle',
    solid: 'bg-white rounded-2xl shadow-sm border border-gray-100'
  };
  
  const paddings = {
    none: '',
    small: 'p-4',
    default: 'p-6',
    large: 'p-8'
  };

  return (
    <div 
      className={cn(
        variants[variant],
        paddings[padding],
        hover && 'transition-glass hover:shadow-lg hover:scale-[1.01]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
