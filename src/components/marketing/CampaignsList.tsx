
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Loader2, Search, Pencil, Trash, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getCampaigns, deleteCampaign, sendCampaign } from '@/services/marketingService';
import { MarketingCampaign } from '@/types/marketing';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export const CampaignsList = () => {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<MarketingCampaign[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sendingMap, setSendingMap] = useState<Record<string, boolean>>({});
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
          (campaign.template?.title || '').toLowerCase().includes(query)
      );
      setFilteredCampaigns(filtered);
    }
  }, [searchQuery, campaigns]);

  const handleEdit = (id: string) => {
    navigate(`/marketing/campaigns/edit/${id}`);
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

  const handleSendCampaign = async (campaignId: string, campaignName: string) => {
    if (window.confirm(`האם אתה בטוח שברצונך לשלוח את הקמפיין "${campaignName}" כעת?`)) {
      try {
        setSendingMap(prev => ({ ...prev, [campaignId]: true }));
        await sendCampaign(campaignId);
        
        setCampaigns(campaigns.map(campaign => 
          campaign.id === campaignId ? { ...campaign, status: 'sent' as const } : campaign
        ));
        setFilteredCampaigns(filteredCampaigns.map(campaign => 
          campaign.id === campaignId ? { ...campaign, status: 'sent' as const } : campaign
        ));
        
        toast({
          title: 'הקמפיין נשלח',
          description: 'הקמפיין נשלח בהצלחה',
        });
      } catch (error) {
        console.error('Error sending campaign:', error);
        toast({
          title: 'שגיאה בשליחת הקמפיין',
          description: 'אירעה שגיאה בשליחת הקמפיין, אנא נסה שנית',
          variant: 'destructive',
        });
      } finally {
        setSendingMap(prev => ({ ...prev, [campaignId]: false }));
      }
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'לא נקבע';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch {
      return 'תאריך שגוי';
    }
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="outline">טיוטה</Badge>;
    
    switch (status) {
      case 'draft':
        return <Badge variant="outline">טיוטה</Badge>;
      case 'scheduled':
        return <Badge variant="secondary">מתוזמן</Badge>;
      case 'sent':
        return <Badge variant="default">נשלח</Badge>;
      case 'failed':
        return <Badge variant="destructive">נכשל</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
                  <TableHead className="hidden md:table-cell">תאריך משלוח</TableHead>
                  <TableHead className="w-[100px]">סטטוס</TableHead>
                  <TableHead className="w-[180px]">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {campaign.template?.title || 'תבנית לא נמצאה'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(campaign.scheduled_at)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(campaign.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(campaign.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {campaign.status !== 'sent' && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleSendCampaign(campaign.id, campaign.name)}
                            disabled={sendingMap[campaign.id]}
                          >
                            {sendingMap[campaign.id] ? (
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
