
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarHeaderProps {
  isCollapsed: boolean;
}

const SidebarHeader = ({ isCollapsed }: SidebarHeaderProps) => {
  return (
    <Link to="/dashboard" className="flex items-center justify-end pl-1.5 font-semibold mb-4">
      <span className={cn("whitespace-nowrap text-center", isCollapsed && "hidden")}>by.chen.mizrahi</span>
      <Avatar className="ml-2 h-8 w-8">
        <AvatarImage alt="Brand Logo" src="/lovable-uploads/9359e539-3bc2-4c89-abd8-c495b1f4754c.png" />
        <AvatarFallback>CM</AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default SidebarHeader;
