
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { getClient, createClientActivity } from '@/services/clientService';
import { Client } from '@/types/clients';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

const NewActivityPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'call',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !user?.id) return;
    
    try {
      setSubmitting(true);
      
      // Format the date with time
      const now = new Date();
      const dateStr = formData.date;
      const fullDate = `${dateStr}T${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      await createClientActivity({
        client_id: id,
        type: formData.type as any,
        description: formData.description,
        date: fullDate,
        created_by: user.id,
      });
      
      toast({
        title: "פעילות נוספה בהצלחה",
        description: "פעילות הלקוח נרשמה במערכת"
      });
      
      navigate(`/clients/${id}`);
    } catch (error: any) {
      console.error('Error creating activity:', error);
      toast({
        variant: "destructive",
        title: "שגיאה בהוספת פעילות",
        description: error.message || "אירעה שגיאה בעת הוספת פעילות"
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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>שגיאה בטעינת פרטי הלקוח</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <Button 
          onClick={() => navigate('/clients')} 
          variant="back" 
          className="flex gap-2"
        >
          <ChevronRight className="h-4 w-4" />
          חזרה לרשימת הלקוחות
        </Button>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>לקוח לא נמצא</AlertTitle>
          <AlertDescription>
            לא נמצאו פרטי הלקוח המבוקש.
          </AlertDescription>
        </Alert>
        <Button 
          onClick={() => navigate('/clients')} 
          variant="back" 
          className="flex gap-2"
        >
          <ChevronRight className="h-4 w-4" />
          חזרה לרשימת הלקוחות
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>הוספת פעילות ל{client.full_name} | Chen Mizrahi</title>
      </Helmet>

      <Button 
        onClick={() => navigate(`/clients/${id}`)} 
        variant="back" 
        className="mb-4 flex gap-2"
      >
        <ChevronRight className="h-4 w-4" />
        חזרה לפרטי הלקוח
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">הוספת פעילות חדשה</h1>
        <p className="text-muted-foreground">
          הוסף פעילות חדשה עבור {client.full_name}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>פרטי הפעילות</CardTitle>
            <CardDescription>הזן את פרטי הפעילות</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">סוג פעילות *</Label>
              <Select
                name="type"
                value={formData.type}
                onValueChange={value => handleSelectChange('type', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג פעילות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="call">שיחת טלפון</SelectItem>
                    <SelectItem value="message">הודעה</SelectItem>
                    <SelectItem value="purchase">רכישה</SelectItem>
                    <SelectItem value="visit">ביקור</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">תאריך *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                dir="ltr"
                required
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">תיאור הפעילות *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="תאר את הפעילות..."
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-end w-full">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'שומר...' : 'הוסף פעילות'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default NewActivityPage;
