import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getClient, createClientActivity } from '@/services/clientService';

const NewActivityPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<import('@/types/clients').Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const clientData = await getClient(id);
        setClient(clientData);
        setError(null);
      } catch (err: any) {
        console.error('Error loading client:', err.message);
        setError(err.message);
        toast({
          variant: "destructive",
          title: "שגיאה בטעינת פרטי לקוח",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id, toast]);

  const handleCreateActivity = async (activityData: {
    type: import('@/types/clients').ActivityType;
    description: string;
    date?: string;
  }) => {
    if (!id) return;
    
    try {
      setSubmitting(true);
      
      const activity = await createClientActivity({
        client_id: id,
        type: activityData.type,
        description: activityData.description,
        date: activityData.date || new Date().toISOString(),
        created_by: '', // This will be set by the service
      });
      
      toast({
        title: "פעילות נוצרה בהצלחה",
        description: `פעילות עבור ${client?.full_name} נוספה בהצלחה`
      });
      
      navigate(`/clients/${id}`);
    } catch (error: any) {
      console.error('Error creating activity:', error);
      toast({
        variant: "destructive",
        title: "שגיאה ביצירת פעילות",
        description: error.message || "אירעה שגיאה בעת יצירת הפעילות"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          <p className="text-muted-foreground">טוען פרטי לקוח...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-red-500">Error: {error}</p>
        <Button onClick={() => navigate(`/clients/${id}`)}>חזרה לפרטי לקוח</Button>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="space-y-4">
        <p className="text-red-500">Client not found</p>
        <Button onClick={() => navigate('/clients')}>חזרה לרשימת לקוחות</Button>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>יצירת פעילות חדשה עבור {client.full_name} | Chen Mizrahi</title>
      </Helmet>

      <Button onClick={() => navigate(`/clients/${id}`)} variant="back" className="mb-4">
        חזרה לפרטי לקוח
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">יצירת פעילות חדשה</h1>
        <p className="text-muted-foreground">
          יצירת פעילות חדשה עבור הלקוח {client.full_name}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>פרטי פעילות</CardTitle>
          <CardDescription>הזן את פרטי הפעילות החדשה</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityForm
            onSubmit={handleCreateActivity}
            isSubmitting={submitting}
          />
        </CardContent>
      </Card>
    </div>
  );
};

interface ActivityFormProps {
  onSubmit: (data: {
    type: import('@/types/clients').ActivityType;
    description: string;
    date?: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

const ActivityForm = ({ onSubmit, isSubmitting }: ActivityFormProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [type, setType] = useState<import('@/types/clients').ActivityType>('call');
  const [description, setDescription] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit({
      type: type,
      description: description,
      date: date?.toISOString(),
    });
  };

  return (
    <Form>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="type">סוג פעילות</Label>
            <Select onValueChange={(value) => setType(value as import('@/types/clients').ActivityType)}>
              <SelectTrigger>
                <SelectValue placeholder="בחר סוג פעילות" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call">שיחת טלפון</SelectItem>
                <SelectItem value="message">הודעה</SelectItem>
                <SelectItem value="purchase">רכישה</SelectItem>
                <SelectItem value="visit">ביקור</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">תיאור</Label>
            <Textarea
              id="description"
              placeholder="תיאור הפעילות"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>תאריך</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={
                    "w-[240px] pl-3 text-left font-normal" +
                    (date ? " text-foreground" : " text-muted-foreground")
                  }
                >
                  {date ? (
                    format(date, "PPP")
                  ) : (
                    <span>בחר תאריך</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "יוצר..." : "צור פעילות"}
        </Button>
      </form>
    </Form>
  );
};

export default NewActivityPage;
