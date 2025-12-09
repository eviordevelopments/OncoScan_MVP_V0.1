import { forwardRef, createContext, useContext, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const SelectContext = createContext();

const Select = ({ children, value, onValueChange }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen } = useContext(SelectContext);
  
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F3F96] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
});

const SelectValue = ({ placeholder }) => {
  const { value } = useContext(SelectContext);
  return <span className={!value ? 'text-gray-400' : ''}>{value || placeholder}</span>;
};

const SelectContent = ({ children }) => {
  const { open, setOpen } = useContext(SelectContext);
  
  if (!open) return null;
  
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-60 overflow-auto">
        {children}
      </div>
    </>
  );
};

const SelectItem = ({ value, children }) => {
  const { onValueChange, setOpen, value: selectedValue } = useContext(SelectContext);
  
  return (
    <div
      onClick={() => {
        onValueChange(value);
        setOpen(false);
      }}
      className={cn(
        'px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer',
        selectedValue === value && 'bg-gray-50 font-medium'
      )}
    >
      {children}
    </div>
  );
};

SelectTrigger.displayName = 'SelectTrigger';

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
