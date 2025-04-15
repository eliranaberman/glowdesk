
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Loader2, Search, Eye, Trash, Tag, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getCoupons, deleteCoupon } from '@/services/marketingService';
import { Coupon } from '@/types/marketing';
import { format } from 'date-fns';

export const CouponsList = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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
          (coupon.description && coupon.description.toLowerCase().includes(query))
      );
      setFilteredCoupons(filtered);
    }
  }, [searchQuery, coupons]);

  const handleView = (id: string) => {
    navigate(`/marketing/coupons/${id}`);
  };

  const handleAssign = (id: string) => {
    navigate(`/marketing/coupons/${id}/assign`);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את הקופון "${title}"?`)) {
      try {
        await deleteCoupon(id);
        setCoupons(coupons.filter(coupon => coupon.id !== id));
        setFilteredCoupons(filteredCoupons.filter(coupon => coupon.id !== id));
        
        toast({
          title: 'הקופון נמחק',
          description: 'הקופון נמחק בהצלחה',
        });
      } catch (error) {
        console.error('Error deleting coupon:', error);
        toast({
          title: 'שגיאה במחיקת הקופון',
          description: 'אירעה שגיאה במחיקת הקופון, אנא נסה שנית',
          variant: 'destructive',
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
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
                  <TableHead className="hidden md:table-cell">קוד</TableHead>
                  <TableHead className="hidden md:table-cell">הנחה</TableHead>
                  <TableHead className="hidden md:table-cell">תוקף</TableHead>
                  <TableHead className="hidden md:table-cell">שימושים</TableHead>
                  <TableHead className="w-[150px]">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.map((coupon) => (
                  <TableRow 
                    key={coupon.id}
                    onClick={() => handleView(coupon.id)}
                    className={`cursor-pointer ${isExpired(coupon.valid_until) ? 'opacity-60' : ''}`}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {coupon.title}
                        {isExpired(coupon.valid_until) && (
                          <Badge variant="destructive" className="mr-2">פג תוקף</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <code className="bg-muted px-1 py-0.5 rounded">{coupon.code}</code>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {coupon.discount_percentage}%
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      עד {formatDate(coupon.valid_until)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-muted-foreground">{coupon.redeemed_count || 0}</span>
                      <span className="text-muted-foreground mx-1">/</span>
                      <span>{coupon.assigned_count || 0}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 rtl:space-x-reverse" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleView(coupon.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleAssign(coupon.id)}
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
    </div>
  );
};
