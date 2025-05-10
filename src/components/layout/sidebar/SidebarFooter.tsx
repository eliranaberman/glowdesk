
import { LogOut } from 'lucide-react';

interface SidebarFooterProps {
  onLogout: () => Promise<void>;
}

const SidebarFooter = ({ onLogout }: SidebarFooterProps) => {
  return (
    <div className="border-t border-border/50 p-3">
      <button 
        onClick={onLogout} 
        className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-secondary hover:text-secondary-foreground text-muted-foreground text-right justify-end"
      >
        <span>התנתקות</span>
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
};

export default SidebarFooter;
