
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const NewInventoryItem = () => {
  const navigate = useNavigate();
  const [itemData, setItemData] = useState({
    name: '',
    category: '',
    quantity: '',
    minQuantity: '',
    price: '',
    supplier: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setItemData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setItemData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, you would save the item data to your backend
    toast.success('פריט חדש נוסף למלאי');
    navigate('/inventory');
  };

  // Mock categories
  const categories = [
    { id: 'gel', name: 'לקים ג\'ל' },
    { id: 'acrylic', name: 'חומרי אקריליק' },
    { id: 'tools', name: 'כלי עבודה' },
    { id: 'polish', name: 'לקים רגילים' },
    { id: 'misc', name: 'שונות' }
  ];

  // Mock suppliers
  const suppliers = [
    { id: '1', name: 'ספק א\'' },
    { id: '2', name: 'ספק ב\'' },
    { id: '3', name: 'ספק ג\'' }
  ];

  return (
    <div dir="rtl" className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">הוספת פריט חדש למלאי</h1>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>פרטי פריט</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">שם הפריט</Label>
              <Input
                id="name"
                name="name"
                value={itemData.name}
                onChange={handleChange}
                placeholder="הכנס שם פריט"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">קטגוריה</Label>
              <Select 
                value={itemData.category} 
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="בחר קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">כמות במלאי</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={itemData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minQuantity">כמות מינימלית</Label>
                <Input
                  id="minQuantity"
                  name="minQuantity"
                  type="number"
                  value={itemData.minQuantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">מחיר (₪)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={itemData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">ספק</Label>
                <Select 
                  value={itemData.supplier} 
                  onValueChange={(value) => handleSelectChange('supplier', value)}
                >
                  <SelectTrigger id="supplier">
                    <SelectValue placeholder="בחר ספק" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">הערות</Label>
              <Input
                id="notes"
                name="notes"
                value={itemData.notes}
                onChange={handleChange}
                placeholder="הערות נוספות לגבי הפריט"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate('/inventory')}>
              ביטול
            </Button>
            <Button type="submit">הוסף פריט</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NewInventoryItem;
