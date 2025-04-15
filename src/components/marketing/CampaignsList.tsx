
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Loader2, Search, Eye, Trash, Send, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getCampaigns, deleteCampaign, sendCampaign } from '@/services/marketingService';
import { MarketingCampaign } from '@/types/marketing';
import { format } from 'date-fns';

export const CampaignsList = () => {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<MarketingCampaign[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setIsLoading(true);
        const data = await getCampaigns();
        setCampaigns(data);
        setFilteredCampaigns(data);
      } catch (error) {
        console.error('Error loading campaigns:', error);
        toast({
          title: 'שגיאה בטעינת הקמפיינים',
          description: 'אירעה שגיאה בטעינת הנתונים, אנא נסה שנית',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, [toast]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCampaigns(campaigns);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = campaigns.filter(
        campaign => 
          campaign.name.toLowerCase().includes(query) || 
          campaign.template?.title.toLowerCase().includes(query)
      );
      setFilteredCampaigns(filtered);
    }
  }, [searchQuery, campaigns]);

  const handleView = (id: string) => {
    navigate(`/marketing/campaigns/${id}`);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את הקמפיין "${name}"?`)) {
      try {
        await deleteCampaign(id);
        setCampaigns(campaigns.filter(campaign => campaign.id !== id));
        setFilteredCampaigns(filteredCampaigns.filter(campaign => campaign.id !== id));
        
        toast({
          title: 'הקמפיין נמחק',
          description: 'הקמפיין נמחק בהצלחה',
        });
      } catch (error) {
        console.error('Error deleting campaign:', error);
        toast({
          title: 'שגיאה במחיקת הקמפיין',
          description: 'אירעה שגיאה במחיקת הקמפיין, אנא נסה שנית',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSendCampaign = async (campaign: MarketingCampaign) => {
    if (campaign.status === 'sent') {
      toast({
        title: 'הקמפיין כבר נשלח',
        description: 'לא ניתן לשלוח קמפיין שכבר נשלח',
      });
      return;
    }

    if (window.confirm(`האם אתה בטוח שברצונך לשלוח את הקמפיין "${campaign.name}" עכשיו?`)) {
      try {
        setIsProcessing(prev => ({ ...prev, [campaign.id]: true }));
        await sendCampaign(campaign.id);
        
        // Update the campaign status in the UI
        const updatedCampaigns = campaigns.map(c => 
          c.id === campaign.id ? { ...c, status: 'sent' as const } : c
        );
        setCampaigns(updatedCampaigns);
        setFilteredCampaigns(
          filteredCampaigns.map(c => 
            c.id === campaign.id ? { ...c, status: 'sent' as const } : c
          )
        );
        
        toast({
          title: 'הקמפיין נשלח בהצלחה',
          description: 'ההודעות נשלחות ללקוחות הנבחרים',
        });
      } catch (error) {
        console.error('Error sending campaign:', error);
        toast({
          title: 'שגיאה בשליחת הקמפיין',
          description: 'אירעה שגיאה בשליחת הקמפיין, אנא נסה שנית',
          variant: 'destructive',
        });
      } finally {
        setIsProcessing(prev => ({ ...prev, [campaign.id]: false }));
      }
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'לא נקבע';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">טיוטה</Badge>;
      case 'scheduled':
        return <Badge variant="secondary">מתוזמן</Badge>;
      case 'sent':
        return <Badge variant="success">נשלח</Badge>;
      case 'failed':
        return <Badge variant="destructive">נכשל</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="חיפוש קמפיינים..."
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
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>לא נמצאו קמפיינים</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/marketing/campaigns/new')}
              >
                יצירת קמפיין חדש
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">שם הקמפיין</TableHead>
                  <TableHead className="hidden md:table-cell">תבנית</TableHead>
                  <TableHead className="hidden md:table-cell">מצב</TableHead>
                  <TableHead className="hidden md:table-cell">לקוחות</TableHead>
                  <TableHead className="hidden md:table-cell">זמן שליחה</TableHead>
                  <TableHead className="w-[150px]">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow 
                    key={campaign.id}
                    onClick={() => handleView(campaign.id)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {campaign.template?.title || campaign.template_id}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getStatusBadge(campaign.status)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {campaign.messages_count || 0}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {campaign.status === 'scheduled' ? (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 ml-1 text-muted-foreground" />
                          {formatDate(campaign.scheduled_at)}
                        </div>
                      ) : campaign.status === 'sent' ? (
                        'נשלח'
                      ) : (
                        'לא נקבע'
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 rtl:space-x-reverse" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleView(campaign.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {campaign.status !== 'sent' && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            disabled={isProcessing[campaign.id]}
                            onClick={() => handleSendCampaign(campaign)}
                          >
                            {isProcessing[campaign.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          onClick={() => handleDelete(campaign.id, campaign.name)}
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
    </div>
  );
};
