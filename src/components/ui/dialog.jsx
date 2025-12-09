import { createContext, useContext } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const DialogContext = createContext();

const Dialog = ({ open, onOpenChange, children }) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = ({ children, asChild }) => {
  const { onOpenChange } = useContext(DialogContext);
  
  if (asChild) {
    return <div onClick={() => onOpenChange(true)}>{children}</div>;
  }
  
  return (
    <button onClick={() => onOpenChange(true)}>
      {children}
    </button>
  );
};

const DialogContent = ({ className, children }) => {
  const { open, onOpenChange } = useContext(DialogContext);
  
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] p-4">
        <div className={cn(
          'bg-white rounded-2xl shadow-2xl p-6 relative',
          className
        )}>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#0F3F96] focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
          </button>
          {children}
        </div>
      </div>
    </>
  );
};

const DialogHeader = ({ className, children }) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}>
    {children}
  </div>
);

const DialogTitle = ({ className, children }) => (
  <h2 className={cn('text-lg font-semibold text-[#0C2D5C]', className)}>
    {children}
  </h2>
);

const DialogDescription = ({ className, children }) => (
  <p className={cn('text-sm text-[#9CA3AF]', className)}>
    {children}
  </p>
);

const DialogFooter = ({ className, children }) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6', className)}>
    {children}
  </div>
);

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };
