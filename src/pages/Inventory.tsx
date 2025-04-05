
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, AlertTriangle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    price: ""
  });

  // Mock inventory data
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: "1",
      name: "לק ג'ל ורוד",
      category: "לק",
      quantity: 5,
      price: 65,
      status: "תקין",
    },
    {
      id: "2",
      name: "לק ג'ל אדום",
      category: "לק",
      quantity: 2,
      price: 65,
      status: "מלאי נמוך",
    },
    {
      id: "3",
      name: "לק ג'ל לבן",
      category: "לק",
      quantity: 1,
      price: 65,
      status: "מלאי נמוך",
    },
    {
      id: "4",
      name: "אצטון",
      category: "חומרים",
      quantity: 3,
      price: 30,
      status: "תקין",
    },
    {
      id: "5",
      name: "טיפים אקריליק",
      category: "אביזרים",
      quantity: 120,
      price: 45,
      status: "תקין",
    },
    {
      id: "6",
      name: "מברשת לציפורניים",
      category: "כלים",
      quantity: 8,
      price: 25,
      status: "תקין",
    },
    {
      id: "7",
      name: "לק ג'ל שחור",
      category: "לק",
      quantity: 0,
      price: 65,
      status: "אזל במלאי",
    },
  ]);

  // Filter items based on search query
  const filteredItems = inventoryItems.filter(
    (item) =>
      item.name.includes(searchQuery) || item.category.includes(searchQuery)
  );

  // Count low stock items
  const lowStockCount = inventoryItems.filter(
    (item) => item.status === "מלאי נמוך" || item.status === "אזל במלאי"
  ).length;

  const handleAddItem = () => {
    // Validate form
    if (!newItem.name || !newItem.category || !newItem.quantity) {
      toast({
        title: "שגיאה",
        description: "נא למלא את כל השדות הנדרשים",
        variant: "destructive"
      });
      return;
    }

    // Add new item to inventory
    const quantity = parseInt(newItem.quantity);
    const price = parseFloat(newItem.price);
    const status = quantity === 0 ? "אזל במלאי" : quantity <= 2 ? "מלאי נמוך" : "תקין";

    setInventoryItems([
      ...inventoryItems,
      {
        id: String(inventoryItems.length + 1),
        name: newItem.name,
        category: newItem.category,
        quantity,
        price,
        status,
      },
    ]);

    // Reset form and close dialog
    setNewItem({ name: "", category: "", quantity: "", price: "" });
    setIsAddItemDialogOpen(false);
    
    toast({
      title: "פריט נוסף בהצלחה",
      description: `${newItem.name} נוסף למלאי בהצלחה`
    });
  };

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold mb-4">ניהול מלאי</h1>
      <p className="text-muted-foreground mb-6">
        מעקב אחרי מלאי המוצרים שלך וניהול הזמנות חדשות.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">סך הכל פריטים</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{inventoryItems.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">קטגוריות</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {new Set(inventoryItems.map((item) => item.category)).size}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">פריטים במלאי נמוך</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <p className="text-2xl font-bold">{lowStockCount}</p>
              {lowStockCount > 0 && (
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">הזמנות בתהליך</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>רשימת מלאי</CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חיפוש מוצרים..."
                className="pr-8 w-full sm:w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsAddItemDialogOpen(true)}>
              <Plus className="h-4 w-4 ml-2" />
              הוסף פריט
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary text-secondary-foreground">
                  <tr>
                    <th className="text-right py-3 px-4 font-medium">שם המוצר</th>
                    <th className="text-right py-3 px-4 font-medium">קטגוריה</th>
                    <th className="text-right py-3 px-4 font-medium">כמות</th>
                    <th className="text-right py-3 px-4 font-medium">מחיר</th>
                    <th className="text-right py-3 px-4 font-medium">סטטוס</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b last:border-b-0 hover:bg-accent/50"
                    >
                      <td className="py-3 px-4">{item.name}</td>
                      <td className="py-3 px-4">{item.category}</td>
                      <td className="py-3 px-4">{item.quantity}</td>
                      <td className="py-3 px-4">₪{item.price}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            item.status === "תקין"
                              ? "outline"
                              : item.status === "מלאי נמוך"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>הוספת פריט חדש</DialogTitle>
            <DialogDescription>
              הוסף פריט חדש למלאי
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-name" className="text-right">
                שם פריט
              </Label>
              <Input
                id="item-name"
                placeholder="שם הפריט"
                className="col-span-3"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-category" className="text-right">
                קטגוריה
              </Label>
              <Input
                id="item-category"
                placeholder="קטגוריה"
                className="col-span-3"
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-quantity" className="text-right">
                כמות
              </Label>
              <Input
                id="item-quantity"
                type="number"
                placeholder="כמות"
                className="col-span-3"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-price" className="text-right">
                מחיר (₪)
              </Label>
              <Input
                id="item-price"
                type="number"
                placeholder="מחיר"
                className="col-span-3"
                value={newItem.price}
                onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>
              ביטול
            </Button>
            <Button onClick={handleAddItem}>הוסף פריט</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
