
import { useState } from 'react';
import { PortfolioItem } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, MoreVertical } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { deletePortfolioItem } from '@/services/portfolioService';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/use-permissions';
import { useAuth } from '@/contexts/AuthContext';

interface PortfolioItemCardProps {
  item: PortfolioItem;
  onDelete: () => void;
  showOnlyControls?: boolean;
}

export const PortfolioItemCard = ({ item, onDelete, showOnlyControls = false }: PortfolioItemCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { isAdmin, isSocialManager } = usePermissions();
  const { user } = useAuth();
  
  // Allow deletion if user is admin/social manager OR if user is the item creator
  const canDelete = isAdmin || isSocialManager || item.created_by === user?.id;

  const handleDelete = async () => {
    if (!canDelete) {
      toast({
        title: "אין הרשאות",
        description: "אין לך הרשאה למחוק פריט זה מהגלריה",
        variant: "destructive"
      });
      return;
    }

    setIsDeleting(true);
    const success = await deletePortfolioItem(item.id);
    
    if (success) {
      onDelete();
    }
    
    setIsDeleting(false);
  };

  if (showOnlyControls && canDelete) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 rounded-full p-2"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-700">
                <Trash2 className="h-4 w-4 ml-2" />
                מחק פריט
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
                <AlertDialogDescription>
                  פעולה זו תמחק את הפריט "{item.title}" לצמיתות מהגלריה. לא ניתן לבטל פעולה זו.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>ביטול</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? 'מוחק...' : 'מחק פריט'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (showOnlyControls) {
    return null; // Don't show controls if user doesn't have permissions
  }

  // Full card view (fallback for compatibility)
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="aspect-square overflow-hidden">
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-900">{item.title}</h3>
        {item.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{item.description}</p>
        )}
        
        {canDelete && (
          <div className="flex justify-end gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
                  <AlertDialogDescription>
                    פעולה זו תמחק את הפריט "{item.title}" לצמיתות מהגלריה. לא ניתן לבטל פעולה זו.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>ביטול</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? 'מוחק...' : 'מחק פריט'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
};
