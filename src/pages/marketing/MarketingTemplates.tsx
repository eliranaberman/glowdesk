
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Send, Edit, Trash, Copy, MessageSquare, ArrowLeft, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from '@/services/marketingService';
import { MarketingTemplate } from '@/types/marketing';
import { format } from 'date-fns';

const MarketingTemplates = () => {
  const [activeTab, setActiveTab] = useState('existing');
  const [templates, setTemplates] = useState<MarketingTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<MarketingTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [newTemplate, setNewTemplate] = useState({ title: '', content: '' });
  const [editingTemplate, setEditingTemplate] = useState<MarketingTemplate | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're coming from another page with template data
  useEffect(() => {
    if (location.state?.title && location.state?.content) {
      setNewTemplate({
        title: location.state.title,
        content: location.state.content
      });
      setActiveTab('create');
    }
  }, [location.state]);

  // Load templates on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setIsLoading(true);
        const data = await getTemplates();
        setTemplates(data);
        setFilteredTemplates(data);
      } catch (error) {
        console.error('Error loading templates:', error);
        toast({
          title: 'שגיאה בטעינת התבניות',
          description: 'אירעה שגיאה בטעינת הנתונים, אנא נסה שנית',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [toast]);

  // Filter templates when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTemplates(templates);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = templates.filter(
        template => 
          template.title.toLowerCase().includes(query) || 
          template.content.toLowerCase().includes(query)
      );
      setFilteredTemplates(filtered);
    }
  }, [searchQuery, templates]);

  const handleCreateTemplate = async () => {
    if (newTemplate.title.trim() === '' || newTemplate.content.trim() === '') {
      toast({
        title: "שגיאה",
        description: "נא למלא את כל השדות",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const created = await createTemplate({
        title: newTemplate.title,
        content: newTemplate.content,
        created_by: 'current-user-id' // This would be replaced with the actual user ID from auth
      });
      
      setTemplates([created, ...templates]);
      setFilteredTemplates([created, ...filteredTemplates]);
      
      toast({
        title: "התבנית נוצרה בהצלחה",
        description: `התבנית "${newTemplate.title}" נשמרה במערכת`,
      });
      
      setNewTemplate({ title: '', content: '' });
      setActiveTab('existing');
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "שגיאה ביצירת התבנית",
        description: "אירעה שגיאה ביצירת התבנית, אנא נסה שנית",
        variant: "destructive",
      });
    }
  };

  const handleEditTemplate = async () => {
    if (!editingTemplate) return;
    
    try {
      const updated = await updateTemplate(editingTemplate.id, {
        title: editingTemplate.title,
        content: editingTemplate.content
      });
      
      setTemplates(templates.map(t => t.id === updated.id ? updated : t));
      setFilteredTemplates(filteredTemplates.map(t => t.id === updated.id ? updated : t));
      
      toast({
        title: "התבנית עודכנה",
        description: `התבנית "${updated.title}" עודכנה בהצלחה`,
      });
      
      setEditingTemplate(null);
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "שגיאה בעדכון התבנית",
        description: "אירעה שגיאה בעדכון התבנית, אנא נסה שנית",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTemplate = async (id: string, title: string) => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את התבנית "${title}"?`)) {
      try {
        await deleteTemplate(id);
        setTemplates(templates.filter(t => t.id !== id));
        setFilteredTemplates(filteredTemplates.filter(t => t.id !== id));
        
        toast({
          title: "התבנית נמחקה",
          description: `התבנית "${title}" הוסרה מהמערכת`,
        });
      } catch (error) {
        console.error('Error deleting template:', error);
        toast({
          title: "שגיאה במחיקת התבנית",
          description: "אירעה שגיאה במחיקת התבנית, אנא נסה שנית",
          variant: "destructive",
        });
      }
    }
  };

  const handleStartEdit = (template: MarketingTemplate) => {
    setEditingTemplate(template);
    setActiveTab('edit');
  };

  const handleCopyTemplate = (template: MarketingTemplate) => {
    setNewTemplate({
      title: `העתק של ${template.title}`,
      content: template.content
    });
    setActiveTab('create');
    
    toast({
      title: "תבנית הועתקה",
      description: "כעת אתה יכול לערוך את העותק החדש",
    });
  };

  const handleCreateCampaign = (template: MarketingTemplate) => {
    navigate('/marketing/campaigns/new', { 
      state: { templateId: template.id } 
    });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
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
          חזרה לדשבורד שיווק
        </Button>
        <h1 className="text-2xl font-bold">תבניות הודעות</h1>
        <div className="w-[100px]"></div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 ml-2" />
            תבניות הודעות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              {editingTemplate && <TabsTrigger value="edit" className="text-right">עריכת תבנית</TabsTrigger>}
              {!editingTemplate && <TabsTrigger value="create" className="text-right">יצירת תבנית חדשה</TabsTrigger>}
              <TabsTrigger value="existing" className="text-right">תבניות קיימות</TabsTrigger>
            </TabsList>
            
            <TabsContent value="existing" className="space-y-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="חיפוש תבניות..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-4 pl-10 w-full"
                />
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>לא נמצאו תבניות</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab('create')}
                  >
                    יצירת תבנית חדשה
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTemplates.map((template) => (
                    <div key={template.id} className="border rounded-xl p-4 bg-card hover:bg-accent/10">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium flex items-center">
                          {template.title}
                          <span className="text-xs text-muted-foreground mr-2">
                            (עודכן: {formatDate(template.updated_at)})
                          </span>
                        </h3>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleCopyTemplate(template)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleStartEdit(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            onClick={() => handleDeleteTemplate(template.id, template.title)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm my-3 border-y py-3 whitespace-pre-wrap">{template.content}</p>
                      <div className="flex justify-end">
                        <Button 
                          variant="soft" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => handleCreateCampaign(template)}
                        >
                          <Send className="h-3.5 w-3.5 ml-1.5" />
                          יצירת קמפיין
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="create" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="template-name" className="block text-sm font-medium mb-1">
                    שם התבנית
                  </label>
                  <Input 
                    id="template-name" 
                    placeholder="לדוגמה: תזכורת לתור, הצעה מיוחדת" 
                    value={newTemplate.title}
                    onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="template-content" className="block text-sm font-medium mb-1">
                    תוכן ההודעה
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    השתמשי במשתנים דינמיים כמו {"{שם}"} או {"{טיפול}"} שיוחלפו אוטומטית בערכים אמיתיים
                  </p>
                  <Textarea 
                    id="template-content" 
                    placeholder="תוכן ההודעה..."
                    rows={6}
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button 
                    variant="outline" 
                    className="ml-2"
                    onClick={() => {
                      setNewTemplate({ title: '', content: '' });
                      setActiveTab('existing');
                    }}
                  >
                    ביטול
                  </Button>
                  <Button onClick={handleCreateTemplate}>
                    <PlusCircle className="h-4 w-4 ml-2" />
                    צור תבנית חדשה
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {editingTemplate && (
              <TabsContent value="edit" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="edit-template-name" className="block text-sm font-medium mb-1">
                      שם התבנית
                    </label>
                    <Input 
                      id="edit-template-name" 
                      value={editingTemplate.title}
                      onChange={(e) => setEditingTemplate({...editingTemplate, title: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-template-content" className="block text-sm font-medium mb-1">
                      תוכן ההודעה
                    </label>
                    <p className="text-xs text-muted-foreground mb-2">
                      השתמשי במשתנים דינמיים כמו {"{שם}"} או {"{טיפול}"} שיוחלפו אוטומטית בערכים אמיתיים
                    </p>
                    <Textarea 
                      id="edit-template-content" 
                      rows={6}
                      value={editingTemplate.content}
                      onChange={(e) => setEditingTemplate({...editingTemplate, content: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => {
                        setEditingTemplate(null);
                        setActiveTab('existing');
                      }}
                    >
                      ביטול
                    </Button>
                    <Button onClick={handleEditTemplate}>
                      שמור שינויים
                    </Button>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingTemplates;
