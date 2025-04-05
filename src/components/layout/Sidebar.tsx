
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
} from 'lucide-react';

const navItems = [
  { 
    name: 'Dashboard', 
    path: '/', 
    icon: <LayoutDashboard className="w-5 h-5" /> 
  },
  { 
    name: 'Customers', 
    path: '/customers', 
    icon: <Users className="w-5 h-5" /> 
  },
  { 
    name: 'Scheduling', 
    path: '/scheduling', 
    icon: <Calendar className="w-5 h-5" /> 
  },
  { 
    name: 'Reports', 
    path: '/reports', 
    icon: <BarChart className="w-5 h-5" /> 
  },
  { 
    name: 'Inventory', 
    path: '/inventory', 
    icon: <Package className="w-5 h-5" /> 
  },
  { 
    name: 'Tasks', 
    path: '/tasks', 
    icon: <ClipboardList className="w-5 h-5" /> 
  }
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              NZ
            </div>
            <h1 className="ml-2 font-bold text-lg">Nail Zenith</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
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
              >
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
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
            >
              <Bell className="w-5 h-5" />
              {!collapsed && <span>Notifications</span>}
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
            >
              <Settings className="w-5 h-5" />
              {!collapsed && <span>Settings</span>}
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
            <div className="ml-2 truncate">
              <p className="text-sm font-medium">Nail Tech</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
