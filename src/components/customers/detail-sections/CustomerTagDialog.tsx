
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CustomerTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newTag: string;
  onNewTagChange: (value: string) => void;
  onAddTag: () => void;
}

const CustomerTagDialog = ({
  open,
  onOpenChange,
  newTag,
  onNewTagChange,
  onAddTag
}: CustomerTagDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>הוספת תגית חדשה</DialogTitle>
          <DialogDescription>
            הוסף תגית חדשה ללקוח זה.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Input
              value={newTag}
              onChange={(e) => onNewTagChange(e.target.value)}
              placeholder="הזן שם תגית..."
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:justify-start">
          <Button type="button" onClick={onAddTag}>
            הוסף תגית
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            ביטול
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerTagDialog;
