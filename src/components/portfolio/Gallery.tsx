
import { useState, useEffect } from 'react';
import { PortfolioItem } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { PlusCircle, X, Camera, Image as ImageIcon, Search, Grid3X3, Grid, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PortfolioItemCard } from './PortfolioItemCard';
import { PortfolioItemForm } from './PortfolioItemForm';
import { ImageUploader } from './ImageUploader';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/use-permissions';
import { getPortfolioItems } from '@/services/portfolioService';

export const Gallery = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [gridSize, setGridSize] = useState<'small' | 'medium' | 'large'>('medium');
  const { user } = useAuth();
  const { isAdmin, isSocialManager } = usePermissions();
  
  // Allow all authenticated users to add items
  const canAddItems = !!user;
  // Only admins and social managers can manage (delete) items
  const canManageItems = user && (isAdmin || isSocialManager);

  const loadItems = async () => {
    setIsLoading(true);
    const data = await getPortfolioItems();
    setItems(data);
    setFilteredItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    const filtered = items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredItems(filtered);
  }, [searchQuery, items]);

  const handleItemDelete = () => {
    loadItems();
  };

  const handleFormSuccess = () => {
    setIsAddDialogOpen(false);
    loadItems();
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const getGridCols = () => {
    switch (gridSize) {
      case 'small': return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6';
      case 'medium': return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      case 'large': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      default: return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">הגלריה שלנו</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            אוסף העבודות הכי יפות שלנו - כל תמונה מספרת סיפור של יצירה, יופי וקרפט מקצועי
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-80">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="חפש בגלריה..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 border-gray-300 focus:border-gray-500 rounded-xl"
              />
            </div>

            {/* Grid Size Controls */}
            <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-gray-200">
              <Button
                variant={gridSize === 'large' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setGridSize('large')}
                className="p-2"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={gridSize === 'medium' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setGridSize('medium')}
                className="p-2"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={gridSize === 'small' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setGridSize('small')}
                className="p-2"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add Button - Show for all authenticated users */}
          {canAddItems ? (
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PlusCircle className="h-5 w-5 ml-2" />
              הוסף תמונה חדשה
            </Button>
          ) : (
            <div className="text-center text-gray-500 text-sm">
              יש להתחבר למערכת כדי להעלות תמונות
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className={`grid ${getGridCols()} gap-6`}>
            {[...Array(12)].map((_, index) => (
              <div 
                key={index} 
                className="rounded-2xl bg-gray-200 animate-pulse aspect-square shadow-md"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl p-12 shadow-xl max-w-md mx-auto">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'לא נמצאו תוצאות' : 'הגלריה עדיין ריקה'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? 'נסה לשנות את מילות החיפוש או לנקות את החיפוש'
                  : 'זה הזמן להתחיל ולהעלות את התמונות הראשונות שלך'
                }
              </p>
              {canAddItems && !searchQuery && (
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl px-6 py-3"
                >
                  <PlusCircle className="h-5 w-5 ml-2" />
                  הוסף תמונה ראשונה
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className={`grid ${getGridCols()} gap-6`}>
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-200 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  
                  <div className="absolute top-4 left-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 rounded-full p-2"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Management Controls - only for admins/social managers OR item owner */}
                {(canManageItems || item.created_by === user?.id) && (
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PortfolioItemCard 
                      item={item} 
                      onDelete={handleItemDelete}
                      showOnlyControls={true}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add new item dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center mb-2">
                הוספת תמונה חדשה לגלריה
              </DialogTitle>
            </DialogHeader>
            <PortfolioItemForm 
              onSuccess={handleFormSuccess}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Lightbox */}
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogContent className="max-w-7xl max-h-[90vh] p-0 bg-black/95">
            <div className="relative w-full h-full flex items-center justify-center">
              {filteredItems.length > 0 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full p-3"
                  >
                    ❮
                  </Button>
                  
                  <div className="max-w-full max-h-full p-8">
                    <img
                      src={filteredItems[selectedImageIndex]?.image_url}
                      alt={filteredItems[selectedImageIndex]?.title}
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full p-3"
                  >
                    ❯
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLightboxOpen(false)}
                    className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full p-2"
                  >
                    <X className="h-5 w-5" />
                  </Button>

                  {/* Image Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 text-white">
                    <h3 className="text-2xl font-bold mb-2">
                      {filteredItems[selectedImageIndex]?.title}
                    </h3>
                    {filteredItems[selectedImageIndex]?.description && (
                      <p className="text-lg text-gray-200">
                        {filteredItems[selectedImageIndex]?.description}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
