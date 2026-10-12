import React, { useState } from 'react';
import { Logo } from '../Logo';
import { User } from '../../types';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Package, 
  Send, 
  Users, 
  Truck, 
  FileText, 
  Settings, 
  LogOut, 
  Globe, 
  Menu, 
  X, 
  Bell,
  Building2,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface DashboardLayoutProps {
  user: User;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  onNavigateToPublic: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  activeTab,
  onSelectTab,
  onLogout,
  onNavigateToPublic,
  children
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'ai-analysis', label: 'AI Item Analysis', icon: Sparkles },
    { id: 'add-ewaste', label: 'Add E-Waste', icon: PlusCircle },
    { id: 'inventory', label: 'My Inventory', icon: Package },
    { id: 'requests', label: 'Recovery Requests', icon: Send },
    { id: 'find-partners', label: 'Find Partners', icon: Users },
    { id: 'pickup-tracking', label: 'Pickup & Coordination', icon: Truck },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EC] flex flex-col selection:bg-[#DCE5D5] selection:text-[#234D35]">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#FFFEFA] border-b border-[#E6E2D8] px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 text-[#252A25] hover:text-[#234D35] rounded-lg"
            aria-label="Toggle navigation sidebar"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onNavigateToPublic(); }}
            className="cursor-pointer"
          >
            <Logo size="sm" />
          </a>
        </div>

        {/* Center / Right: Demo Badge, Website Switcher & User Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Public Website Link */}
          <button
            onClick={onNavigateToPublic}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#626B45] hover:text-[#234D35] px-3 py-1.5 rounded-full hover:bg-[#F7F4EC] transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </button>

          {/* User Profile Capsule */}
          <div className="flex items-center gap-2 pl-3 border-l border-[#E6E2D8]">
            <div className="w-8 h-8 rounded-full bg-[#DCE5D5] text-[#234D35] flex items-center justify-center font-bold text-xs uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="hidden md:block text-left leading-tight">
              <div className="text-xs font-semibold text-[#252A25] truncate max-w-[130px]">
                {user.name}
              </div>
              <div className="text-[10px] text-[#626B45] font-medium flex items-center gap-1">
                {user.role === 'business' ? 'Generator' : 'Partner'} · {user.organization}
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <button
            onClick={onLogout}
            className="p-2 text-[#777A72] hover:text-[#252A25] rounded-xl hover:bg-[#F7F4EC] transition-colors cursor-pointer"
            title="Sign Out"
            aria-label="Sign out of demo session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* Main Layout Area: Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-4 shadow-sm self-start sticky top-24">
          
          <div className="px-3 py-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#626B45]">
              Console Navigation
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#234D35] text-[#FFFEFA] shadow-sm'
                      : 'text-[#777A72] hover:text-[#252A25] hover:bg-[#F7F4EC]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 pt-4 border-t border-[#E6E2D8] px-3 space-y-2">
            <div className="text-[11px] font-semibold text-[#252A25]">
              {user.organization}
            </div>
            <div className="text-[10px] text-[#777A72] leading-tight">
              Role: <span className="text-[#234D35] font-medium capitalize">{user.role}</span>
            </div>
          </div>

        </aside>

        {/* Mobile Slideout Sidebar */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-64 bg-[#FFFEFA] border-r border-[#E6E2D8] p-5 flex flex-col justify-between shadow-2xl z-50">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
                  <Logo size="sm" />
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 text-[#777A72]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectTab(item.id);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-[#234D35] text-[#FFFEFA]'
                            : 'text-[#777A72] hover:text-[#252A25] hover:bg-[#F7F4EC]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-[#E6E2D8] space-y-2">
                <button
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    onNavigateToPublic();
                  }}
                  className="w-full text-center py-2 text-xs font-semibold text-[#626B45] bg-[#F7F4EC] rounded-xl"
                >
                  Public Website
                </button>
                <button
                  onClick={onLogout}
                  className="w-full text-center py-2 text-xs font-semibold text-red-700 bg-red-50 rounded-xl"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content View Container */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>

    </div>
  );
};
