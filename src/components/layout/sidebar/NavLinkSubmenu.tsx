
import { useState } from 'react';
import { LucideIcon, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import NavLink from './NavLink';

interface SubNavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavLinkSubmenuProps {
  href: string;
  label: string;
  icon: LucideIcon;
  subLinks: SubNavLink[];
  isActive: boolean;
  isParentActive: boolean;
  expandedMenus: Record<string, boolean>;
  toggleMenu: (label: string) => void;
  onLinkClick?: () => void;
}

const NavLinkSubmenu = ({ 
  href, 
  label, 
  icon: Icon, 
  subLinks, 
  isActive, 
  isParentActive,
  expandedMenus,
  toggleMenu,
  onLinkClick
}: NavLinkSubmenuProps) => {
  const isExpanded = expandedMenus[label] || false;
  
  return (
    <>
      <div
        className={cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-secondary hover:text-secondary-foreground",
          (isActive || isParentActive) ? "bg-secondary text-secondary-foreground" : "text-muted-foreground",
          "text-right justify-end cursor-pointer" // Updated to justify-end for right alignment
        )}
        onClick={() => toggleMenu(label)}
      >
        <span>{label}</span>
        <Icon className="h-4 w-4" />
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 mr-auto" />
        ) : (
          <ChevronRight className="h-4 w-4 mr-auto" />
        )}
      </div>
      
      {isExpanded && (
        <div className="mr-7 border-r pr-3 border-border/50 mt-1 mb-1 space-y-1">
          {subLinks.map(subLink => (
            <NavLink 
              key={subLink.href}
              href={subLink.href}
              label={subLink.label}
              icon={subLink.icon}
              onClick={onLinkClick}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default NavLinkSubmenu;
