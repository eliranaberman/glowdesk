
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { createTemplate } from '@/services/marketing/templateService';
import { supabase } from '@/integrations/supabase/client';

const NewTemplateForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
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
      
      await createTemplate({
        title,
        content,
        created_by: userId
      });
      
      toast({
        title: 'התבנית נוצרה בהצלחה',
        description: `התבנית "${title}" נשמרה במערכת`,
      });
      
      navigate('/marketing/templates');
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: 'שגיאה ביצירת התבנית',
        description: 'אירעה שגיאה ביצירת התבנית, אנא נסה שנית',
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
          onClick={() => navigate('/marketing/templates')}
        >
          <ArrowLeft className="h-4 w-4" />
          חזרה לתבניות
        </Button>
        <h1 className="text-2xl font-bold">יצירת תבנית חדשה</h1>
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
                placeholder="לדוגמה: תזכורת לתור, הצעה מיוחדת" 
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
                placeholder="תוכן ההודעה..."
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
                    שמור תבנית
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

export default NewTemplateForm;
