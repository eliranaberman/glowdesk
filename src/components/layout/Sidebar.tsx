import { useState, useEffect } from 'react';
import { useLocation, Link, NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
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
  ShieldCheck, 
  UserCog,
  Award,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Package
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface SubNavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavLinkWithSubLinks extends NavLinkProps {
  subLinks?: SubNavLink[];
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
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const { user, signOut } = useAuth();

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

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const isMenuExpanded = (label: string) => {
    return expandedMenus[label] || false;
  };

  const isLinkActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  // Check if any sublink is active
  const isParentActive = (subLinks: SubNavLink[] = []) => {
    return subLinks.some(link => isLinkActive(link.href));
  };

  const Navigation = () => {
    const mainLinks: NavLinkWithSubLinks[] = [
      {
        href: '/dashboard',
        label: 'דשבורד',
        icon: LayoutDashboard
      },
      {
        href: '/clients',
        label: 'לקוחות',
        icon: Contact2
      },
      {
        href: '/scheduling',
        label: 'יומן',
        icon: Calendar
      },
      {
        href: '#',
        label: 'מדיה חברתית ושיווק',
        icon: MessageSquare,
        subLinks: [
          {
            href: '/social-media',
            label: 'מדיה חברתית ושיווק',
            icon: MessageSquare
          },
          {
            href: '/marketing/templates',
            label: 'תבניות הודעות',
            icon: LayoutTemplate
          },
          {
            href: '/loyalty',
            label: 'תוכנית נאמנות',
            icon: Award
          }
        ]
      },
      {
        href: '/tasks',
        label: 'משימות',
        icon: ListChecks
      },
      {
        href: '/expenses',
        label: 'הוצאות',
        icon: Coins
      },
      {
        href: '/inventory',
        label: 'מלאי',
        icon: Package
      },
      {
        href: '/portfolio',
        label: 'גלריה',
        icon: ImageIcon
      },
      {
        href: '/insights',
        label: 'תובנות עסקיות',
        icon: TrendingUp
      },
      {
        href: '/reports',
        label: 'דוחות',
        icon: FileText
      },
      {
        href: '/notifications',
        label: 'התראות',
        icon: Bell
      },
      {
        href: '/whatsapp-settings',
        label: 'הגדרות WhatsApp',
        icon: MessageSquare
      },
      {
        href: '/settings',
        label: 'הגדרות',
        icon: Settings
      }
    ];

    return (
      <nav className="flex flex-col space-y-1">
        {mainLinks.map(link => (
          <div key={link.href} className="flex flex-col">
            {link.subLinks ? (
              <>
                <div
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-secondary hover:text-secondary-foreground",
                    (isLinkActive(link.href) || isParentActive(link.subLinks)) ? "bg-secondary text-secondary-foreground" : "text-muted-foreground",
                    "text-right justify-end cursor-pointer relative"
                  )}
                  onClick={() => toggleMenu(link.label)}
                >
                  {isMenuExpanded(link.label) ? (
                    <ChevronDown className="h-4 w-4 absolute left-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 absolute left-2" />
                  )}
                  <span>{link.label}</span>
                  <link.icon className="h-4 w-4" />
                </div>
                
                {isMenuExpanded(link.label) && (
                  <div className="mr-7 border-r pr-3 border-border/50 mt-1 mb-1 space-y-1">
                    {link.subLinks.map(subLink => (
                      <NavLink 
                        key={subLink.href} 
                        to={subLink.href} 
                        onClick={handleLinkClick}
                        className={({isActive}) => cn(
                          "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-secondary hover:text-secondary-foreground",
                          isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground",
                          "text-right justify-end"
                        )}
                      >
                        <span>{subLink.label}</span>
                        <subLink.icon className="h-4 w-4" />
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink 
                to={link.href} 
                onClick={handleLinkClick}
                className={({isActive}) => cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-secondary hover:text-secondary-foreground",
                  isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground",
                  "text-right justify-end"
                )}
              >
                <span>{link.label}</span>
                <link.icon className="h-4 w-4" />
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    );
  };

  return (
    <div className={cn(
      "flex h-screen flex-col border-r border-r-border/50 bg-sidebar text-sidebar-foreground shadow-md transition-all", 
      isCollapsed ? "w-16" : "w-64", 
      "h-full"
    )}>
      <div className="flex-1 overflow-hidden px-3 py-4">
        <Link to="/dashboard" className="flex items-center justify-end pl-1.5 font-semibold mb-4">
          <span className={cn("whitespace-nowrap text-center", isCollapsed && "hidden")}>by.chen.mizrahi</span>
          <Avatar className="ml-2 h-8 w-8">
            <AvatarImage alt="Brand Logo" src="/lovable-uploads/9359e539-3bc2-4c89-abd8-c495b1f4754c.png" />
            <AvatarFallback>CM</AvatarFallback>
          </Avatar>
        </Link>
        <ScrollArea className="flex-1 space-y-2 pt-2 h-[calc(100vh-120px)] text-right">
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
    </div>
  );
};
export default Sidebar;
