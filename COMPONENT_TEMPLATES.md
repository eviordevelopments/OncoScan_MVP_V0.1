# Component Templates

Quick templates for creating the missing components. Copy and customize as needed.

## UI Components (shadcn/ui style)

### Button (`src/components/ui/button.jsx`)

```jsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Button = forwardRef(({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
  const Comp = asChild ? 'span' : 'button';
  
  const variants = {
    default: 'bg-[#0F3F96] text-white hover:bg-[#0C2D5C]',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50',
    ghost: 'hover:bg-gray-100',
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
    />
  );
});

Button.displayName = 'Button';

export { Button };
```

### Input (`src/components/ui/input.jsx`)

```jsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Input = forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F3F96] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
```

### Label (`src/components/ui/label.jsx`)

```jsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Label = forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
));

Label.displayName = 'Label';

export { Label };
```

### Checkbox (`src/components/ui/checkbox.jsx`)

```jsx
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
```

### Textarea (`src/components/ui/textarea.jsx`)

```jsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Textarea = forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F3F96] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };
```

### Select (`src/components/ui/select.jsx`)

```jsx
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

const SelectValue = () => {
  const { value } = useContext(SelectContext);
  return <span>{value}</span>;
};

const SelectContent = ({ children }) => {
  const { open, setOpen } = useContext(SelectContext);
  
  if (!open) return null;
  
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
        {children}
      </div>
    </>
  );
};

const SelectItem = ({ value, children }) => {
  const { onValueChange, setOpen } = useContext(SelectContext);
  
  return (
    <div
      onClick={() => {
        onValueChange(value);
        setOpen(false);
      }}
      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
    >
      {children}
    </div>
  );
};

SelectTrigger.displayName = 'SelectTrigger';

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
```

### Switch (`src/components/ui/switch.jsx`)

```jsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Switch = forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F3F96] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-[#0F3F96]' : 'bg-gray-200',
        className
      )}
      ref={ref}
      {...props}
    >
      <span
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
});

Switch.displayName = 'Switch';

export { Switch };
```

### Tabs (`src/components/ui/tabs.jsx`)

```jsx
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
```

### Dialog (`src/components/ui/dialog.jsx`)

```jsx
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
          'bg-white rounded-2xl shadow-2xl p-6',
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

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };
```

---

## Common Components

### GlassCard (`src/components/common/GlassCard.jsx`)

```jsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const GlassCard = forwardRef(({ children, padding = 'default', hover = false, className, asChild, ...props }, ref) => {
  const Comp = asChild ? 'div' : 'div';
  
  const paddingClasses = {
    small: 'p-3',
    default: 'p-6',
    large: 'p-8',
  };

  return (
    <Comp
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
    </Comp>
  );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;
```

### StatusBadge (`src/components/common/StatusBadge.jsx`)

```jsx
import { cn } from '@/lib/utils';

export default function StatusBadge({ status, size = 'default' }) {
  const colors = {
    processing: 'bg-blue-100 text-blue-700',
    awaiting_review: 'bg-amber-100 text-amber-700',
    completed: 'bg-emerald-100 text-emerald-700',
    archived: 'bg-gray-100 text-gray-700',
  };

  const sizes = {
    small: 'text-xs px-2 py-0.5',
    default: 'text-sm px-3 py-1',
  };

  const labels = {
    processing: 'Processing',
    awaiting_review: 'Awaiting Review',
    completed: 'Completed',
    archived: 'Archived',
  };

  return (
    <span className={cn('rounded-full font-medium', colors[status], sizes[size])}>
      {labels[status]}
    </span>
  );
}
```

### RiskBadge (`src/components/common/RiskBadge.jsx`)

```jsx
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
```

### TiradsBadge (`src/components/common/TiradsBadge.jsx`)

```jsx
import { cn } from '@/lib/utils';

export default function TiradsBadge({ category, size = 'default' }) {
  const colors = {
    1: 'bg-emerald-100 text-emerald-700',
    2: 'bg-green-100 text-green-700',
    3: 'bg-yellow-100 text-yellow-700',
    4: 'bg-orange-100 text-orange-700',
    5: 'bg-red-100 text-red-700',
  };

  const sizes = {
    small: 'text-xs px-2 py-0.5',
    default: 'text-sm px-3 py-1',
  };

  return (
    <span className={cn('rounded-full font-medium', colors[category], sizes[size])}>
      TI-RADS {category}
    </span>
  );
}
```

---

## Layout Components

### Layout (`src/components/layout/Layout.jsx`)

```jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

### PatientLayout (`src/components/layout/PatientLayout.jsx`)

```jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function PatientLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isPatient />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
```

### Sidebar (`src/components/layout/Sidebar.jsx`)

```jsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Plus, 
  FolderOpen, 
  Cpu, 
  Settings, 
  HelpCircle,
  Activity,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'New Case', href: '/new-case', icon: Plus },
    { name: 'Case Archive', href: '/cases', icon: FolderOpen },
    { name: 'Devices', href: '/devices', icon: Cpu },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle },
  ];

  return (
    <div className="w-64 bg-white/70 backdrop-blur-md border-r border-white/20 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F3F96] to-[#3C7CE3] flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#0C2D5C]">OncoScan AI</h1>
            <p className="text-xs text-[#9CA3AF]">Clinician Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#0F3F96] text-white'
                  : 'text-[#9CA3AF] hover:bg-gray-100'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
```

### Header (`src/components/layout/Header.jsx`)

```jsx
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, User, Activity } from 'lucide-react';

export default function Header({ isPatient = false }) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white/70 backdrop-blur-md border-b border-white/20 flex items-center justify-between px-6">
      {isPatient && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F3F96] to-[#3C7CE3] flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#0C2D5C]">OncoScan AI</h1>
            <p className="text-xs text-[#9CA3AF]">Patient Portal</p>
          </div>
        </div>
      )}
      
      {!isPatient && <div />}

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
          <Bell className="w-5 h-5 text-[#9CA3AF]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <Link to={isPatient ? '/patient/portal' : '/settings'} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F3F96] to-[#3C7CE3] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-[#0C2D5C]">
            {user?.full_name?.split(' ')[0] || 'User'}
          </span>
        </Link>
      </div>
    </header>
  );
}
```

---

## Usage Instructions

1. **Copy the template** for the component you need
2. **Create the file** in the appropriate directory
3. **Customize** as needed for your specific use case
4. **Test** the component in your application
5. **Iterate** based on design requirements

## Notes

- All components use Tailwind CSS for styling
- Components follow the glassmorphism design system
- Icons are from `lucide-react`
- Utility function `cn()` is used for class merging
- Components are accessible and keyboard-navigable

---

**Last Updated**: December 8, 2024
