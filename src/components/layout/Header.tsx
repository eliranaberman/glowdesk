
import { useState } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  pageTitle: string;
  toggleMobileSidebar: () => void;
}

const Header = ({ pageTitle, toggleMobileSidebar }: HeaderProps) => {
  const [notificationCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would perform an actual search
      toast({
        title: "חיפוש",
        description: `מחפש: "${searchQuery}"`,
      });
      
      // For demo purposes, navigate to a relevant page based on search
      if (searchQuery.toLowerCase().includes('לקוח') || 
          searchQuery.toLowerCase().includes('client')) {
        navigate('/customers');
      } else if (searchQuery.toLowerCase().includes('פגיש') || 
                searchQuery.toLowerCase().includes('appoint')) {
        navigate('/scheduling');
      } else if (searchQuery.toLowerCase().includes('שיווק') || 
                searchQuery.toLowerCase().includes('market')) {
        navigate('/social-media');
      } else {
        // Default search results page could be added here
        toast({
          title: "תוצאות חיפוש",
          description: "לא נמצאו תוצאות התואמות לחיפוש שלך",
          variant: "destructive",
        });
      }
      
      setSearchQuery('');
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

        <form onSubmit={handleSearch} className="hidden md:flex items-center max-w-sm flex-1 mx-4">
          <div className="relative w-full">
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חיפוש..."
              className="pr-8 rounded-full bg-secondary border-none text-right"
              dir="rtl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {notificationCount}
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
        </div>
      </div>
    </header>
  );
};

export default Header;
