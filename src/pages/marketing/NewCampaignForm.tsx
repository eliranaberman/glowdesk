
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calendar, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTemplates } from '@/services/marketing/templateService';
import { createCampaign } from '@/services/marketing/campaignService';
import { MarketingTemplate } from '@/types/marketing';
import { supabase } from '@/integrations/supabase/client';

const NewCampaignForm = () => {
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [templates, setTemplates] = useState<MarketingTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we're coming from another page with template data
    if (location.state?.templateId) {
      setTemplateId(location.state.templateId);
    }
    
    const loadTemplates = async () => {
      try {
        setIsLoading(true);
        const data = await getTemplates();
        setTemplates(data);
      } catch (error) {
        console.error('Error loading templates:', error);
        toast({
          title: 'שגיאה בטעינת התבניות',
          description: 'אירעה שגיאה בטעינת התבניות, אנא נסה שנית',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [location.state, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !templateId) {
      toast({
        title: 'שגיאה',
        description: 'יש למלא את כל השדות הנדרשים',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      if (!userId) {
        toast({
          title: 'שגיאה',
          description: 'המשתמש אינו מחובר',
          variant: 'destructive',
        });
        return;
      }
      
      await createCampaign({
        name,
        template_id: templateId,
        created_by: userId,
        status: 'draft',
        scheduled_at: null
      });
      
      toast({
        title: 'הקמפיין נוצר בהצלחה',
        description: `הקמפיין "${name}" נשמר במערכת`,
      });
      
      navigate('/marketing');
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: 'שגיאה ביצירת הקמפיין',
        description: 'אירעה שגיאה ביצירת הקמפיין, אנא נסה שנית',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="back" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => navigate('/marketing')}
        >
          <ArrowLeft className="h-4 w-4" />
          חזרה לקמפיינים
        </Button>
        <h1 className="text-2xl font-bold">יצירת קמפיין חדש</h1>
        <div className="w-[100px]"></div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>פרטי הקמפיין</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  שם הקמפיין
                </label>
                <Input 
                  id="name" 
                  placeholder="לדוגמה: קידום תסרוקות קיץ, הנחות לחברים" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="template" className="block text-sm font-medium mb-1">
                  בחירת תבנית להודעה
                </label>
                {templates.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground border rounded-md">
                    <p>אין תבניות זמינות</p>
                    <Button 
                      variant="link" 
                      onClick={() => navigate('/marketing/templates/new')}
                      className="mt-2"
                    >
                      צור תבנית חדשה
                    </Button>
                  </div>
                ) : (
                  <Select value={templateId} onValueChange={setTemplateId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר תבנית" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              {templateId && (
                <div className="border rounded-lg p-4 bg-accent/10">
                  <h3 className="font-medium mb-2">תצוגה מקדימה של התבנית</h3>
                  <div className="whitespace-pre-wrap text-sm">
                    {templates.find(t => t.id === templateId)?.content || ''}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline" 
                  className="ml-2"
                  onClick={() => navigate('/marketing')}
                  type="button"
                >
                  ביטול
                </Button>
                <Button type="submit" disabled={isSubmitting || templates.length === 0} className="flex items-center gap-2">
                  {isSubmitting ? 'שומר...' : (
                    <>
                      <Send className="h-4 w-4 ml-2" />
                      צור קמפיין
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewCampaignForm;
