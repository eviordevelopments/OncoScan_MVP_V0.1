import { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const Checkbox = forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded border border-gray-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F3F96] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        checked && 'bg-[#0F3F96] border-[#0F3F96]',
        className
      )}
      ref={ref}
      {...props}
    >
      {checked && <Check className="h-3 w-3 text-white" />}
    </button>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
