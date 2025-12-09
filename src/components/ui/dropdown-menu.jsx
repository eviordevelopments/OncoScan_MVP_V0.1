import { forwardRef, createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

const DropdownMenuContext = createContext();

const DropdownMenu = ({ children, ...props }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block" {...props}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = forwardRef(({ className, children, asChild, ...props }, ref) => {
  const { setOpen } = useContext(DropdownMenuContext);
  
  const handleClick = () => setOpen(prev => !prev);
  
  if (asChild && children) {
    const child = children;
    return (
      <div onClick={handleClick} ref={ref}>
        {child}
      </div>
    );
  }
  
  return (
    <button
      ref={ref}
      onClick={handleClick}
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = forwardRef(({ className, align = "center", children, ...props }, ref) => {
  const { open, setOpen } = useContext(DropdownMenuContext);
  
  if (!open) return null;
  
  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0"
  };
  
  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={() => setOpen(false)}
      />
      <div
        ref={ref}
        className={cn(
          "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-lg",
          alignmentClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = forwardRef(({ className, asChild, children, ...props }, ref) => {
  const { setOpen } = useContext(DropdownMenuContext);
  
  const handleClick = (e) => {
    if (props.onClick) {
      props.onClick(e);
    }
    setOpen(false);
  };
  
  if (asChild && children) {
    return (
      <div onClick={handleClick} ref={ref}>
        {children}
      </div>
    );
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-gray-200", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuLabel = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-3 py-2 text-sm font-semibold text-gray-900", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
};
