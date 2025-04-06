
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const PostCreationPanel = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="mx-auto text-center">פרסום פוסטים</CardTitle>
        <Button variant="soft">
          <Upload className="ml-2" size={16} />
          העלה מדיה
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-muted/30 rounded-lg flex items-center justify-center p-4 md:order-first">
            <div className="text-center">
              <Upload size={32} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground text-sm mb-2">גרור תמונות או וידאו לכאן</p>
              <Button variant="outline" size="sm">בחר קבצים</Button>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="space-y-4">
              <div>
                <label className="block text-center mb-1 text-sm">טקסט הפוסט</label>
                <Textarea 
                  placeholder="הזן את הטקסט שלך כאן..." 
                  className="min-h-[120px]" 
                />
              </div>
              <div>
                <label className="block text-center mb-1 text-sm">האשטגים</label>
                <Input placeholder="#nails #beauty #salon" />
              </div>
              <div>
                <label className="block text-center mb-1 text-sm">מיקום</label>
                <Input placeholder="הוסף מיקום (אופציונלי)" />
              </div>
              <div className="pt-2">
                <label className="block text-center mb-2 text-sm">פלטפורמות לפרסום</label>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent p-2">
                    טוויטר / X
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent p-2">
                    טיקטוק
                  </Badge>
                  <Badge variant="warm" className="p-2">
                    פייסבוק
                  </Badge>
                  <Badge variant="soft" className="p-2">
                    אינסטגרם
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button variant="outline">
            תזמן לפרסום
          </Button>
          <Button>
            פרסם עכשיו
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCreationPanel;
