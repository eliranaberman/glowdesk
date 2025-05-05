
import { useState } from 'react';
import { SocialMediaAccount, PostFormData } from '@/types/socialMedia';
import { createPost } from '@/services/socialMediaService';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Image, Loader2, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Facebook, Instagram } from 'lucide-react';

interface CreatePostFormProps {
  selectedAccount?: SocialMediaAccount;
  onSuccess: () => void;
}

const CreatePostForm = ({ selectedAccount, onSuccess }: CreatePostFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.includes('image')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAccount) {
      toast({
        title: 'נדרש חשבון',
        description: 'בחר חשבון לפני יצירת פוסט',
        variant: 'destructive',
      });
      return;
    }
    
    if (!imageFile) {
      toast({
        title: 'נדרשת תמונה',
        description: 'העלה תמונה לפוסט',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const formData: PostFormData = {
      platform: selectedAccount.platform,
      account_id: selectedAccount.account_id,
      caption,
      image: imageFile,
      scheduled_for: isScheduled ? scheduledDate : null,
    };
    
    const result = await createPost(formData);
    
    if (result.success) {
      toast({
        title: 'פוסט נוצר בהצלחה',
        description: isScheduled 
          ? 'הפוסט תוזמן לפרסום בתאריך שנבחר' 
          : 'הפוסט פורסם בהצלחה',
      });
      
      // Reset form
      setCaption('');
      setImageFile(null);
      setImagePreview(null);
      setScheduledDate(null);
      setIsScheduled(false);
      
      // Refresh the posts list
      onSuccess();
    } else {
      toast({
        title: 'שגיאה',
        description: result.error || 'אירעה שגיאה ביצירת הפוסט',
        variant: 'destructive',
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>יצירת פוסט חדש</CardTitle>
          {selectedAccount && (
            <Badge variant="outline" className="flex items-center gap-1">
              {selectedAccount.platform === 'facebook' ? (
                <Facebook className="h-3 w-3 text-blue-600" />
              ) : (
                <Instagram className="h-3 w-3 text-pink-600" />
              )}
              {selectedAccount.account_name}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedAccount ? (
          <div className="text-center p-4 bg-accent/10 rounded-lg">
            <p className="text-muted-foreground">בחר חשבון כדי ליצור פוסט חדש</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="caption">טקסט הפוסט</Label>
              <Textarea
                id="caption"
                placeholder="הכנס את תוכן הפוסט כאן..."
                rows={4}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label>תמונת הפוסט</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                  isDragging ? 'border-primary bg-primary/10' : 'border-border'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-60 rounded-lg mx-auto"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      disabled={isSubmitting}
                    >
                      החלף
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Image className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">גרור ושחרר תמונה או</p>
                    <div className="flex justify-center">
                      <label>
                        <Button 
                          variant="secondary"
                          type="button"
                          disabled={isSubmitting}
                          className="cursor-pointer"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          העלה תמונה
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={isSubmitting}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Switch
                id="schedule"
                checked={isScheduled}
                onCheckedChange={setIsScheduled}
                disabled={isSubmitting}
              />
              <Label htmlFor="schedule">תזמן את הפוסט</Label>
            </div>
            
            {isScheduled && (
              <div className="space-y-2">
                <Label>תאריך לפרסום</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-right",
                        !scheduledDate && "text-muted-foreground"
                      )}
                      disabled={isSubmitting}
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {scheduledDate ? format(scheduledDate, "dd/MM/yyyy") : "בחר תאריך"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={scheduledDate}
                      onSelect={setScheduledDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedAccount || !imageFile}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin ml-2" />
          ) : null}
          {isScheduled ? 'תזמן פוסט' : 'פרסם עכשיו'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatePostForm;
