
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
} from 'lucide-react';

const navItems = [
  { 
    name: 'דשבורד', 
    path: '/', 
    icon: <LayoutDashboard className="w-5 h-5" /> 
  },
  { 
    name: 'לקוחות', 
    path: '/customers', 
    icon: <Users className="w-5 h-5" /> 
  },
  { 
    name: 'יומן', 
    path: '/scheduling', 
    icon: <Calendar className="w-5 h-5" /> 
  },
  { 
    name: 'דוחות', 
    path: '/reports', 
    icon: <BarChart className="w-5 h-5" /> 
  },
  { 
    name: 'הוצאות',
    path: '/expenses', 
    icon: <Receipt className="w-5 h-5" />
  },
  { 
    name: 'מלאי', 
    path: '/inventory', 
    icon: <Package className="w-5 h-5" /> 
  },
  { 
    name: 'משימות', 
    path: '/tasks', 
    icon: <ClipboardList className="w-5 h-5" /> 
  }
];

interface SidebarProps {
  onLinkClick?: () => void;
}

const Sidebar = ({ onLinkClick }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Handle link click - notify parent component
  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-l border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
      dir="rtl"
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              CM
            </div>
            <h1 className="mr-2 font-bold text-lg">By Chen Mizrahi</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="mr-auto"
        >
          {collapsed ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Separator />

      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  cn(
                    "nav-link",
                    isActive && "active",
                    collapsed && "justify-center"
                  )
                }
                onClick={handleLinkClick}
              >
                {item.icon}
                {!collapsed && <span className="text-right">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <Separator />

      <div className="p-2">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/notifications"
              className={({ isActive }) => 
                cn(
                  "nav-link",
                  isActive && "active",
                  collapsed && "justify-center"
                )
              }
              onClick={handleLinkClick}
            >
              <Bell className="w-5 h-5" />
              {!collapsed && <span className="text-right">התראות</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) => 
                cn(
                  "nav-link",
                  isActive && "active",
                  collapsed && "justify-center"
                )
              }
              onClick={handleLinkClick}
            >
              <Settings className="w-5 h-5" />
              {!collapsed && <span className="text-right">הגדרות</span>}
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="p-4">
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-nail-300">
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
