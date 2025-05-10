
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Contact2, 
  Calendar, 
  MessageSquare, 
  BrainCircuit, 
  ListChecks, 
  Coins, 
  FileText, 
  Bell, 
  Settings,
  Users, 
  ShieldCheck, 
  UserCog,
  Award,
  LayoutTemplate,
  Facebook,
  ImageIcon
} from 'lucide-react';
import NavLink from './NavLink';
import NavLinkSubmenu from './NavLinkSubmenu';

interface NavigationProps {
  onLinkClick?: () => void;
}

const Navigation = ({ onLinkClick }: NavigationProps) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const isLinkActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  // Check if any sublink is active
  const isParentActive = (subLinks: { href: string }[] = []) => {
    return subLinks.some(link => isLinkActive(link.href));
  };

  // Update links to match the actual routes defined in the route files
  const mainLinks = [
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
        },
        {
          href: '/portfolio',
          label: 'גלריה',
          icon: ImageIcon
        },
        {
          href: '/social-media-meta',
          label: 'חיבור Meta API',
          icon: Facebook
        }
      ]
    },
    {
      href: '/ai-assistant',
      label: 'עוזר AI',
      icon: BrainCircuit
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
      href: '#',
      label: 'הגדרות',
      icon: Settings,
      subLinks: [
        {
          href: '/users',
          label: 'ניהול משתמשים',
          icon: Users
        },
        {
          href: '/user-roles',
          label: 'תפקידים והרשאות',
          icon: ShieldCheck
        },
        {
          href: '/user-profile',
          label: 'פרופיל משתמש',
          icon: UserCog
        }
      ]
    }
  ];

  // Auto-expand the menu that contains the active route
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Find any menu that should be expanded based on current path
    mainLinks.forEach(link => {
      if (link.subLinks) {
        const shouldExpand = link.subLinks.some(subLink => 
          currentPath === subLink.href || currentPath.startsWith(subLink.href + '/')
        );
        
        if (shouldExpand) {
          setExpandedMenus(prev => ({
            ...prev,
            [link.label]: true
          }));
        }
      }
    });
  }, [location.pathname]);

  return (
    <nav className="flex flex-col space-y-1">
      {mainLinks.map(link => (
        <div key={link.href} className="flex flex-col">
          {link.subLinks ? (
            <NavLinkSubmenu 
              href={link.href}
              label={link.label}
              icon={link.icon}
              subLinks={link.subLinks}
              isActive={isLinkActive(link.href)}
              isParentActive={isParentActive(link.subLinks)}
              expandedMenus={expandedMenus}
              toggleMenu={toggleMenu}
              onLinkClick={onLinkClick}
            />
          ) : (
            <NavLink 
              href={link.href} 
              label={link.label} 
              icon={link.icon}
              onClick={onLinkClick}
            />
          )}
        </div>
      ))}
    </nav>
  );
};

export default Navigation;
