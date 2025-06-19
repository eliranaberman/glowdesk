
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();

  // For debugging
  console.log("Layout rendering with user:", user?.id);

  const getPageTitle = (): string => {
    const path = location.pathname;
    
    if (path === '/') return 'דשבורד';
    if (path === '/dashboard') return 'דשבורד';
    if (path === '/customers') return 'לקוחות';
    if (path === '/customers/new') return 'הוספת לקוח';
    if (path.startsWith('/customers/edit/')) return 'עריכת לקוח';
    if (path === '/clients') return 'לקוחות';
    if (path === '/clients/new') return 'הוספת לקוח';
    if (path.startsWith('/clients/edit/')) return 'עריכת לקוח';
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
    if (path === '/finances/cash-flow') return 'תזרים מזומנים';
    if (path === '/finances/insights') return 'תובנות עסקיות';
    if (path === '/insights') return 'התובנות העסקיות שלך';
    if (path === '/loyalty') return 'תוכנית נאמנות';
    if (path === '/marketing/templates') return 'תבניות הודעות';
    if (path === '/portfolio') return 'גלריה';
    if (path === '/ai-assistant') return 'עוזר AI';
    if (path === '/magic-tools') return 'כלי קסם';

    return 'דשבורד'; // Default
  };

  const shouldShowBackButton = (): boolean => {
    const path = location.pathname;
    return path !== '/dashboard' && path !== '/'; // Show back button on all pages except the dashboard
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page in history
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  useEffect(() => {
    if (mobileSidebarOpen) {
      setMobileSidebarOpen(false);
    }
  }, [location.pathname]);

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
      {/* Desktop Sidebar - always visible on larger screens */}
      <div className="hidden lg:block lg:h-full lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar - only shown when toggled */}
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
          <Sidebar />
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden w-full">
        <Header 
          pageTitle={getPageTitle()} 
          toggleMobileSidebar={toggleMobileSidebar}
          handleLogout={handleLogout}
          user={user}
        />
        
        {shouldShowBackButton() && (
          <div className="px-4 pt-2 md:px-6 md:pt-3 flex justify-end">
            <Button 
              variant="back" 
              size="sm" 
              onClick={handleBackClick}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              חזרה
            </Button>
          </div>
        )}
        
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
