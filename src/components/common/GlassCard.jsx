import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const GlassCard = forwardRef(({ children, padding = 'default', hover = false, className, ...props }, ref) => {
  const paddingClasses = {
    small: 'p-3',
    default: 'p-6',
    large: 'p-8',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl',
        paddingClasses[padding],
        hover && 'transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;
