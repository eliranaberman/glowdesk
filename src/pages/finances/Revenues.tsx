
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PlusCircle, Download, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { Revenue, getRevenues, addRevenue, updateRevenue, deleteRevenue } from '@/services/revenueService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import PermissionGuard from '@/components/auth/PermissionGuard';

const Revenues = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRevenue, setSelectedRevenue] = useState<Revenue | null>(null);
  
  // New revenue form state
  const [newRevenue, setNewRevenue] = useState({
    amount: '',
    source: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    payment_method: ''
  });
  
  useEffect(() => {
    const loadRevenues = async () => {
      setLoading(true);
      const data = await getRevenues();
      setRevenues(data);
      setLoading(false);
    };
    
    loadRevenues();
  }, []);
  
  const handleAddRevenue = async () => {
    if (!newRevenue.amount || !newRevenue.source) {
      toast({
        title: "שגיאה בהוספת הכנסה",
        description: "נא למלא את כל השדות הנדרשים",
        variant: "destructive",
      });
      return;
    }
    
    const revenue = {
      amount: parseFloat(newRevenue.amount),
      source: newRevenue.source,
      description: newRevenue.description,
      date: newRevenue.date,
      created_by: user?.id || '',
      payment_method: newRevenue.payment_method
    };
    
    const result = await addRevenue(revenue);
    if (result) {
      setRevenues(prev => [result, ...prev]);
      setNewRevenue({
        amount: '',
        source: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        payment_method: ''
      });
      setIsAddDialogOpen(false);
    }
  };
  
  const handleEditRevenue = async () => {
    if (!selectedRevenue) return;
    
    const result = await updateRevenue(selectedRevenue.id, selectedRevenue);
    if (result) {
      setRevenues(prev => prev.map(rev => rev.id === result.id ? result : rev));
      setIsEditDialogOpen(false);
      setSelectedRevenue(null);
    }
  };
  
  const handleDeleteRevenue = async (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק הכנסה זו?')) {
      const success = await deleteRevenue(id);
      if (success) {
        setRevenues(prev => prev.filter(rev => rev.id !== id));
      }
    }
  };
  
  const filteredRevenues = revenues.filter(rev => {
    const matchesSearch = searchTerm ? 
      (rev.description && rev.description.toLowerCase().includes(searchTerm.toLowerCase())) || 
      rev.source.toLowerCase().includes(searchTerm.toLowerCase()) : 
      true;
    
    const matchesFilter = filterSource ? rev.source === filterSource : true;
    
    return matchesSearch && matchesFilter;
  });
  
  const allSources = [...new Set(revenues.map(rev => rev.source))];
  
  return (
    <PermissionGuard requiredResource="finances" requiredPermission="read" redirectTo="/dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">ניהול הכנסות</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            הוסף הכנסה
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-right">הכנסות העסק</CardTitle>
            <CardDescription className="text-right">רשימת כל ההכנסות שנרשמו במערכת</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-6">
              <div className="flex gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="חפש הכנסה..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterSource} onValueChange={setFilterSource}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="סנן לפי מקור" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">כל המקורות</SelectItem>
                    {allSources.map(source => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                יצא לקובץ
              </Button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
              </div>
            ) : filteredRevenues.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">לא נמצאו הכנסות</p>
              </div>
            ) : (
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="text-xs uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">תאריך</th>
                      <th scope="col" className="px-6 py-3">מקור</th>
                      <th scope="col" className="px-6 py-3">תיאור</th>
                      <th scope="col" className="px-6 py-3">סכום</th>
                      <th scope="col" className="px-6 py-3">אמצעי תשלום</th>
                      <th scope="col" className="px-6 py-3">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRevenues.map(revenue => (
                      <tr key={revenue.id} className="bg-white border-b">
                        <td className="px-6 py-4">{format(new Date(revenue.date), 'dd/MM/yyyy')}</td>
                        <td className="px-6 py-4">{revenue.source}</td>
                        <td className="px-6 py-4">{revenue.description || '-'}</td>
                        <td className="px-6 py-4 font-medium">₪{revenue.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">{revenue.payment_method || '-'}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setSelectedRevenue(revenue);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteRevenue(revenue.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">סה"כ {filteredRevenues.length} הכנסות</p>
            <p className="text-sm font-bold">
              סה"כ: ₪{filteredRevenues.reduce((sum, revenue) => sum + revenue.amount, 0).toLocaleString()}
            </p>
          </CardFooter>
        </Card>
        
        {/* Add Revenue Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-right">הוספת הכנסה חדשה</DialogTitle>
              <DialogDescription className="text-right">
                הכנס את פרטי ההכנסה החדשה
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right col-span-4" htmlFor="amount">סכום</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="הכנס סכום"
                  className="col-span-4"
                  value={newRevenue.amount}
                  onChange={(e) => setNewRevenue({...newRevenue, amount: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right col-span-4" htmlFor="source">מקור</Label>
                <Input
                  id="source"
                  placeholder="מקור ההכנסה"
                  className="col-span-4"
                  value={newRevenue.source}
                  onChange={(e) => setNewRevenue({...newRevenue, source: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right col-span-4" htmlFor="description">תיאור (אופציונלי)</Label>
                <Input
                  id="description"
                  placeholder="תיאור ההכנסה"
                  className="col-span-4"
                  value={newRevenue.description}
                  onChange={(e) => setNewRevenue({...newRevenue, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right col-span-4" htmlFor="date">תאריך</Label>
                <Input
                  id="date"
                  type="date"
                  className="col-span-4"
                  value={newRevenue.date}
                  onChange={(e) => setNewRevenue({...newRevenue, date: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right col-span-4" htmlFor="payment_method">אמצעי תשלום (אופציונלי)</Label>
                <Input
                  id="payment_method"
                  placeholder="אמצעי תשלום"
                  className="col-span-4"
                  value={newRevenue.payment_method}
                  onChange={(e) => setNewRevenue({...newRevenue, payment_method: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>ביטול</Button>
              <Button onClick={handleAddRevenue}>הוסף הכנסה</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Revenue Dialog */}
        {selectedRevenue && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-right">עריכת הכנסה</DialogTitle>
                <DialogDescription className="text-right">
                  ערוך את פרטי ההכנסה
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right col-span-4" htmlFor="edit-amount">סכום</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    className="col-span-4"
                    value={selectedRevenue.amount}
                    onChange={(e) => setSelectedRevenue({...selectedRevenue, amount: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right col-span-4" htmlFor="edit-source">מקור</Label>
                  <Input
                    id="edit-source"
                    className="col-span-4"
                    value={selectedRevenue.source}
                    onChange={(e) => setSelectedRevenue({...selectedRevenue, source: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right col-span-4" htmlFor="edit-description">תיאור</Label>
                  <Input
                    id="edit-description"
                    className="col-span-4"
                    value={selectedRevenue.description || ''}
                    onChange={(e) => setSelectedRevenue({...selectedRevenue, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right col-span-4" htmlFor="edit-date">תאריך</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    className="col-span-4"
                    value={format(new Date(selectedRevenue.date), 'yyyy-MM-dd')}
                    onChange={(e) => setSelectedRevenue({...selectedRevenue, date: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right col-span-4" htmlFor="edit-payment-method">אמצעי תשלום</Label>
                  <Input
                    id="edit-payment-method"
                    className="col-span-4"
                    value={selectedRevenue.payment_method || ''}
                    onChange={(e) => setSelectedRevenue({...selectedRevenue, payment_method: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>ביטול</Button>
                <Button onClick={handleEditRevenue}>שמור שינויים</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PermissionGuard>
  );
};

export default Revenues;
