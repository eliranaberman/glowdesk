
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from "@/components/ui/scroll-area";

// Import refactored components
import Navigation from './sidebar/Navigation';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarFooter from './sidebar/SidebarFooter';

interface SidebarProps {
  onLinkClick?: () => void;
}

const Sidebar = ({ onLinkClick }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, signOut } = useAuth();

  // For debugging
  useEffect(() => {
    console.log("Sidebar rendering with user:", user?.id);
  }, [user]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className={cn(
      "flex h-screen flex-col border-r border-r-border/50 bg-sidebar text-sidebar-foreground shadow-md transition-all", 
      isCollapsed ? "w-16" : "w-64", 
      "h-full" // Ensure full height
    )}>
      <div className="flex-1 overflow-hidden px-3 py-4">
        <SidebarHeader isCollapsed={isCollapsed} />
        <ScrollArea className="flex-1 space-y-2 pt-2 h-[calc(100vh-120px)] text-right">
          <Navigation onLinkClick={onLinkClick} />
        </ScrollArea>
      </div>
      <SidebarFooter onLogout={handleLogout} />
    </div>
  );
};

export default Sidebar;
