
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Get page title based on current route (in Hebrew)
  const getPageTitle = (): string => {
    const path = location.pathname;
    
    if (path === '/') return 'By Chen Mizrahi';
    if (path === '/customers') return 'לקוחות';
    if (path === '/customers/new') return 'הוספת לקוח';
    if (path.startsWith('/customers/edit/')) return 'עריכת לקוח';
    if (path === '/scheduling') return 'יומן';
    if (path === '/scheduling/new') return 'פגישה חדשה';
    if (path.startsWith('/scheduling/edit/')) return 'עריכת פגישה';
    if (path === '/reports') return 'דוחות';
    if (path === '/inventory') return 'מלאי';
    if (path === '/inventory/new') return 'הוספת פריט';
    if (path === '/expenses') return 'הוצאות';
    if (path === '/tasks') return 'משימות';
    if (path === '/social-media') return 'מדיה חברתית ושיווק';
    if (path === '/notifications') return 'התראות';
    if (path === '/settings') return 'הגדרות';
    if (path === '/online-booking') return 'קביעת פגישה אונליין';
    if (path === '/payments/new') return 'רישום תשלום';

    return 'By Chen Mizrahi'; // Default
  };

  // Effect to close sidebar when route changes
  useEffect(() => {
    if (mobileSidebarOpen) {
      setMobileSidebarOpen(false);
    }
  }, [location.pathname]);

  // Effect to handle body overflow when mobile sidebar is open
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = mobileSidebarOpen ? 'hidden' : '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen, isMobile]);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background" dir="rtl">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          mobileSidebarOpen ? "block" : "hidden"
        )}
      >
        <div 
          className="absolute inset-0 bg-deepNavy/20 backdrop-blur-sm" 
          onClick={() => setMobileSidebarOpen(false)}
        />
        <div className={cn(
          "absolute right-0 top-0 z-50 h-full w-64 animate-slide-in bg-background",
          !mobileSidebarOpen && "transform translate-x-full"
        )}>
          <Sidebar onLinkClick={() => setMobileSidebarOpen(false)} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        <Header 
          pageTitle={getPageTitle()} 
          toggleMobileSidebar={toggleMobileSidebar} 
        />
        <main className={cn(
          "flex-1 overflow-y-auto p-3 md:p-6 text-center bg-gradient-to-b from-warmBeige/10 to-background",
          isMobile ? "pb-20" : ""
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
