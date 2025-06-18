import { useState, useEffect } from 'react';
import { Plus, Package, AlertTriangle, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  getInventoryItems,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getLowStockItems,
  calculateInventoryStatus,
  type InventoryItem 
} from '@/services/inventoryService';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const Inventory = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [inventoryStatus, setInventoryStatus] = useState({
    totalItems: 0,
    lowStockCount: 0,
    totalValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    cost: 0,
    status: 'תקין',
    entry_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      const [itemsData, lowStockData, statusData] = await Promise.all([
        getInventoryItems(),
        getLowStockItems(),
        calculateInventoryStatus()
      ]);
      
      setItems(itemsData);
      setLowStockItems(lowStockData);
      setInventoryStatus(statusData);
    } catch (error: any) {
      console.error('Error loading inventory:', error);
      toast({
        variant: "destructive",
        title: "שגיאה בטעינת המלאי",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      await addInventoryItem(formData);
      toast({
        title: "פריט נוסף בהצלחה",
        description: `${formData.name} נוסף למלאי`
      });
      setIsDialogOpen(false);
      setFormData({
        name: '',
        category: '',
        quantity: 0,
        cost: 0,
        status: 'תקין',
        entry_date: new Date().toISOString().split('T')[0],
      });
      loadInventoryData();
    } catch (error: any) {
      console.error('Error adding item:', error);
      toast({
        variant: "destructive",
        title: "שגיאה בהוספת פריט",
        description: error.message
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ניהול מלאי</h1>
          <p className="text-muted-foreground">ניהול מלאי ומוצרים</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              הוסף פריט
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>הוסף פריט חדש למלאי</DialogTitle>
              <DialogDescription>הזן את פרטי הפריט החדש</DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">שם הפריט</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="שם הפריט"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">קטגוריה</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר קטגוריה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ציפורניים">ציפורניים</SelectItem>
                    <SelectItem value="איפור">איפור</SelectItem>
                    <SelectItem value="טיפוח">טיפוח</SelectItem>
                    <SelectItem value="כלים">כלים</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="quantity">כמות</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="cost">עלות</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleAddItem}>הוסף פריט</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה"כ פריטים</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStatus.totalItems}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">פריטים במלאי נמוך</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{inventoryStatus.lowStockCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ערך כולל</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪{inventoryStatus.totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>פריטי מלאי</CardTitle>
          <CardDescription>רשימת כל הפריטים במלאי</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם הפריט</TableHead>
                  <TableHead>קטגוריה</TableHead>
                  <TableHead>כמות</TableHead>
                  <TableHead>עלות</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>תאריך הכנסה</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <Badge variant={item.quantity <= 5 ? "destructive" : "default"}>
                        {item.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell>₪{item.cost}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(item.entry_date).toLocaleDateString('he-IL')}</TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      אין פריטים במלאי
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
