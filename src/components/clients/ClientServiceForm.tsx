
import { useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { createClientService } from '@/services/clientService';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClientServiceFormProps {
  clientId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ClientServiceForm = ({ clientId, isOpen, onClose, onSuccess }: ClientServiceFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [serviceDate, setServiceDate] = useState<Date>(new Date());
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const resetForm = () => {
    setServiceDate(new Date());
    setDescription('');
    setPrice('');
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast({
        title: 'שגיאה',
        description: 'נא להזין תיאור שירות',
        variant: 'destructive',
      });
      return;
    }

    if (!price || Number(price) <= 0) {
      toast({
        title: 'שגיאה',
        description: 'נא להזין מחיר תקין',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      await createClientService({
        client_id: clientId,
        service_date: format(serviceDate, 'yyyy-MM-dd'),
        description,
        price: Number(price),
      });

      toast({
        title: 'השירות נוסף בהצלחה ✅',
        description: 'פרטי השירות נשמרו בהצלחה',
      });

      resetForm();
      onClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error adding service:', error);
      toast({
        title: 'אירעה שגיאה, נסה שוב ❌',
        description: error.message || 'לא ניתן להוסיף את השירות כרגע',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent dir="rtl" className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">הוספת שירות חדש</DialogTitle>
          <DialogDescription>
            הוסף פרטי שירות עבור הלקוח
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service-date">תאריך השירות</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between text-right font-normal",
                    !serviceDate && "text-muted-foreground"
                  )}
                >
                  {serviceDate ? format(serviceDate, 'dd/MM/yyyy') : "בחר תאריך"}
                  <CalendarIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={serviceDate}
                  onSelect={(date) => {
                    if (date) {
                      setServiceDate(date);
                      setIsCalendarOpen(false);
                    }
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">תיאור השירות</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="הכנס תיאור מפורט של השירות"
              className="min-h-[80px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">מחיר השירות</Label>
            <div className="relative">
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="הכנס מחיר"
                className="pl-10"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₪</span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                בטל
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  שומר...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  שמור שירות
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientServiceForm;
