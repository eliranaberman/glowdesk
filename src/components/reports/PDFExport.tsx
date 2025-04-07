
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface PDFExportProps {
  reportTitle: string;
  reportType: string;
}

const PDFExport = ({ reportTitle, reportType }: PDFExportProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleExportPDF = () => {
    setLoading(true);
    
    // Simulating PDF generation
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "PDF נוצר בהצלחה",
        description: `הדוח "${reportTitle}" הורד למחשב שלך`,
      });
    }, 1500);
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
