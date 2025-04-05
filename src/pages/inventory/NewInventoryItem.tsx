
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';

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
    toast.success('פריט נוסף בהצלחה למלאי');
    navigate('/inventory');
  };

  const categories = [
    { id: '1', name: 'לקים' },
    { id: '2', name: 'חומרי בנייה' },
    { id: '3', name: 'כלי עבודה' },
    { id: '4', name: 'מוצרי טיפוח' },
    { id: '5', name: 'אביזרים' }
  ];

  return (
    <div dir="rtl" className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowRight className="h-4 w-4 mr-1" />
          חזור
        </Button>
        <h1 className="text-2xl font-bold">הוספת פריט למלאי</h1>
      </div>
      
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

            <div className="space-y-2">
              <Label htmlFor="price">מחיר רכישה (₪)</Label>
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
              <Input
                id="supplier"
                name="supplier"
                value={itemData.supplier}
                onChange={handleChange}
                placeholder="שם הספק"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">הערות</Label>
              <Input
                id="notes"
                name="notes"
                value={itemData.notes}
                onChange={handleChange}
                placeholder="הערות נוספות"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate('/inventory')}>
              ביטול
            </Button>
            <Button type="submit">הוסף למלאי</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NewInventoryItem;
