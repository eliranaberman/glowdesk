
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface PDFExportProps {
  reportTitle: string;
  reportType: string;
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const PDFExport = ({ reportTitle, reportType }: PDFExportProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleExportPDF = () => {
    setLoading(true);
    
    setTimeout(() => {
      try {
        // יצירת מסמך PDF
        const doc = new jsPDF();
        
        // כותרת המסמך
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text(reportTitle, 105, 15, { align: "center" });
        
        // תאריך יצירת הדוח
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const currentDate = new Date().toLocaleDateString('he-IL');
        doc.text(`תאריך: ${currentDate}`, 200, 22, { align: "right" });
        
        // תוכן הדוח בהתאם לסוג
        generateReportContent(doc, reportType);
        
        // שמירת הקובץ והורדה
        doc.save(`${reportTitle.replace(/\s+/g, '_')}.pdf`);
        
        setLoading(false);
        toast({
          title: "PDF נוצר בהצלחה",
          description: `הדוח "${reportTitle}" הורד למחשב שלך`,
        });
      } catch (error) {
        console.error("Error generating PDF:", error);
        setLoading(false);
        toast({
          title: "שגיאה ביצירת PDF",
          description: "אירעה שגיאה בעת יצירת הקובץ. נסה שנית.",
          variant: "destructive"
        });
      }
    }, 1500);
  };

  const generateReportContent = (doc: jsPDF, type: string) => {
    switch (type) {
      case "finance":
        // נתונים לדוגמה לדוח פיננסי
        const financialData = [
          ['ינואר', '₪10,500', '₪6,200', '₪4,300'],
          ['פברואר', '₪11,200', '₪6,800', '₪4,400'],
          ['מרץ', '₪12,800', '₪7,100', '₪5,700'],
          ['אפריל', '₪13,400', '₪7,300', '₪6,100'],
          ['מאי', '₪14,200', '₪7,400', '₪6,800'],
          ['יוני', '₪15,120', '₪7,600', '₪7,520'],
        ];
        
        doc.autoTable({
          head: [['חודש', 'הכנסות', 'הוצאות', 'רווח']],
          body: financialData,
          startY: 30,
          styles: { halign: 'center', font: 'helvetica' },
          headStyles: { fillColor: [96, 108, 56], textColor: 255 }
        });
        
        // הוספת סיכום
        const totalIncome = financialData.reduce((sum, row) => sum + parseInt(row[1].replace(/[^\d]/g, '')), 0);
        const totalExpenses = financialData.reduce((sum, row) => sum + parseInt(row[2].replace(/[^\d]/g, '')), 0);
        const totalProfit = financialData.reduce((sum, row) => sum + parseInt(row[3].replace(/[^\d]/g, '')), 0);
        
        const lastY = (doc as any).lastAutoTable.finalY;
        doc.text(`סך הכל הכנסות: ₪${totalIncome.toLocaleString()}`, 200, lastY + 15, { align: "right" });
        doc.text(`סך הכל הוצאות: ₪${totalExpenses.toLocaleString()}`, 200, lastY + 22, { align: "right" });
        doc.text(`סך הכל רווח: ₪${totalProfit.toLocaleString()}`, 200, lastY + 29, { align: "right" });
        break;
        
      case "customers":
        // נתונים לדוגמה לדוח לקוחות
        const customersData = [
          ['שרה כהן', '12', '₪1,440', '01/04/2025', 'מניקור ג\'ל'],
          ['אמילי לוי', '9', '₪1,620', '29/03/2025', 'אקריליק מלא'],
          ['ליאת ונג', '8', '₪1,120', '02/04/2025', 'פדיקור'],
          ['דנה ישראלי', '7', '₪980', '25/03/2025', 'מניקור'],
          ['רונית פרץ', '6', '₪840', '27/03/2025', 'עיצוב ציפורניים'],
        ];
        
        doc.autoTable({
          head: [['שם לקוח', 'מספר ביקורים', 'סך הוצאות', 'ביקור אחרון', 'טיפול מועדף']],
          body: customersData,
          startY: 30,
          styles: { halign: 'center', font: 'helvetica' },
          headStyles: { fillColor: [96, 108, 56], textColor: 255 }
        });
        break;
        
      case "inventory":
        // נתונים לדוגמה לדוח מלאי
        const inventoryData = [
          ['לק ג\'ל', '15', '32', '₪480', 'לא'],
          ['אצטון', '2', '5', '₪50', 'כן'],
          ['מסיר לק', '8', '10', '₪80', 'לא'],
          ['קיט אקריליק', '3', '5', '₪250', 'לא'],
          ['לק לבן', '1', '5', '₪35', 'כן'],
        ];
        
        doc.autoTable({
          head: [['מוצר', 'כמות במלאי', 'מלאי מינימלי', 'עלות יחידה', 'דרוש הזמנה']],
          body: inventoryData,
          startY: 30,
          styles: { halign: 'center', font: 'helvetica' },
          headStyles: { fillColor: [96, 108, 56], textColor: 255 }
        });
        break;
        
      case "appointments":
        // נתונים לדוגמה לדוח תורים
        const appointmentsData = [
          ['שרה כהן', 'מניקור ג\'ל', '10:00', '₪120', 'מאושר'],
          ['אמילי לוי', 'אקריליק מלא', '12:30', '₪180', 'מאושר'],
          ['ליאת ונג', 'פדיקור', '14:00', '₪140', 'מאושר'],
          ['מריה אברהם', 'עיצוב ציפורניים', '11:00', '₪120', 'הושלם'],
          ['ג\'ניפר מילר', 'מניקור', '15:30', '₪100', 'בוטל'],
        ];
        
        doc.autoTable({
          head: [['לקוח', 'שירות', 'שעה', 'מחיר', 'סטטוס']],
          body: appointmentsData,
          startY: 30,
          styles: { halign: 'center', font: 'helvetica' },
          headStyles: { fillColor: [96, 108, 56], textColor: 255 }
        });
        break;
        
      case "income":
        // נתונים לדוגמה לדוח הכנסות
        const incomeData = [
          ['01/06/2025', 'מניקור ג\'ל', 'שרה כהן', '₪120', 'מזומן'],
          ['01/06/2025', 'פדיקור', 'דנה לוי', '₪140', 'אשראי'],
          ['01/06/2025', 'אקריליק מלא', 'רונית כהן', '₪180', 'העברה בנקאית'],
          ['02/06/2025', 'עיצוב ציפורניים', 'מיטל אברהם', '₪120', 'אשראי'],
          ['02/06/2025', 'לק ג\'ל', 'אמילי לוי', '₪80', 'מזומן'],
        ];
        
        doc.autoTable({
          head: [['תאריך', 'שירות', 'לקוח', 'סכום', 'סוג תשלום']],
          body: incomeData,
          startY: 30,
          styles: { halign: 'center', font: 'helvetica' },
          headStyles: { fillColor: [96, 108, 56], textColor: 255 }
        });
        break;
        
      case "expenses":
        // נתונים לדוגמה לדוח הוצאות
        const expensesData = [
          ['01/06/2025', 'רכישת מלאי', 'ספק נייל פרו', '₪580', 'חודשי'],
          ['05/06/2025', 'שכירות', 'נכסי אלון', '₪3,500', 'חודשי'],
          ['10/06/2025', 'חשמל', 'חברת חשמל', '₪320', 'חודשי'],
          ['15/06/2025', 'שיווק', 'פרסום בפייסבוק', '₪250', 'חד פעמי'],
          ['20/06/2025', 'ציוד חדש', 'סופר נייל', '₪780', 'חד פעמי'],
        ];
        
        doc.autoTable({
          head: [['תאריך', 'קטגוריה', 'ספק', 'סכום', 'תדירות']],
          body: expensesData,
          startY: 30,
          styles: { halign: 'center', font: 'helvetica' },
          headStyles: { fillColor: [96, 108, 56], textColor: 255 }
        });
        break;
        
      default:
        // דוח כללי
        doc.text("אין נתונים זמינים לסוג דוח זה.", 105, 50, { align: "center" });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex gap-2 justify-end mb-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handlePrint}
        className="flex items-center gap-1.5"
      >
        <Printer className="h-4 w-4 ml-1" />
        הדפסה
      </Button>
      
      <Button 
        variant="default" 
        size="sm" 
        onClick={handleExportPDF}
        disabled={loading}
        className="flex items-center gap-1.5"
      >
        <Download className="h-4 w-4 ml-1" />
        {loading ? "מכין PDF..." : "הורדה כ-PDF"}
      </Button>
    </div>
  );
};

export default PDFExport;
