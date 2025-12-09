import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Button = forwardRef(({ className, variant = 'default', size = 'default', asChild = false, children, ...props }, ref) => {
  const Comp = asChild ? 'span' : 'button';
  
  const variants = {
    default: 'bg-[#0F3F96] text-white hover:bg-[#0C2D5C]',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-[#0C2D5C]',
    ghost: 'hover:bg-gray-100 text-[#0C2D5C]',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10',
  };

  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </Comp>
  );
});

Button.displayName = 'Button';

export { Button };
