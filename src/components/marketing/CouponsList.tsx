
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Loader2, Search, Pencil, Trash, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getCoupons, assignCouponToClients } from '@/services/marketingService';
import { Coupon } from '@/types/marketing';
import { format } from 'date-fns';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';

export const CouponsList = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        setIsLoading(true);
        const data = await getCoupons();
        setCoupons(data);
        setFilteredCoupons(data);
      } catch (error) {
        console.error('Error loading coupons:', error);
        toast({
          title: 'שגיאה בטעינת הקופונים',
          description: 'אירעה שגיאה בטעינת הנתונים, אנא נסה שנית',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCoupons();
  }, [toast]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCoupons(coupons);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = coupons.filter(
        coupon => 
          coupon.title.toLowerCase().includes(query) || 
          coupon.code.toLowerCase().includes(query) ||
          (coupon.description || '').toLowerCase().includes(query)
      );
      setFilteredCoupons(filtered);
    }
  }, [searchQuery, coupons]);

  const handleEdit = (id: string) => {
    navigate(`/marketing/coupons/edit/${id}`);
  };

  const handleDelete = async (id: string, title: string) => {
    // In a real app, we'd implement the delete functionality
    toast({
      title: "מחיקת קופונים",
      description: "פונקציונליות המחיקה עדיין לא זמינה",
    });
  };

  const handleOpenAssignDialog = (couponId: string) => {
    setSelectedCouponId(couponId);
    setIsAssignDialogOpen(true);
  };

  const handleAssignToClients = async () => {
    // In a real app, we'd implement the assign coupon to clients functionality
    if (selectedCouponId) {
      try {
        // Mock client IDs - in a real app, we'd select these from a list
        const mockClientIds = ["client-id-1", "client-id-2"];
        await assignCouponToClients(selectedCouponId, mockClientIds);
        
        toast({
          title: "קופון שויך בהצלחה",
          description: `הקופון שויך ל-${mockClientIds.length} לקוחות`,
        });
        
        setIsAssignDialogOpen(false);
      } catch (error) {
        console.error('Error assigning coupon:', error);
        toast({
          title: 'שגיאה בשיוך הקופון',
          description: 'אירעה שגיאה בשיוך הקופון ללקוחות, אנא נסה שנית',
          variant: 'destructive',
        });
      }
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'לא הוגדר';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch {
      return 'תאריך שגוי';
    }
  };

  const isExpired = (validUntil: string | null) => {
    if (!validUntil) return false;
    try {
      return new Date(validUntil) < new Date();
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="חיפוש קופונים..."
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
          ) : filteredCoupons.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>לא נמצאו קופונים</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/marketing/coupons/new')}
              >
                יצירת קופון חדש
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">שם הקופון</TableHead>
                  <TableHead>קוד קופון</TableHead>
                  <TableHead className="hidden md:table-cell">אחוז הנחה</TableHead>
                  <TableHead className="hidden md:table-cell">תוקף עד</TableHead>
                  <TableHead className="w-[180px]">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.map((coupon) => (
                  <TableRow 
                    key={coupon.id}
                    className={isExpired(coupon.valid_until) ? "text-muted-foreground" : ""}
                  >
                    <TableCell className="font-medium">{coupon.title}</TableCell>
                    <TableCell>
                      <code className="px-2 py-1 bg-muted rounded">{coupon.code}</code>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {coupon.discount_percentage}%
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(coupon.valid_until)}
                      {isExpired(coupon.valid_until) && 
                        <span className="text-destructive ml-2">(פג תוקף)</span>
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(coupon.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenAssignDialog(coupon.id)}
                          disabled={isExpired(coupon.valid_until)}
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          onClick={() => handleDelete(coupon.id, coupon.title)}
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

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-right">שיוך קופון ללקוחות</DialogTitle>
            <DialogDescription className="text-right">
              בחר את הלקוחות שברצונך לשייך להם את הקופון
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              כאן תופיע רשימת לקוחות לבחירה
            </p>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsAssignDialogOpen(false)}
            >
              ביטול
            </Button>
            <Button onClick={handleAssignToClients}>
              שייך קופון
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
