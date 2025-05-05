
import { useState, useEffect } from 'react';
import { PortfolioItem } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PortfolioItemCard } from './PortfolioItemCard';
import { PortfolioItemForm } from './PortfolioItemForm';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/use-permissions';
import { getPortfolioItems } from '@/services/portfolioService';

export const Gallery = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { user } = useAuth();
  const { isAdmin, isSocialManager } = usePermissions();
  
  // Check if current user can add new items
  const canAddItems = user && (isAdmin || isSocialManager);

  const loadItems = async () => {
    setIsLoading(true);
    const data = await getPortfolioItems();
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleItemDelete = () => {
    loadItems();
  };

  const handleFormSuccess = () => {
    setIsAddDialogOpen(false);
    loadItems();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">גלריה</h2>
        
        {canAddItems && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            הוסף פריט
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, index) => (
            <div 
              key={index} 
              className="rounded-lg bg-gray-200 animate-pulse aspect-square"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">אין פריטים בגלריה עדיין</p>
          {canAddItems && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              הוסף פריט ראשון
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((item) => (
            <PortfolioItemCard 
              key={item.id} 
              item={item} 
              onDelete={handleItemDelete}
            />
          ))}
        </div>
      )}
      
      {/* Add new item dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">הוספת פריט חדש לגלריה</DialogTitle>
          </DialogHeader>
          <PortfolioItemForm 
            onSuccess={handleFormSuccess}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
