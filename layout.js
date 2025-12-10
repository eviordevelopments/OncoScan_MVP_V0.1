import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import Logo from '@/components/common/Logo';
import { 
  LayoutDashboard, 
  Plus, 
  FolderOpen, 
  Settings,
  HelpCircle,
  ChevronRight,
  LogOut,
  User,
  Menu,
  X,
  Activity,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation items based on user role
  const getNavItems = (userRole) => {
    if (userRole === 'user') {
      // Patient navigation
      return [
        { name: 'Home', icon: LayoutDashboard, page: 'PatientPortal' },
        { name: 'My Reports', icon: FolderOpen, page: 'PatientReports' },
        { name: 'Education', icon: HelpCircle, page: 'Education' },
        { name: 'Settings', icon: Settings, page: 'Settings' }
      ];
    }
    
    // Radiologist/Admin navigation
    return [
      { name: 'Dashboard', icon: LayoutDashboard, page: 'Dashboard' },
      { name: 'New Case', icon: Plus, page: 'NewCase' },
      { name: 'My Cases', icon: FolderOpen, page: 'CaseArchive' },
      { name: 'Devices', icon: Activity, page: 'DeviceManager' },
      { name: 'Settings', icon: Settings, page: 'Settings' },
      { name: 'Help & Resources', icon: HelpCircle, page: 'Help' }
    ];
  };

  const navItems = getNavItems(user?.role);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {
        // User not logged in
      }
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  // Pages that shouldn't show layout (if any needed in future)
  const noLayoutPages = [];
  if (noLayoutPages.includes(currentPageName)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 glass-card border-r border-[rgba(15,63,150,0.1)] flex flex-col transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-5 border-b border-[rgba(15,63,150,0.08)]">
          <Link to={createPageUrl('Dashboard')} className="block">
            <Logo size="default" />
          </Link>
          <div className="mt-2 text-xs text-[#9CA3AF]">v1.0 MVP</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.name}
                to={createPageUrl(item.page)}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-[#0F3F96] text-white shadow-md" 
                    : "text-[#0C2D5C] hover:bg-[rgba(15,63,150,0.08)]"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Model Status */}
        <div className="p-4 border-t border-[rgba(15,63,150,0.08)]">
          <div className="glass-card-subtle p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#10B981] pulse-live" />
              <span className="text-xs font-medium text-[#10B981]">Model Online</span>
            </div>
            <div className="text-xs text-[#9CA3AF]">
              OncoScan Binary v1.0
            </div>
            <div className="text-xs text-[#9CA3AF]">
              ResNet-34 | AUC 0.839
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 glass-card border-b border-[rgba(15,63,150,0.1)] rounded-none">
          <div className="flex items-center justify-between px-4 lg:px-6 h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <Link to={createPageUrl('Dashboard')} className="text-[#9CA3AF] hover:text-[#0F3F96]">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
              <span className="text-[#0C2D5C] font-medium">{currentPageName}</span>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Model Status Indicator */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(16,185,129,0.1)]">
                <Activity className="w-4 h-4 text-[#10B981]" />
                <span className="text-xs font-medium text-[#10B981]">Model Ready</span>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-[#0C2D5C]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#D4273E] rounded-full" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F3F96] to-[#3C7CE3] flex items-center justify-center text-white text-sm font-medium">
                      {user?.full_name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-[#0C2D5C]">
                      {user?.full_name || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium">{user?.full_name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-[#0F3F96] capitalize">{user?.role}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl('Settings')} className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-[#D4273E]">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>

        {/* Footer Disclaimer */}
        <footer className="px-4 lg:px-6 py-3 text-center text-xs text-[#9CA3AF] border-t border-[rgba(15,63,150,0.08)]">
          <span className="text-[#D4273E] font-medium">FDA Notice:</span> OncoScan AI™ is a screening aid only. Final diagnosis must be rendered by a qualified radiologist.
        </footer>
      </div>
    </div>
  );
}

