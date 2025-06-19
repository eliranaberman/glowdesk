
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  Bell,
  Calendar,
  CheckSquare,
  LayoutDashboard,
  ListChecks,
  LucideIcon,
  Menu,
  MessageSquare,
  Settings,
  ShoppingBag,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  items: NavItem[];
}

const navigationItems = [
  {
    title: "דשבורד",
    url: "/dashboard",
    icon: LayoutDashboard,
    items: [],
  },
  {
    title: "פגישות",
    url: "/appointments",
    icon: Calendar,
    items: [],
  },
  {
    title: "לקוחות",
    url: "/clients",
    icon: Users,
    items: [],
  },
  {
    title: "שירותים",
    url: "/services",
    icon: ListChecks,
    items: [],
  },
  {
    title: "מכירות",
    url: "/sales",
    icon: ShoppingBag,
    items: [],
  },
  {
    title: "מדיה חברתית",
    url: "/social-media",
    icon: MessageSquare,
    items: [],
  },
  {
    title: "משימות",
    url: "/tasks",
    icon: CheckSquare,
    items: [],
  },
  {
    title: "דיווחים",
    url: "/reports",
    icon: BarChart3,
    items: [],
  },
  {
    title: "הגדרות",
    url: "/settings",
    icon: Settings,
    items: [],
  },
  {
    title: "כלי קסם",
    url: "/magic-tools",
    icon: Sparkles,
    items: [],
  },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "התנתקת בהצלחה",
        description: "תודה שביקרת בגלוודסק!"
      });
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        variant: "destructive",
        title: "שגיאה בהתנתקות",
        description: "אירעה שגיאה במהלך ההתנתקות. אנא נסה שוב."
      });
    }
  };

  return (
    <>
      {isMobile ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 -ml-2 text-muted-foreground hover:text-primary"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-3/4 md:w-2/5">
            <SheetHeader className="space-y-2.5">
              <SheetTitle>תפריט</SheetTitle>
              <SheetDescription>
                נווט בין האפשרויות השונות במערכת
              </SheetDescription>
            </SheetHeader>
            <Separator className="my-4" />
            <div className="flex flex-col space-y-2 text-right">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={({ isActive }) =>
                    `flex items-center text-sm font-medium py-2 px-3 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </NavLink>
              ))}
            </div>
            <Separator className="my-4" />
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              התנתקות
            </Button>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border py-4 w-60 shrink-0">
          <div className="flex items-center justify-between px-4 mb-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>החשבון שלי</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  פרופיל
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  התנתקות
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex-grow px-2 flex flex-col text-right space-y-1">
            {navigationItems.map((item) =>
              item.items.length > 0 ? (
                <Accordion
                  type="single"
                  collapsible
                  key={item.title}
                  className="border-none"
                >
                  <AccordionItem value={item.title}>
                    <AccordionTrigger className="text-sm font-medium flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
                      <div className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-8">
                      {item.items.map((subItem) => (
                        <NavLink
                          key={subItem.title}
                          to={subItem.url}
                          className={({ isActive }) =>
                            `block text-sm font-medium py-2 px-3 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${
                              isActive
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground"
                            }`
                          }
                        >
                          {subItem.title}
                        </NavLink>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={({ isActive }) =>
                    `flex items-center text-sm font-medium py-2 px-3 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    }`
                  }
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </NavLink>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
