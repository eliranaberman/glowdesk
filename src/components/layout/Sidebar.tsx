
import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  HomeIcon,
  LayoutDashboard,
  User2,
  Calendar,
  FileText,
  ShoppingCart,
  Coins,
  ListChecks,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  LucideIcon,
  ImageIcon,
  LayoutTemplate,
  Users,
  Contact2,
  BrainCircuit,
  Facebook,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from "@/components/ui/scroll-area"

interface NavLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  onLinkClick?: () => void;
}

const Sidebar = ({ onLinkClick }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  const Navigation = () => {
    const links: NavLinkProps[] = [
      { href: '/dashboard', label: 'דשבורד', icon: LayoutDashboard },
      { href: '/clients', label: 'לקוחות', icon: Contact2 },
      { href: '/scheduling', label: 'יומן', icon: Calendar },
      { href: '/reports', label: 'דוחות', icon: FileText },
      { href: '/inventory', label: 'מלאי', icon: ShoppingCart },
      { href: '/expenses', label: 'הוצאות', icon: Coins },
      { href: '/tasks', label: 'משימות', icon: ListChecks },
      { href: '/social-media', label: 'מדיה חברתית ושיווק', icon: MessageSquare },
      { href: '/social-media-meta', label: 'חיבור Meta API', icon: Facebook },
      { href: '/portfolio', label: 'גלריה', icon: ImageIcon },
      { href: '/marketing/templates', label: 'תבניות הודעות', icon: LayoutTemplate },
      { href: '/loyalty', label: 'תוכנית נאמנות', icon: HomeIcon },
      { href: '/users', label: 'משתמשים', icon: Users },
      { href: '/ai-assistant', label: 'עוזר AI', icon: BrainCircuit },
      { href: '/notifications', label: 'התראות', icon: Bell },
      { href: '/settings', label: 'הגדרות', icon: Settings },
    ];

    return (
      <nav className="flex flex-col space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            onClick={handleLinkClick}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-secondary hover:text-secondary-foreground",
              location.pathname === link.href
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground"
            )}
          >
            <link.icon className="h-4 w-4" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    );
  };

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r border-r-border/50 bg-sidebar text-sidebar-foreground shadow-md transition-all",
        isCollapsed ? "w-16" : "w-64",
        "h-full" // Ensure full height
      )}
    >
      <div className="flex-1 overflow-hidden px-3 py-4">
        <Link to="/dashboard" className="flex items-center pl-1.5 font-semibold">
          <Avatar className="mr-2 h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <span className={cn("whitespace-nowrap", isCollapsed && "hidden")}>
            GlowDesk
          </span>
        </Link>
        <ScrollArea className="flex-1 space-y-2 pt-6 h-[calc(100vh-120px)]">
          <Navigation />
        </ScrollArea>
      </div>
      {/* Footer */}
      <div className="border-t border-border/50 p-3">
        <Link to="/logout" className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-secondary hover:text-secondary-foreground text-muted-foreground">
          <LogOut className="h-4 w-4" />
          <span>התנתקות</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
