
import { LucideIcon } from 'lucide-react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}

const NavLink = ({ href, label, icon: Icon, onClick }: NavLinkProps) => {
  return (
    <RouterNavLink 
      to={href} 
      onClick={onClick}
      className={({isActive}) => cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-secondary hover:text-secondary-foreground",
        isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground",
        "text-right justify-end" // Right alignment for standard links
      )}
    >
      <span>{label}</span>
      <Icon className="h-4 w-4" />
    </RouterNavLink>
  );
};

export default NavLink;
