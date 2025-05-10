import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Customer, getCustomerById, updateCustomer } from '@/services/customerService';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Calendar,
  Mail,
  Phone,
  Edit,
  Save,
  Tag,
  Clock,
  Award,
  ChevronLeft,
  Plus,
  X,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const CustomerDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  
  // State
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [newTag, setNewTag] = useState('');
  
  // Load customer data
  useEffect(() => {
    const loadCustomer = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getCustomerById(id);
        setCustomer(data);
        setNotes(data.notes || '');
      } catch (error) {
        console.error('Error loading customer:', error);
        toast({
          title: 'שגיאה בטעינת פרטי לקוח',
          description: 'אירעה שגיאה בטעינת פרטי הלקוח. אנא נסה שוב מאוחר יותר.',
          variant: 'destructive',
        });
        navigate('/customers');
      } finally {
        setLoading(false);
      }
    };
    
    loadCustomer();
  }, [id, navigate, toast]);
  
  // Save notes
  const saveNotes = async () => {
    if (!customer) return;
    
    try {
      await updateCustomer(customer.id, { notes });
      setCustomer({ ...customer, notes });
      setEditingNotes(false);
      
      toast({
        title: 'הערות נשמרו',
        description: 'הערות הלקוח עודכנו בהצלחה.',
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: 'שגיאה בשמירת הערות',
        description: 'אירעה שגיאה בשמירת ההערות. אנא נסה שוב מאוחר יותר.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle tags
  const addTag = async () => {
    if (!customer || !newTag.trim()) return;
    
    const updatedTags = [...(customer.tags || [])];
    
    // Check if tag already exists
    if (!updatedTags.includes(newTag.trim())) {
      updatedTags.push(newTag.trim());
      
      try {
        await updateCustomer(customer.id, { tags: updatedTags });
        setCustomer({ ...customer, tags: updatedTags });
        setNewTag('');
        setShowTagDialog(false);
        
        toast({
          title: 'תגית נוספה',
          description: 'התגית נוספה בהצלחה.',
        });
      } catch (error) {
        console.error('Error adding tag:', error);
        toast({
          title: 'שגיאה בהוספת תגית',
          description: 'אירעה שגיאה בהוספת התגית. אנא נסה שוב מאוחר יותר.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'תגית קיימת',
        description: 'תגית זו כבר קיימת עבור לקוח זה.',
        variant: 'destructive',
      });
    }
  };
  
  const removeTag = async (tagToRemove: string) => {
    if (!customer) return;
    
    const updatedTags = customer.tags.filter(tag => tag !== tagToRemove);
    
    try {
      await updateCustomer(customer.id, { tags: updatedTags });
      setCustomer({ ...customer, tags: updatedTags });
      
      toast({
        title: 'תגית הוסרה',
        description: 'התגית הוסרה בהצלחה.',
      });
    } catch (error) {
      console.error('Error removing tag:', error);
      toast({
        title: 'שגיאה בהסרת תגית',
        description: 'אירעה שגיאה בהסרת התגית. אנא נסה שוב מאוחר יותר.',
        variant: 'destructive',
      });
    }
  };
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'לא זמין';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  // Get loyalty level text
  const getLoyaltyText = (level: string) => {
    switch (level) {
      case 'gold': return 'זהב';
      case 'silver': return 'כסף';
      case 'bronze': return 'ברונזה';
      default: return level;
    }
  };
  
  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'פעיל';
      case 'inactive': return 'לא פעיל';
      case 'lead': return 'לקוח פוטנציאלי';
      default: return status;
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-5 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-2">לקוח לא נמצא</h2>
        <p className="text-muted-foreground mb-4">הלקוח המבוקש אינו קיים או שאין לך הרשאות לצפות בו.</p>
        <Button onClick={() => navigate('/customers')}>חזרה לרשימת הלקוחות</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{customer.full_name}</h2>
        {isAdmin && (
          <Button onClick={() => navigate(`/customers/edit/${customer.id}`)}>
            <Edit className="h-4 w-4 ml-2" />
            עריכת לקוח
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>פרטי קשר</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Mail className="h-4 w-4 ml-2 text-muted-foreground" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 ml-2 text-muted-foreground" />
              <span>{customer.phone_number}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 ml-2 text-muted-foreground" />
              <span>תאריך הצטרפות: {formatDate(customer.registration_date)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 ml-2 text-muted-foreground" />
              <span>תור אחרון: {formatDate(customer.last_appointment)}</span>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 ml-2 text-muted-foreground" />
                  <span>תגיות</span>
                </div>
                {isAdmin && (
                  <Button variant="ghost" size="sm" onClick={() => setShowTagDialog(true)}>
                    <Plus className="h-3 w-3 ml-1" />
                    הוספה
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {customer.tags && customer.tags.length > 0 ? (
                  customer.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {tag}
                      {isAdmin && (
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      )}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">אין תגיות</span>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Award className="h-4 w-4 ml-2 text-muted-foreground" />
                <span>רמת נאמנות: {getLoyaltyText(customer.loyalty_level)}</span>
              </div>
              <Badge 
                variant={
                  customer.loyalty_level === 'gold' 
                    ? 'default' 
                    : customer.loyalty_level === 'silver' 
                      ? 'secondary' 
                      : 'outline'
                }
                className={
                  customer.loyalty_level === 'gold' 
                    ? 'bg-amber-500' 
                    : customer.loyalty_level === 'silver' 
                      ? 'bg-gray-300 text-primary' 
                      : 'border-amber-900/20 text-amber-900/70'
                }
              >
                {getLoyaltyText(customer.loyalty_level)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>סטטוס:</span>
              <Badge variant={
                customer.status === 'active' 
                  ? 'default' 
                  : customer.status === 'lead'
                    ? 'warm'
                    : 'secondary'
              }>
                {getStatusText(customer.status)}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Notes Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>הערות פנימיות</CardTitle>
              {isAdmin && !editingNotes && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setEditingNotes(true)}
                >
                  <Edit className="h-4 w-4 ml-1" />
                  עריכה
                </Button>
              )}
              {isAdmin && editingNotes && (
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={saveNotes}
                >
                  <Save className="h-4 w-4 ml-1" />
                  שמירה
                </Button>
              )}
            </div>
            <CardDescription>
              הערות פנימיות עבור צוות המערכת בלבד
            </CardDescription>
          </CardHeader>
          <CardContent>
            {editingNotes ? (
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[200px]"
                placeholder="הוסף הערות פנימיות כאן..."
              />
            ) : (
              <div className="prose prose-sm max-w-none">
                {customer.notes ? (
                  <div className="whitespace-pre-wrap">{customer.notes}</div>
                ) : (
                  <p className="text-muted-foreground">אין הערות עדיין...</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Appointments Card - placeholder for now */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>היסטוריית פגישות</CardTitle>
            <CardDescription>
              הפגישות האחרונות של הלקוח
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center">
              <p className="text-muted-foreground">פונקציונליות זו תהיה זמינה בקרוב</p>
              <Button 
                className="mt-4" 
                variant="outline"
                onClick={() => navigate('/scheduling/new', { state: { customerId: customer.id } })}
              >
                קביעת פגישה חדשה
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tag Dialog */}
      <Dialog open={showTagDialog} onOpenChange={setShowTagDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>הוספת תגית חדשה</DialogTitle>
            <DialogDescription>
              הוסף תגית חדשה ללקוח זה.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <div className="grid flex-1 gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="הזן שם תגית..."
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button type="button" onClick={addTag}>
              הוסף תגית
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowTagDialog(false)}
            >
              ביטול
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDetailView;
