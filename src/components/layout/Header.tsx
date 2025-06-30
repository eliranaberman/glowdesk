import { useState } from 'react';
import { Bell, Menu, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { User as SupabaseUser } from '@supabase/supabase-js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';

interface HeaderProps {
  pageTitle: string;
  toggleMobileSidebar: () => void;
  handleLogout: () => Promise<void>;
  user: SupabaseUser | null;
}

const Header = ({ pageTitle, toggleMobileSidebar, handleLogout, user }: HeaderProps) => {
  const [notificationCount] = useState(3);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get user initials for avatar
  const getUserInitials = (): string => {
    if (!user) return '';
    
    const fullName = user.user_metadata?.full_name || '';
    if (!fullName) return user.email?.charAt(0).toUpperCase() || '';
    
    const nameParts = fullName.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  // Get display name
  const getDisplayName = (): string => {
    if (!user) return '';
    return user.user_metadata?.full_name || user.email || '';
  };

  // Enhanced logout with loading state
  const performLogout = async () => {
    try {
      setIsLoggingOut(true);
      await handleLogout();
      // Navigation is handled in AuthContext
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "שגיאה בהתנתקות",
        description: "אירעה שגיאה בתהליך ההתנתקות, אנא נסו שוב",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="w-full bg-background sticky top-0 z-10 border-b border-border">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleMobileSidebar}
            type="button"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-center">By Chen Mizrahi</h1>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-12 w-12">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[12px] font-medium text-primary-foreground min-w-[24px]">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 text-right">
              <DropdownMenuLabel className="text-right">התראות</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                <DropdownMenuItem onClick={() => navigate("/notifications")}>
                  <div className="flex flex-col gap-1 text-right w-full">
                    <p className="text-sm font-medium">נקבעה פגישה חדשה</p>
                    <p className="text-xs text-muted-foreground">רחל כהן - היום, 14:00</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/inventory")}>
                  <div className="flex flex-col gap-1 text-right w-full">
                    <p className="text-sm font-medium">התראת מלאי נמוך</p>
                    <p className="text-xs text-muted-foreground">לק ג'ל אדום (נותרו 2)</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1 text-right w-full">
                    <p className="text-sm font-medium">תזכורת</p>
                    <p className="text-xs text-muted-foreground">להזמין מלאי חדש</p>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center font-medium text-primary" onClick={() => navigate("/notifications")}>
                צפה בכל ההתראות
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full h-8 w-8">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 text-right">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex justify-end gap-2" onClick={() => navigate("/settings")}>
                <div>הגדרות</div>
                <User className="h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex justify-end gap-2 text-destructive" 
                onClick={performLogout}
                disabled={isLoggingOut}
              >
                <div>
                  {isLoggingOut ? 'מתנתק...' : 'התנתקות'}
                </div>
                <LogOut className="h-4 w-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
