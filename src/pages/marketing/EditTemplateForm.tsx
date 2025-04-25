
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { getTemplateById, updateTemplate } from '@/services/marketing/templateService';
import { supabase } from '@/integrations/supabase/client';

const EditTemplateForm = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadTemplate = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const template = await getTemplateById(id);
        
        if (template) {
          setTitle(template.title);
          setContent(template.content);
        } else {
          toast({
            title: 'שגיאה',
            description: 'לא נמצאה תבנית עם מזהה זה',
            variant: 'destructive',
          });
          navigate('/marketing/templates');
        }
      } catch (error) {
        console.error('Error loading template:', error);
        toast({
          title: 'שגיאה בטעינת התבנית',
          description: 'אירעה שגיאה בטעינת התבנית, אנא נסה שנית',
          variant: 'destructive',
        });
        navigate('/marketing/templates');
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [id, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !title.trim() || !content.trim()) {
      toast({
        title: 'שגיאה',
        description: 'יש למלא את כל השדות הנדרשים',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await updateTemplate(id, {
        title,
        content
      });
      
      toast({
        title: 'התבנית עודכנה בהצלחה',
        description: `התבנית "${title}" עודכנה במערכת`,
      });
      
      navigate('/marketing/templates');
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: 'שגיאה בעדכון התבנית',
        description: 'אירעה שגיאה בעדכון התבנית, אנא נסה שנית',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="back" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => navigate('/marketing/templates')}
        >
          <ArrowLeft className="h-4 w-4" />
          חזרה לתבניות
        </Button>
        <h1 className="text-2xl font-bold">עריכת תבנית</h1>
        <div className="w-[100px]"></div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>פרטי התבנית</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                כותרת התבנית
              </label>
              <Input 
                id="title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                תוכן ההודעה
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                השתמשי במשתנים דינמיים כמו {"{שם}"} או {"{טיפול}"} שיוחלפו אוטומטית בערכים אמיתיים
              </p>
              <Textarea 
                id="content" 
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                variant="outline" 
                className="ml-2"
                onClick={() => navigate('/marketing/templates')}
                type="button"
              >
                ביטול
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                {isSubmitting ? 'שומר...' : (
                  <>
                    <Save className="h-4 w-4 ml-2" />
                    שמור שינויים
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditTemplateForm;
