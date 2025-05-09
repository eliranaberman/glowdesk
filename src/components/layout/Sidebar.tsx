import { useState, useEffect } from 'react';
import { useLocation, Link, NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { HomeIcon, LayoutDashboard, User2, Calendar, FileText, ShoppingCart, Coins, ListChecks, MessageSquare, Bell, Settings, LogOut, LucideIcon, ImageIcon, LayoutTemplate, Users, Contact2, BrainCircuit, Facebook, ShieldCheck, UserCog } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from "@/components/ui/scroll-area";
interface NavLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
}
interface SidebarProps {
  onLinkClick?: () => void;
}
const Sidebar = ({
  onLinkClick
}: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {
    user,
    signOut
  } = useAuth();

  // For debugging
  useEffect(() => {
    console.log("Sidebar rendering with user:", user?.id);
  }, [user]);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const Navigation = () => {
    const links: NavLinkProps[] = [{
      href: '/dashboard',
      label: 'דשבורד',
      icon: LayoutDashboard
    }, {
      href: '/clients',
      label: 'לקוחות',
      icon: Contact2
    }, {
      href: '/scheduling',
      label: 'יומן',
      icon: Calendar
    }, {
      href: '/reports',
      label: 'דוחות',
      icon: FileText
    }, {
      href: '/inventory',
      label: 'מלאי',
      icon: ShoppingCart
    }, {
      href: '/expenses',
      label: 'הוצאות',
      icon: Coins
    }, {
      href: '/tasks',
      label: 'משימות',
      icon: ListChecks
    }, {
      href: '/social-media',
      label: 'מדיה חברתית ושיווק',
      icon: MessageSquare
    }, {
      href: '/social-media-meta',
      label: 'חיבור Meta API',
      icon: Facebook
    }, {
      href: '/portfolio',
      label: 'גלריה',
      icon: ImageIcon
    }, {
      href: '/marketing/templates',
      label: 'תבניות הודעות',
      icon: LayoutTemplate
    }, {
      href: '/loyalty',
      label: 'תוכנית נאמנות',
      icon: HomeIcon
    }, {
      href: '/users',
      label: 'ניהול משתמשים',
      icon: Users
    }, {
      href: '/user-roles',
      label: 'תפקידים והרשאות',
      icon: ShieldCheck
    }, {
      href: '/user-profile',
      label: 'פרופיל משתמש',
      icon: UserCog
    }, {
      href: '/ai-assistant',
      label: 'עוזר AI',
      icon: BrainCircuit
    }, {
      href: '/notifications',
      label: 'התראות',
      icon: Bell
    }, {
      href: '/settings',
      label: 'הגדרות',
      icon: Settings
    }];
    return <nav className="flex flex-col space-y-1">
        {links.map(link => <NavLink key={link.href} to={link.href} onClick={handleLinkClick} className={({
        isActive
      }) => cn("group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-secondary hover:text-secondary-foreground", isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground", "text-right justify-end" // Right alignment and justify-end
      )}>
            <span>{link.label}</span>
            <link.icon className="h-4 w-4" />
          </NavLink>)}
      </nav>;
  };
  return <div className={cn("flex h-screen flex-col border-r border-r-border/50 bg-sidebar text-sidebar-foreground shadow-md transition-all", isCollapsed ? "w-16" : "w-64", "h-full" // Ensure full height
  )}>
      <div className="flex-1 overflow-hidden px-3 py-4">
        <Link to="/dashboard" className="flex items-center justify-center pl-1.5 font-semibold">
          <span className={cn("whitespace-nowrap text-center", isCollapsed && "hidden")}>          by.chen.mizrahi</span>
          <Avatar className="ml-2 h-8 w-8">
            <AvatarImage alt="Brand Logo" src="/lovable-uploads/9359e539-3bc2-4c89-abd8-c495b1f4754c.png" />
            <AvatarFallback>CM</AvatarFallback>
          </Avatar>
        </Link>
        <ScrollArea className="flex-1 space-y-2 pt-6 h-[calc(100vh-120px)] text-right">
          <Navigation />
        </ScrollArea>
      </div>
      {/* Footer */}
      <div className="border-t border-border/50 p-3">
        <button onClick={handleLogout} className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-secondary hover:text-secondary-foreground text-muted-foreground text-right justify-end">
          <span>התנתקות</span>
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>;
};
export default Sidebar;