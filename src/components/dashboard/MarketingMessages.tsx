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
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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
            <CardTitle className="text-base md:text-lg flex items-center">
              <MessageSquare className="h-4 w-4 md:h-5 md:w-5 ml-2 text-primary" />
              הודעות שיווקיות
            </CardTitle>
          </div>
          <Link to="/marketing">
            <Button variant="ghost" size="sm" className="text-xs md:text-sm gap-1">
              לדשבורד שיווק
              <ArrowRight className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="campaigns" className="text-right text-xs md:text-sm">קמפיינים קודמים</TabsTrigger>
            <TabsTrigger value="templates" className="text-right text-xs md:text-sm">תבניות מוכנות</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            {isLoading ? <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div> : templates.length === 0 ? <div className="text-center py-8 text-muted-foreground text-xs">
                <p>אין תבניות עדיין</p>
                <Button onClick={() => navigate('/marketing/templates/new')} variant="outline" className="mt-4 text-xs">
                  יצירת תבנית חדשה
                </Button>
              </div> : <div className="grid gap-2">
                {templates.slice(0, 4).map(template => <div key={template.id} className="flex items-center justify-between p-2 border rounded-lg hover:bg-accent/10 transition-colors">
                    <div className="flex items-center flex-grow overflow-hidden">
                      <Button variant="soft" size="sm" className="flex items-center gap-1 mr-1 text-xs" onClick={() => handleSendTemplate(template.id)}>
                        <Send className="h-3 w-3" />
                        שלח
                      </Button>
                      <Mail className="h-3 w-3 text-muted-foreground ml-1" />
                      <span className="truncate text-xs">{template.title}</span>
                    </div>
                  </div>)}
              </div>}

            <div className="flex justify-end pt-2">
              <Button onClick={() => navigate('/marketing/campaigns/new')} className="w-full text-xs">
                יצירת קמפיין חדש
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            {isLoading ? <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div> : campaigns.length === 0 ? <div className="text-center py-8 text-muted-foreground text-xs">
                <p>אין קמפיינים עדיין</p>
                <Button variant="outline" className="mt-4 text-xs" onClick={() => navigate('/marketing/campaigns/new')}>
                  יצירת קמפיין חדש
                </Button>
              </div> : <div className="space-y-2">
                {campaigns.slice(0, 3).map(campaign => <div key={campaign.id} className="p-2 border rounded-lg hover:bg-accent/10 transition-colors">
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between items-center">
                        <Button variant="soft" size="sm" className="flex items-center gap-1 text-xs" onClick={() => handleSendCampaign(campaign)} disabled={isSending[campaign.id] || campaign.status === 'sent'}>
                          <Send className="h-3 w-3" />
                          שלח
                        </Button>
                        <h3 className="font-medium text-xs truncate">{campaign.name}</h3>
                      </div>
                      
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>סטטוס: {campaign.status === 'draft' ? 'טיוטה' : campaign.status === 'sent' ? 'נשלח' : campaign.status}</span>
                        <span>
                          {campaign.scheduled_at ? formatDate(campaign.scheduled_at) : 'לא נקבע תאריך'}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground text-right">
                        הודעות: {campaign.messages_count || 0}
                      </div>
                    </div>
                  </div>)}
              </div>}

            <Button variant="outline" className="w-full flex items-center gap-2 mt-2 text-xs" onClick={() => navigate('/marketing')}>
              <Mail className="h-3 w-3" />
              לכל הקמפיינים
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>;
};

export default MarketingMessages;
