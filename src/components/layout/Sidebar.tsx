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
        collapsed ? "w-16" : "w-60"
      )}
      dir="rtl"
    >
      <div className="flex items-center justify-between p-3 h-14 shrink-0">
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-roseGold to-mutedPeach flex items-center justify-center text-primary font-medium text-sm">
              CM
            </div>
            <h1 className="mr-2 font-display font-medium text-base">Chen Mizrahi</h1>
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
        <div className="py-2 space-y-4 px-2">
          <div className="space-y-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => 
                  cn(
                    "nav-link flex items-center text-sm py-1.5 px-2 rounded-md transition-colors text-right",
                    isActive ? "bg-accent/50 font-medium text-primary shadow-card" : "hover:bg-accent/30",
                    collapsed ? "justify-center" : "justify-start"
                  )
                }
                data-state={({ isActive }: {isActive: boolean}) => isActive ? "active" : "inactive"}
                onClick={handleLinkClick}
              >
                <div className="flex items-center w-full justify-end">
                  {!collapsed && <span className="mr-2">{item.name}</span>}
                  {item.icon}
                </div>
              </NavLink>
            ))}
            
            {isAdmin && (
              <NavLink
                to="/user-management"
                className={({ isActive }) => 
                  cn(
                    "nav-link flex items-center text-sm py-1.5 px-2 rounded-md transition-colors text-right",
                    isActive ? "bg-accent/50 font-medium text-primary shadow-card" : "hover:bg-accent/30",
                    collapsed ? "justify-center" : "justify-start"
                  )
                }
                data-state={({ isActive }: {isActive: boolean}) => isActive ? "active" : "inactive"}
                onClick={handleLinkClick}
              >
                <div className="flex items-center w-full justify-end">
                  {!collapsed && <span className="mr-2">ניהול משתמשים</span>}
                  <UserCog className="w-5 h-5" />
                </div>
              </NavLink>
            )}
          </div>

          <div>
            {!collapsed && (
              <h3 className="text-xs font-medium text-muted-foreground px-2 mb-1 text-right">
                ניהול פיננסי
              </h3>
            )}
            <div className="space-y-0.5">
              {financialItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => 
                    cn(
                      "nav-link flex items-center text-sm py-1.5 px-2 rounded-md transition-colors text-right",
                      isActive ? "bg-accent/50 font-medium text-primary shadow-card" : "hover:bg-accent/30",
                      collapsed ? "justify-center" : "justify-start"
                    )
                  }
                  data-state={({ isActive }: {isActive: boolean}) => isActive ? "active" : "inactive"}
                  onClick={handleLinkClick}
                >
                  <div className="flex items-center w-full justify-end">
                    {!collapsed && <span className="mr-2">{item.name}</span>}
                    {item.icon}
                  </div>
                </NavLink>
              ))}
            </div>
          </div>

          <div>
            {!collapsed && (
              <h3 className="text-xs font-medium text-muted-foreground px-2 mb-1 text-right">
                תפעול
              </h3>
            )}
            <div className="space-y-0.5">
              {operationalItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => 
                    cn(
                      "nav-link flex items-center text-sm py-1.5 px-2 rounded-md transition-colors text-right",
                      isActive ? "bg-accent/50 font-medium text-primary shadow-card" : "hover:bg-accent/30",
                      collapsed ? "justify-center" : "justify-start"
                    )
                  }
                  data-state={({ isActive }: {isActive: boolean}) => isActive ? "active" : "inactive"}
                  onClick={handleLinkClick}
                >
                  <div className="flex items-center w-full justify-end">
                    {!collapsed && <span className="mr-2">{item.name}</span>}
                    {item.icon}
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <Separator className="bg-border/30" />

      <div className="p-2 space-y-0.5 shrink-0">
        <NavLink
          to="/notifications"
          className={({ isActive }) => 
            cn(
              "nav-link flex items-center text-sm py-1.5 px-2 rounded-md transition-colors",
              isActive ? "bg-accent/50 font-medium text-primary shadow-card" : "hover:bg-accent/30",
              collapsed ? "justify-center" : "justify-start"
            )
          }
          data-state={({ isActive }: {isActive: boolean}) => isActive ? "active" : "inactive"}
          onClick={handleLinkClick}
        >
          <Bell className="w-5 h-5" />
          {!collapsed && <span className="text-right mr-2">התראות</span>}
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => 
            cn(
              "nav-link flex items-center text-sm py-1.5 px-2 rounded-md transition-colors",
              isActive ? "bg-accent/50 font-medium text-primary shadow-card" : "hover:bg-accent/30",
              collapsed ? "justify-center" : "justify-start"
            )
          }
          data-state={({ isActive }: {isActive: boolean}) => isActive ? "active" : "inactive"}
          onClick={handleLinkClick}
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="text-right mr-2">הגדרות</span>}
        </NavLink>
      </div>

      <div className="p-3 shrink-0">
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-softRose/70 to-mutedPeach/70">
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
