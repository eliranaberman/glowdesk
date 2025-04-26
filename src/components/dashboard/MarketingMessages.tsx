import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, MessageSquare, Send, PlusCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getTemplates } from '@/services/marketing/templateService';
import { getCampaigns, sendCampaign } from '@/services/marketing/campaignService';
import { MarketingTemplate, MarketingCampaign } from '@/types/marketing';
import { format } from 'date-fns';
const MarketingMessages = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [templates, setTemplates] = useState<MarketingTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState<Record<string, boolean>>({});
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        if (activeTab === 'templates') {
          const templateData = await getTemplates();
          setTemplates(templateData.slice(0, 4)); // Limit to 4 for dashboard
        } else if (activeTab === 'campaigns') {
          const campaignData = await getCampaigns();
          setCampaigns(campaignData.slice(0, 3)); // Limit to 3 for dashboard
        }
      } catch (error) {
        console.error(`Error loading ${activeTab}:`, error);
        toast({
          title: `שגיאה בטעינת ${activeTab === 'templates' ? 'תבניות' : 'קמפיינים'}`,
          description: 'אירעה שגיאה בטעינת הנתונים, אנא נסה שנית'
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [activeTab, toast]);
  const handleSendTemplate = (templateId: string) => {
    navigate('/marketing/campaigns/new', {
      state: {
        templateId
      }
    });
  };
  const handleCreate = () => {
    navigate('/marketing/templates/new');
  };
  const handleSendCampaign = async (campaign: MarketingCampaign) => {
    if (campaign.status === 'sent') {
      toast({
        title: "הקמפיין כבר נשלח",
        description: "לא ניתן לשלוח קמפיין שכבר נשלח"
      });
      return;
    }
    if (window.confirm(`האם אתה בטוח שברצונך לשלוח את הקמפיין "${campaign.name}" עכשיו?`)) {
      try {
        setIsSending(prev => ({
          ...prev,
          [campaign.id]: true
        }));
        await sendCampaign(campaign.id);

        // Update the campaign status in the UI
        setCampaigns(campaigns.map(c => c.id === campaign.id ? {
          ...c,
          status: 'sent' as const
        } : c));
        toast({
          title: "הקמפיין נשלח בהצלחה",
          description: "ההודעות נשלחות ללקוחות הנבחרים"
        });
      } catch (error) {
        console.error('Error sending campaign:', error);
        toast({
          title: "שגיאה בשליחת הקמפיין",
          description: "אירעה שגיאה בשליחת הקמפיין, אנא נסה שנית",
          variant: "destructive"
        });
      } finally {
        setIsSending(prev => ({
          ...prev,
          [campaign.id]: false
        }));
      }
    }
  };
  const formatDate = (dateString: string | undefined) => {
    try {
      if (!dateString) return 'תאריך לא זמין';
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return 'תאריך לא תקין';
    }
  };
  return <Card className="shadow-soft hover:shadow-soft-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <MessageSquare className="h-5 w-5 ml-2 text-primary" />
              הודעות שיווקיות
            </CardTitle>
          </div>
          <Link to="/marketing">
            <Button variant="ghost" size="sm" className="gap-1">
              לדשבורד שיווק
              <ArrowRight className="h-4 w-4 mr-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="campaigns" className="text-right">קמפיינים קודמים</TabsTrigger>
            <TabsTrigger value="templates" className="text-right">תבניות מוכנות</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            {isLoading ? <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div> : templates.length === 0 ? <div className="text-center py-8 text-muted-foreground">
                <p>אין תבניות עדיין</p>
                <Button onClick={() => navigate('/marketing/templates/new')} variant="outline" className="mt-4">
                  יצירת תבנית חדשה
                </Button>
              </div> : <div className="grid gap-3">
                {templates.slice(0, 4).map(template => <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/10 transition-colors">
                    <div className="flex items-center">
                      <Button variant="soft" size="sm" className="flex items-center gap-1 mr-2" onClick={() => handleSendTemplate(template.id)}>
                        <Send className="h-3.5 w-3.5" />
                        שלח
                      </Button>
                      <Mail className="h-4 w-4 text-muted-foreground ml-2" />
                      <span className="px-[203px]">{template.title}</span>
                    </div>
                  </div>)}
              </div>}

            <div className="flex justify-end pt-2">
              <Button onClick={() => navigate('/marketing/campaigns/new')} className="w-full">
                יצירת קמפיין חדש
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            {isLoading ? <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div> : campaigns.length === 0 ? <div className="text-center py-8 text-muted-foreground">
                <p>אין קמפיינים עדיין</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/marketing/campaigns/new')}>
                  יצירת קמפיין חדש
                </Button>
              </div> : <div className="space-y-3">
                {campaigns.slice(0, 3).map(campaign => <div key={campaign.id} className="p-3 border rounded-lg hover:bg-accent/10 transition-colors flex items-center justify-between">
                    <div>
                      <Button variant="soft" size="sm" className="flex items-center gap-1 ml-2" onClick={() => handleSendCampaign(campaign)} disabled={isSending[campaign.id]}>
                        <Send className="h-3.5 w-3.5" />
                        שלח
                      </Button>
                    </div>
                    <div className="flex-grow text-right">
                      <div className="flex justify-between mb-1">
                        <h3 className="font-medium">{campaign.name}</h3>
                        <span className="text-xs text-muted-foreground">
                          {campaign.scheduled_at ? formatDate(campaign.scheduled_at) : 'לא נקבע תאריך'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>סטטוס: {campaign.status === 'draft' ? 'טיוטה' : campaign.status === 'sent' ? 'נשלח' : campaign.status}</span>
                        <span>הודעות: {campaign.messages_count || 0}</span>
                      </div>
                    </div>
                  </div>)}
              </div>}

            <Button variant="outline" className="w-full flex items-center gap-2 mt-2" onClick={() => navigate('/marketing')}>
              <Mail className="h-4 w-4" />
              לכל הקמפיינים
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>;
};
export default MarketingMessages;