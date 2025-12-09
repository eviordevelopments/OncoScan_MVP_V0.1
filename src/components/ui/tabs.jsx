import { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

const TabsContext = createContext();

const Tabs = ({ defaultValue, value: controlledValue, onValueChange, children, className }) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;
  
  const handleValueChange = (newValue) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ className, children }) => (
  <div
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500',
      className
    )}
  >
    {children}
  </div>
);

const TabsTrigger = ({ value, children, className }) => {
  const { value: selectedValue, onValueChange } = useContext(TabsContext);
  const isSelected = value === selectedValue;

  return (
    <button
      type="button"
      onClick={() => onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F3F96] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isSelected && 'bg-white text-[#0C2D5C] shadow-sm',
        className
      )}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children, className }) => {
  const { value: selectedValue } = useContext(TabsContext);
  
  if (value !== selectedValue) return null;

  return <div className={className}>{children}</div>;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
