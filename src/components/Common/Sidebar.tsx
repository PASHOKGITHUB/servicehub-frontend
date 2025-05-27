'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp,
  Home,
  Search,
  Calendar,
  CreditCard,
  Bell,
  Star,
  User,
  Settings,
  Users,
  BookOpen,
  ArrowLeft,
  Briefcase,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  path?: string;
  children?: MenuItem[];
}

interface SidebarProps {
  role: 'user' | 'provider' | 'admin';
}

const Sidebar = ({ role }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['bookings']);

  const menuItems: Record<string, MenuItem[]> = {
    user: [
      { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/user-dashboard' },
      { id: 'browse', label: 'Browse Services', icon: Search, path: '#' },
      { 
        id: 'bookings', 
        label: 'My Bookings', 
        icon: Calendar,
        children: [
          { id: 'upcoming', label: 'Upcoming', icon: Calendar, path: '#' },
          { id: 'past', label: 'Past', icon: Calendar, path: '#' }
        ]
      },
      { id: 'payments', label: 'Payments & Wallet', icon: CreditCard, path: '#' },
      { id: 'notifications', label: 'Notifications', icon: Bell, path: '#' },
      { id: 'reviews', label: 'Ratings & Reviews', icon: Star, path: '#' },
      { id: 'support', label: 'Support', icon: HelpCircle, path: '#' },
      { id: 'profile', label: 'Profile', icon: User, path: '#' }
    ],
    provider: [
      { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/provider-dashboard' },
      { id: 'services', label: 'My Services', icon: Briefcase, path: '#' },
      { 
        id: 'bookings', 
        label: 'Booking Requests', 
        icon: Calendar,
        children: [
          { id: 'pending', label: 'Pending', icon: Calendar, path: '#' },
          { id: 'completed', label: 'Completed', icon: Calendar, path: '#' }
        ]
      },
      { id: 'earnings', label: 'Earnings', icon: CreditCard, path: '#' },
      { id: 'notifications', label: 'Notifications', icon: Bell, path: '#' },
      { id: 'reviews', label: 'Ratings & Reviews', icon: Star, path: '#' },
      { id: 'support', label: 'Support', icon: HelpCircle, path: '#' },
      { id: 'profile', label: 'Profile', icon: User, path: '#' }
    ],
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/admin-dashboard' },
      { id: 'users', label: 'User Management', icon: Users, path: '#' },
      { id: 'providers', label: 'Provider Management', icon: Users, path: '#' },
      { id: 'categories', label: 'Service Categories', icon: Settings, path: '#' },
      { id: 'bookings', label: 'Bookings Overview', icon: Calendar, path: '#' },
      { id: 'reports', label: 'Financial Reports', icon: CreditCard, path: '#' },
      { id: 'settings', label: 'System Settings', icon: Settings, path: '#' },
      { id: 'support-tickets', label: 'Support Tickets', icon: HelpCircle, path: '#' }
    ]
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.children && !isCollapsed) {
      toggleExpanded(item.id);
    } else if (item.path && item.path !== '#') {
      router.push(item.path);
    } else if (item.path === '#') {
      toast.info('This page is under development');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const isActive = (path: string) => pathname === path;

  const items = menuItems[role] || [];

  // Generate avatar background color based on email
  const getAvatarColor = (email: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
      'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500'
    ];
    const index = email.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
  <div className={cn(
    "h-screen bg-[#181A1B] border-r border-gray-800 transition-all duration-300 flex flex-col",
    "fixed left-0 top-0 z-40 lg:sticky lg:top-0 lg:z-auto",
    isCollapsed ? "w-16" : "w-64"
  )}>
      {/* Header */}
    <div className="p-3 sm:p-4 border-b border-gray-800 flex-shrink-0">
      <div className="flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#1EC6D9] rounded-lg"></div>
            <span className="font-bold text-sm sm:text-lg text-white">
              ServiceHub
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-[#E0E0E0] hover:text-white hover:bg-gray-800 p-1 sm:p-2"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />}
        </Button>
      </div>
    </div>


      {/* Navigation */}
     <nav className="flex-1 px-1 sm:px-2 py-2 sm:py-4 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id}>
            <Button
              variant="ghost"
              onClick={() => handleItemClick(item)}
              className={cn(
                "w-full justify-start h-8 sm:h-10 transition-all duration-200 text-[#E0E0E0] hover:text-white hover:bg-gray-800",
                isCollapsed ? "px-1 sm:px-2" : "px-2 sm:px-3",
                item.path && isActive(item.path) 
                  ? "bg-[#1EC6D9] text-white hover:bg-[#1EC6D9]/90" 
                  : ""
              )}
            >
              <item.icon className={cn("w-4 h-4 sm:w-5 sm:h-5", isCollapsed ? "" : "mr-2 sm:mr-3")} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left text-xs sm:text-sm">{item.label}</span>
                  {item.children && (
                    expandedItems.includes(item.id) 
                      ? <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                      : <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </>
              )}
            </Button>
            
            {/* Submenu */}
            {item.children && !isCollapsed && expandedItems.includes(item.id) && (
              <div className="ml-4 sm:ml-6 mt-1 space-y-1">
                {item.children.map((child) => (
                  <Button
                    key={child.id}
                    variant="ghost"
                    onClick={() => child.path && child.path !== '#' ? router.push(child.path) : toast.info('This page is under development')}
                    className={cn(
                      "w-full justify-start h-7 sm:h-9 text-xs sm:text-sm transition-all duration-200 text-[#E0E0E0] hover:text-white hover:bg-gray-800",
                      child.path && isActive(child.path)
                        ? "bg-[#1EC6D9] text-white hover:bg-[#1EC6D9]/90"
                        : ""
                    )}
                  >
                    <child.icon className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    {child.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer - User Profile */}
      <div className="p-2 sm:p-4 border-t border-gray-800 flex-shrink-0">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-[#E0E0E0] hover:text-white hover:bg-gray-800 h-8 sm:h-10",
                isCollapsed ? "px-1 sm:px-2" : "px-2 sm:px-3"
              )}
            >
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className={cn("rounded-full", isCollapsed ? "w-6 h-6" : "w-6 h-6 sm:w-8 sm:h-8")}
                />
              ) : (
                <div className={cn(
                  `${getAvatarColor(user?.email || '')} rounded-full flex items-center justify-center text-white font-semibold`,
                  isCollapsed ? "w-6 h-6 text-xs" : "w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm"
                )}>
                  {getInitials(user?.name || 'User')}
                </div>
              )}
              {!isCollapsed && (
                <div className="ml-2 sm:ml-3 flex-1 text-left">
                  <div className="text-xs sm:text-sm font-medium truncate">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {user?.email}
                  </div>
                </div>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" side="right" align="end">
            <div className="space-y-1">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="w-full justify-start text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Sidebar;