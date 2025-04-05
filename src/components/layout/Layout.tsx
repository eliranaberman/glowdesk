
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Get page title based on current route (in Hebrew)
  const getPageTitle = (): string => {
    const path = location.pathname;
    
    if (path === '/') return 'דשבורד';
    if (path === '/customers') return 'לקוחות';
    if (path === '/customers/new') return 'הוספת לקוח';
    if (path === '/scheduling') return 'יומן';
    if (path === '/scheduling/new') return 'פגישה חדשה';
    if (path === '/reports') return 'דוחות';
    if (path === '/inventory') return 'מלאי';
    if (path === '/inventory/new') return 'הוספת פריט';
    if (path === '/tasks') return 'משימות';
    if (path === '/notifications') return 'התראות';
    if (path === '/settings') return 'הגדרות';
    if (path === '/online-booking') return 'קביעת פגישה אונליין';
    if (path === '/payments/new') return 'רישום תשלום';

    return 'דשבורד'; // Default
  };

  return (
    <div className="flex h-screen overflow-hidden" dir="rtl">
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
          className="absolute inset-0 bg-black/50" 
          onClick={() => setMobileSidebarOpen(false)}
        />
        <div className={cn(
          "absolute right-0 top-0 z-50 h-full w-64 animate-slide-in",
          !mobileSidebarOpen && "transform translate-x-full"
        )}>
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          pageTitle={getPageTitle()} 
          toggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
