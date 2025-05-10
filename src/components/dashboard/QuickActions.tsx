
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const QuickActions = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="border rounded-xl p-4 md:p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 bg-warmBeige/10">
      <h2 className="text-base md:text-lg font-display font-medium mb-4 md:mb-6 flex items-center">
        <span className="bg-softRose/40 w-1 h-6 rounded mr-2"></span>
        פעולות מהירות
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        <Link to="/scheduling/new" className="bg-card hover:bg-accent/20 p-4 md:p-5 rounded-xl cursor-pointer transition-all duration-300 shadow-soft hover:shadow-soft-lg flex flex-col transform hover:-translate-y-1">
          <h3 className="font-medium text-primary mb-1">פגישה חדשה</h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">תזמון פגישה ללקוח חדש</p>
        </Link>
        <Link to="/customers/new" className="bg-card hover:bg-accent/20 p-4 md:p-5 rounded-xl cursor-pointer transition-all duration-300 shadow-soft hover:shadow-soft-lg flex flex-col transform hover:-translate-y-1">
          <h3 className="font-medium text-primary mb-1">הוספת לקוח</h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">יצירת פרופיל לקוח חדש</p>
        </Link>
        <Link to="/payments/new" className="bg-card hover:bg-accent/20 p-4 md:p-5 rounded-xl cursor-pointer transition-all duration-300 shadow-soft hover:shadow-soft-lg flex flex-col transform hover:-translate-y-1">
          <h3 className="font-medium text-primary mb-1">רישום תשלום</h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">תיעוד עסקה חדשה</p>
        </Link>
        <Link to="/inventory/new" className="bg-card hover:bg-accent/20 p-4 md:p-5 rounded-xl cursor-pointer transition-all duration-300 shadow-soft hover:shadow-soft-lg flex flex-col transform hover:-translate-y-1">
          <h3 className="font-medium text-primary mb-1">עדכון מלאי</h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">רישום מוצרים חדשים או חוסרים</p>
        </Link>
        <Link to="/ai-assistant" className="bg-card hover:bg-accent/20 p-4 md:p-5 rounded-xl cursor-pointer transition-all duration-300 shadow-soft hover:shadow-soft-lg flex flex-col transform hover:-translate-y-1">
          <h3 className="font-medium text-primary mb-1">העוזרת החכמה</h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">ייעוץ אישי מבוסס AI</p>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
