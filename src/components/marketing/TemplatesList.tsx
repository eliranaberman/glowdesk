
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Loader2, Search, Pencil, Trash, Copy, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getTemplates, deleteTemplate } from '@/services/marketingService';
import { MarketingTemplate } from '@/types/marketing';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { format } from 'date-fns';

export const TemplatesList = () => {
  const [templates, setTemplates] = useState<MarketingTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<MarketingTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<MarketingTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleEdit = (id: string) => {
    navigate(`/marketing/templates/edit/${id}`);
  };

  const handleCopy = (template: MarketingTemplate) => {
    const newTitle = `העתק של ${template.title}`;
    navigate('/marketing/templates/new', { 
      state: { 
        title: newTitle, 
        content: template.content 
      } 
    });
    
    toast({
      title: 'תבנית הועתקה',
      description: 'כעת אתה יכול לערוך את העותק החדש',
    });
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את התבנית "${title}"?`)) {
      try {
        await deleteTemplate(id);
        setTemplates(templates.filter(template => template.id !== id));
        setFilteredTemplates(filteredTemplates.filter(template => template.id !== id));
        
        toast({
          title: 'התבנית נמחקה',
          description: 'התבנית נמחקה בהצלחה',
        });
      } catch (error) {
        console.error('Error deleting template:', error);
        toast({
          title: 'שגיאה במחיקת התבנית',
          description: 'אירעה שגיאה במחיקת התבנית, אנא נסה שנית',
          variant: 'destructive',
        });
      }
    }
  };

  const handleCreateCampaign = (template: MarketingTemplate) => {
    navigate('/marketing/campaigns/new', { 
      state: { templateId: template.id } 
    });
  };

  const openPreview = (template: MarketingTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="חיפוש תבניות..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-4 pl-10 w-full"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
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
                onClick={() => navigate('/marketing/templates/new')}
              >
                יצירת תבנית חדשה
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">שם התבנית</TableHead>
                  <TableHead className="hidden md:table-cell">תוכן</TableHead>
                  <TableHead className="hidden md:table-cell w-[150px]">תאריך עדכון</TableHead>
                  <TableHead className="w-[180px]">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow 
                    key={template.id}
                    onClick={() => openPreview(template)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">{template.title}</TableCell>
                    <TableCell className="hidden md:table-cell truncate max-w-[300px]">
                      {template.content}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(template.updated_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 rtl:space-x-reverse" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(template.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleCopy(template)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleCreateCampaign(template)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          onClick={() => handleDelete(template.id, template.title)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-right">{selectedTemplate?.title}</DialogTitle>
          </DialogHeader>
          <div className="bg-accent/10 p-4 rounded-lg mt-4 text-right whitespace-pre-wrap">
            {selectedTemplate?.content}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(false)}
            >
              סגור
            </Button>
            <Button
              onClick={() => {
                if (selectedTemplate) {
                  handleEdit(selectedTemplate.id);
                }
              }}
            >
              <Pencil className="h-4 w-4 ml-2" />
              ערוך תבנית
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
