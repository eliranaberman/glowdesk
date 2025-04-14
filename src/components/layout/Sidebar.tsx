
import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart,
  Package,
  ClipboardList,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Share2,
  DollarSign,
  TrendingUp,
  UserCog,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { 
    name: 'דשבורד', 
    path: '/', 
    icon: <LayoutDashboard className="w-5 h-5" /> 
  },
  { 
    name: 'יומן', 
    path: '/scheduling', 
    icon: <Calendar className="w-5 h-5" /> 
  },
  { 
    name: 'לקוחות', 
    path: '/clients', 
    icon: <Users className="w-5 h-5" /> 
  },
  { 
    name: 'מדיה חברתית', 
    path: '/social-media', 
    icon: <Share2 className="w-5 h-5" /> 
  },
];

const financialItems = [
  {
    name: 'תזרים מזומנים',
    path: '/finances/cash-flow',
    icon: <DollarSign className="w-5 h-5" />
  },
  {
    name: 'תובנות עסקיות',
    path: '/finances/insights',
    icon: <TrendingUp className="w-5 h-5" />
  }
];

const operationalItems = [
  { 
    name: 'הוצאות',
    path: '/expenses', 
    icon: <Receipt className="w-5 h-5" />
  },
  { 
    name: 'משימות', 
    path: '/tasks', 
    icon: <ClipboardList className="w-5 h-5" /> 
  },
  { 
    name: 'מלאי', 
    path: '/inventory', 
    icon: <Package className="w-5 h-5" /> 
  },
  { 
    name: 'דוחות', 
    path: '/reports', 
    icon: <BarChart className="w-5 h-5" /> 
  },
];

interface SidebarProps {
  onLinkClick?: () => void;
}

const Sidebar = ({ onLinkClick }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  // Check if the current user is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (!error && data && data.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (!collapsed && scrollAreaRef.current) {
      const activeElement = scrollAreaRef.current.querySelector('[data-state="active"]');
      if (activeElement) {
        setTimeout(() => {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [collapsed, location.pathname]);

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-l border-border/50 transition-all duration-300 shadow-card overflow-hidden",
        collapsed ? "w-16" : "w-64"
      )}
      dir="rtl"
    >
      <div className="flex items-center justify-between p-4 h-16 shrink-0">
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-roseGold to-mutedPeach flex items-center justify-center text-primary font-medium">
              CM
            </div>
            <h1 className="mr-2 font-display font-medium text-lg">Chen Mizrahi</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("hover:bg-accent/30", collapsed ? "mx-auto" : "mr-auto")}
        >
          {collapsed ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Separator className="bg-border/30" />

      <ScrollArea 
        className="flex-1 pr-0 pl-1 overflow-y-auto overflow-x-hidden"
        scrollHideDelay={200}
      >
        <div className="py-3 space-y-6 px-2">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => 
                  cn(
                    "nav-link flex items-center",
                    isActive ? "bg-accent/50 font-medium text-primary shadow-card" : "hover:bg-accent/30",
                    collapsed ? "justify-center" : "justify-start"
                  )
                }
                data-state={({ isActive }: {isActive: boolean}) => isActive ? "active" : "inactive"}
                onClick={handleLinkClick}
              >
                {!collapsed && <span className="text-right flex-grow">{item.name}</span>}
                {item.icon}
              </NavLink>
            ))}
            
            {/* Admin-only link */}
            {isAdmin && (
              <NavLink
                to="/user-management"
                className={({ isActive }) => 
                  cn(
                    "nav-link flex items-center",
                    isActive ? "bg-accent/50 font-medium text-primary shadow-card" : "hover:bg-accent/30",
                    collapsed ? "justify-center" : "justify-start"
                  )
                }
                data-state={({ isActive }: {isActive: boolean}) => isActive ? "active" : "inactive"}
                onClick={handleLinkClick}
              >
                {!collapsed && <span className="text-right flex-grow">ניהול משתמשים</span>}
                <UserCog className="w-5 h-5" />
              </NavLink>
            )}
          </div>

          <div>
            {!collapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground px-2 py-1 text-right">
                ניהול פיננסי
              </h3>
            )}
            <div className="mt-1 space-y-1">
              {financialItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => 
                    cn(
                      "nav-link flex items-center",
                      isActive ? "bg-accent/50 font-medium text-primary shadow-card" : "hover:bg-accent/30",
                      collapsed ? "justify-center" : "justify-start"
                    )
                  }
                  data-state={({ isActive }: {isActive: boolean}) => isActive ? "active" : "inactive"}
                  onClick={handleLinkClick}
                >
                  {!collapsed && <span className="text-right flex-grow">{item.name}</span>}
                  {item.icon}
                </NavLink>
              ))}
            </div>
          </div>

          <div>
            {!collapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground px-2 py-1 text-right">
                תפעול
              </h3>
            )}
            <div className="mt-1 space-y-1">
              {operationalItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => 
                    cn(
                      "nav-link flex items-center",
                      isActive ? "bg-accent/50 font-medium text-primary shadow-card" : "hover:bg-accent/30",
                      collapsed ? "justify-center" : "justify-start"
                    )
                  }
                  data-state={({ isActive }: {isActive: boolean}) => isActive ? "active" : "inactive"}
                  onClick={handleLinkClick}
                >
                  {!collapsed && <span className="text-right flex-grow">{item.name}</span>}
                  {item.icon}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <Separator className="bg-border/30" />

      <div className="p-2 space-y-1 shrink-0">
        <NavLink
          to="/notifications"
          className={({ isActive }) => 
            cn(
              "nav-link flex items-center justify-end",
              isActive ? "bg-accent/50 font-medium text-primary shadow-card" : "hover:bg-accent/30",
              collapsed ? "justify-center" : "justify-end"
            )
          }
          data-state={({ isActive }: {isActive: boolean}) => isActive ? "active" : "inactive"}
          onClick={handleLinkClick}
        >
          <Bell className="w-5 h-5 ml-2" />
          {!collapsed && <span>התראות</span>}
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => 
            cn(
              "nav-link flex items-center justify-end",
              isActive ? "bg-accent/50 font-medium text-primary shadow-card" : "hover:bg-accent/30",
              collapsed ? "justify-center" : "justify-end"
            )
          }
          data-state={({ isActive }: {isActive: boolean}) => isActive ? "active" : "inactive"}
          onClick={handleLinkClick}
        >
          <Settings className="w-5 h-5 ml-2" />
          {!collapsed && <span>הגדרות</span>}
        </NavLink>
      </div>

      <div className="p-4 shrink-0">
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-softRose/70 to-mutedPeach/70">
              {/* Profile image would go here */}
            </div>
            <div className="mr-2 truncate text-right">
              <p className="text-sm font-medium">חן מזרחי</p>
              <p className="text-xs text-muted-foreground">בעלים</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
