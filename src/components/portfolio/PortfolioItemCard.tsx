
import { useState } from 'react';
import { PortfolioItem } from '@/types/portfolio';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { deletePortfolioItem } from '@/services/portfolioService';
import { usePermissions } from '@/hooks/use-permissions';

interface PortfolioItemCardProps {
  item: PortfolioItem;
  onDelete: () => void;
}

export const PortfolioItemCard = ({ item, onDelete }: PortfolioItemCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const { isAdmin, isSocialManager } = usePermissions();
  
  // Check if current user can delete this item
  const canDelete = user && (isAdmin || isSocialManager) && user.id === item.created_by;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the modal
    
    if (confirm('האם אתה בטוח שברצונך למחוק פריט זה?')) {
      setIsDeleting(true);
      await deletePortfolioItem(item.id);
      setIsDeleting(false);
      onDelete();
    }
  };

  return (
    <>
      <div 
        className="group relative overflow-hidden rounded-lg cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        {/* Blurred placeholder */}
        <div 
          className={`absolute inset-0 bg-gray-200 ${imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          style={{ 
            backgroundImage: `url(${item.image_url})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px)',
            transform: 'scale(1.1)'
          }}
        />
        
        {/* Actual image (lazy loaded) */}
        <img 
          src={item.image_url} 
          alt={item.title}
          loading="lazy"
          className={`w-full h-full object-cover aspect-square ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay with title */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
          <h3 className="font-medium text-lg">{item.title}</h3>
          {item.description && (
            <p className="text-sm text-white/80 line-clamp-2">{item.description}</p>
          )}
        </div>
        
        {/* Delete button (only for admins/social managers who created the item) */}
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-200"
            aria-label="מחק פריט"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Image preview modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl w-[90vw] p-0 overflow-hidden">
          <div className="relative">
            <img 
              src={item.image_url} 
              alt={item.title}
              className="w-full h-auto"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
              <h3 className="font-medium text-xl">{item.title}</h3>
              {item.description && (
                <p className="text-white/90 mt-1">{item.description}</p>
              )}
            </div>
            
            {canDelete && (
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                variant="destructive"
                size="sm"
                className="absolute bottom-4 right-4"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                מחק
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
