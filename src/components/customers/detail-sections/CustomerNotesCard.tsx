
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save } from 'lucide-react';

interface CustomerNotesCardProps {
  notes: string;
  isAdmin: boolean;
  onSaveNotes: () => void;
  onNotesChange: (value: string) => void;
}

const CustomerNotesCard = ({ 
  notes, 
  isAdmin, 
  onSaveNotes, 
  onNotesChange 
}: CustomerNotesCardProps) => {
  const [editingNotes, setEditingNotes] = useState(false);

  const handleEditClick = () => {
    setEditingNotes(true);
  };

  const handleSaveClick = () => {
    onSaveNotes();
    setEditingNotes(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>הערות פנימיות</CardTitle>
          {isAdmin && !editingNotes && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleEditClick}
            >
              <Edit className="h-4 w-4 ml-1" />
              עריכה
            </Button>
          )}
          {isAdmin && editingNotes && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleSaveClick}
            >
              <Save className="h-4 w-4 ml-1" />
              שמירה
            </Button>
          )}
        </div>
        <CardDescription>
          הערות פנימיות עבור צוות המערכת בלבד
        </CardDescription>
      </CardHeader>
      <CardContent>
        {editingNotes ? (
          <Textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="min-h-[200px]"
            placeholder="הוסף הערות פנימיות כאן..."
          />
        ) : (
          <div className="prose prose-sm max-w-none">
            {notes ? (
              <div className="whitespace-pre-wrap">{notes}</div>
            ) : (
              <p className="text-muted-foreground">אין הערות עדיין...</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerNotesCard;
