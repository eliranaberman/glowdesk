
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/use-permissions';
import {
  Calendar,
  Users,
  PieChart,
  Settings,
  CreditCard,
  Package,
  MessageSquare,
  Camera,
  ChevronDown,
  ChevronRight,
  Home,
  UserCog,
  FileText,
  CheckSquare,
  Star,
  TrendingUp,
  DollarSign,
  BarChart3,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const navigationItems = [
  {
    title: 'דשבורד',
    href: '/dashboard',
    icon: Home,
    requiresAuth: true
  },
  {
    title: 'תורים',
    href: '/scheduling',
    icon: Calendar,
    requiresAuth: true
  },
  {
    title: 'לקוחות',
    href: '/clients',
    icon: Users,
    requiresAuth: true
  },
  {
    title: 'גלריה',
    href: '/portfolio',
    icon: Camera,
    requiresAuth: true
  },
  {
    title: 'משימות',
    href: '/tasks',
    icon: CheckSquare,
    requiresAuth: true
  },
  {
    title: 'מלאי',
    href: '/inventory',
    icon: Package,
    requiresAuth: true
  },
  {
    title: 'כספים',
    icon: DollarSign,
    requiresAuth: true,
    children: [
      {
        title: 'הוצאות',
        href: '/expenses',
        icon: CreditCard
      },
      {
        title: 'הכנסות',
        href: '/revenues',
        icon: TrendingUp
      },
      {
        title: 'דוחות כספיים',
        href: '/reports',
        icon: BarChart3
      },
      {
        title: 'תובנות עסקיות',
        href: '/business-insights',
        icon: PieChart
      }
    ]
  },
  {
    title: 'שיווק',
    href: '/marketing',
    icon: MessageSquare,
    requiresAuth: true
  },
  {
    title: 'רשתות חברתיות',
    href: '/social-media',
    icon: Star,
    requiresAuth: true
  },
  {
    title: 'ניהול משתמשים',
    href: '/user-management',
    icon: UserCog,
    requiresAuth: true,
    requiresAdmin: true
  },
  {
    title: 'הגדרות',
    href: '/settings',
    icon: Settings,
    requiresAuth: true
  }
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = usePermissions();

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isExpanded = (title: string) => expandedItems.includes(title);

  const handleSignOut = async () => {
    await signOut();
  };

  const filteredNavigation = navigationItems.filter(item => {
    if (!user && item.requiresAuth) return false;
    if (item.requiresAdmin && !isAdmin) return false;
    return true;
  });

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-40 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">GlowDesk</h1>
            <p className="text-sm text-gray-600 mt-1">ניהול סלון יופי</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {filteredNavigation.map((item) => (
                <li key={item.title}>
                  {item.children ? (
                    <div>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-between text-right font-normal",
                          isExpanded(item.title) && "bg-gray-100"
                        )}
                        onClick={() => toggleExpanded(item.title)}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </div>
                        {isExpanded(item.title) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      {isExpanded(item.title) && (
                        <ul className="mt-2 space-y-1 pr-6">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <NavLink
                                to={child.href}
                                className={({ isActive }) => cn(
                                  "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                                  isActive
                                    ? "bg-blue-100 text-blue-700 font-medium"
                                    : "text-gray-700 hover:bg-gray-100"
                                )}
                                onClick={() => setIsOpen(false)}
                              >
                                <child.icon className="h-4 w-4" />
                                <span>{child.title}</span>
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <NavLink
                      to={item.href}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-normal",
                        isActive
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* User section */}
          {user && (
            <div className="p-4 border-t border-gray-200">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900">
                  {user.user_metadata?.full_name || user.email}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                התנתק
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
