import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/common/Logo';
import { 
  LayoutDashboard, 
  Plus, 
  FolderOpen, 
  Cpu, 
  Settings, 
  HelpCircle,
  Home,
  FileText,
  BookOpen,
  LogOut,
  Bell,
  User,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Layout({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isPatient = user?.role === 'patient';

  // Different navigation for clinician vs patient
  const clinicianNav = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'New Case', href: '/new-case', icon: Plus },
    { name: 'Case Archive', href: '/cases', icon: FolderOpen },
    { name: 'Devices', href: '/devices', icon: Cpu },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle },
  ];

  const patientNav = [
    { name: 'Home', href: '/patient/portal', icon: Home },
    { name: 'My Reports', href: '/patient/reports', icon: FileText },
    { name: 'Education', href: '/patient/education', icon: BookOpen },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const navigation = isPatient ? patientNav : clinicianNav;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white/70 backdrop-blur-md border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Logo size="default" showText={true} />
          <p className="text-xs text-gray-500 mt-1">v1.0 MVP</p>
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
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-[#0F3F96] text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:scale-105'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Model Status */}
        <div className="px-4 pb-4 border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-gray-700 font-medium">Model Online</span>
          </div>
          <p className="text-xs text-gray-500 ml-4 mt-1">OncoScan Binary v1.0</p>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-all hover:scale-105"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white/70 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6">
          <div />
          
          <div className="flex items-center gap-4">
            {/* Model Ready Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Model Ready</span>
            </div>

            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <Link to="/settings" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F3F96] to-[#3C7CE3] flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-800">
                {user?.full_name?.split(' ')[0] || 'User'}
              </span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children || <Outlet />}
        </main>

        {/* FDA Disclaimer Footer */}
        <footer className="border-t border-gray-200 bg-white/70 backdrop-blur-md px-6 py-3">
          <p className="text-xs text-center">
            <span className="font-semibold text-red-600">FDA Notice:</span>{' '}
            <span className="text-gray-700">OncoScan AI™ is a screening aid only. Final diagnosis must be rendered by a qualified radiologist.</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
