
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface CustomerTagsSectionProps {
  tags: string[];
  newTag: string;
  setNewTag: (value: string) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
}

const CustomerTagsSection = ({ 
  tags, 
  newTag, 
  setNewTag, 
  addTag, 
  removeTag 
}: CustomerTagsSectionProps) => {
  return (
    <div>
      <FormLabel className="mb-2 block">תגיות</FormLabel>
      <div className="flex items-center mb-2">
        <Input
          placeholder="הזן תגית חדשה"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="max-w-xs ml-2"
        />
        <Button type="button" size="sm" onClick={addTag}>
          <Plus className="h-4 w-4 ml-1" />
          הוסף
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          <Badge key={index} variant="outline" className="flex items-center gap-1">
            {tag}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
        {tags.length === 0 && (
          <p className="text-sm text-muted-foreground">אין תגיות</p>
        )}
      </div>
    </div>
  );
};

export default CustomerTagsSection;
