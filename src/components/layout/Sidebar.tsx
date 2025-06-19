import { useState } from 'react';
import {
  BarChart,
  Building,
  Calendar,
  DollarSign,
  FileText,
  Home,
  LayoutDashboard,
  ListChecks,
  LucideIcon,
  Receipt,
  Settings,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const Sidebar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    {
      title: 'ראשי',
      items: [
        { title: 'לוח בקרה', href: '/', icon: LayoutDashboard },
        { title: 'יומן פגישות', href: '/scheduling', icon: Calendar },
        { title: 'ניהול משימות', href: '/tasks', icon: ListChecks },
      ],
    },
    {
      title: 'לקוחות',
      items: [
        { title: 'ניהול לקוחות', href: '/clients', icon: Users },
      ],
    },
    {
      title: 'כספים',
      items: [
        { title: 'הכנסות', href: '/finances/revenues', icon: TrendingUp },
        { title: 'הוצאות', href: '/expenses', icon: Receipt },
        { title: 'תזרים מזומנים', href: '/finances/cash-flow', icon: DollarSign },
        { title: 'דוחות כספיים', href: '/finances/reports', icon: FileText },
        { title: 'תובנות עסקיות', href: '/finances/business-insights', icon: BarChart }, // Added this line
        { title: 'ניהול עסקי', href: '/finances/business-management', icon: Building },
      ]
    },
    {
      title: 'הגדרות',
      items: [
        { title: 'הגדרות מערכת', href: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="flex h-full border-r-2 bg-background">
      <div className="hidden border-r-2 md:block">
        <div className="flex h-full w-60 flex-col space-y-1">
          <div className="flex px-3 py-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <ScrollArea className="h-full py-2">
              {menuItems.map((group: MenuGroup) => (
                <div key={group.title} className="mb-2 space-y-1">
                  <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
                    {group.title}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item: MenuItem) => (
                      <Link key={item.title} to={item.href}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start ${
                            location.pathname === item.href
                              ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                              : ''
                          }`}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
          <div className="flex items-center border-t px-3 py-2">
            <Button variant="outline" className="w-full justify-center">
              <Home className="mr-2 h-4 w-4" />
              <span>ביקור באתר</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
