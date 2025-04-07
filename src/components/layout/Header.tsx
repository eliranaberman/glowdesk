
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  Menu,
  Search,
  Moon,
  SunMedium,
  Bell,
  User,
  HelpCircle,
  Settings,
  LogOut,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
}

interface HeaderProps {
  pageTitle?: string;
  toggleMobileSidebar?: () => void;
}

const Header = ({ pageTitle, toggleMobileSidebar }: HeaderProps = {}) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
    // Implement theme persistence logic here (e.g., using localStorage)
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "חיפוש בוצע",
        description: `מחפש: "${searchQuery}"`,
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems: NavItem[] = [
    { href: "/", label: "דשבורד" },
    { href: "/customers", label: "לקוחות" },
    { href: "/scheduling", label: "תזמון" },
    { href: "/reports", label: "דוחות" },
    { href: "/inventory", label: "מלאי" },
    { href: "/expenses", label: "הוצאות" },
    { href: "/tasks", label: "משימות" },
    { href: "/social-media", label: "מדיה חברתית" },
    { href: "/loyalty", label: "תוכנית נאמנות" },
    { href: "/finances/cash-flow", label: "פיננסים" },
  ];

  return (
    <header className="bg-background sticky top-0 z-50 border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        {/* Mobile menu */}
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" onClick={toggleMobileSidebar}>
                <Menu className="h-5 w-5 ml-2" />
                {pageTitle || "תפריט"}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-3/4 md:w-2/3">
              <SheetHeader className="text-right">
                <SheetTitle>תפריט</SheetTitle>
                <SheetDescription>
                  נווט בין האפשרויות השונות של המערכת.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <form onSubmit={handleSearch} className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="חיפוש..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.label}>
                      <Link to={item.href} className="block py-2">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <SheetHeader className="text-right">
                <SheetTitle>הגדרות</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full">
                      <User className="h-4 w-4 ml-2" />
                      הגדרות משתמש
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>הגדרות משתמש</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="h-4 w-4 ml-2" />
                      הגדרות
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 ml-2" />
                      התנתקות
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center">
            <Link to="/" className="font-bold text-2xl">
              {/* Replace with your logo */}
              {pageTitle || "My App"}
            </Link>
            <ul className="flex items-center gap-4 mr-8">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === item.href
                        ? "text-primary underline underline-offset-4"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Theme toggle and user menu */}
        <div className="flex items-center space-x-4">
          {!isMobile && (
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="חיפוש..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          )}
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {isDarkTheme ? (
              <SunMedium className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5 ml-2" />
                <span className="sr-only">User Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>הגדרות משתמש</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="h-4 w-4 ml-2" />
                הגדרות
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 ml-2" />
                התנתקות
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
