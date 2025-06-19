
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Upload, Calendar, Send, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

const PostCreationPanel = () => {
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [location, setLocation] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram", "facebook"]);
  const [uploadedMedia, setUploadedMedia] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create URL for preview
      const imageUrl = URL.createObjectURL(file);
      setUploadedMedia(imageUrl);
      
      toast({
        title: "מדיה נטענה בהצלחה",
        description: `${file.name} נטען בהצלחה`,
      });
    }
  };
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleSelectFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(prev => prev.filter(p => p !== platform));
    } else {
      setSelectedPlatforms(prev => [...prev, platform]);
    }
  };
  
  const handlePublishNow = async () => {
    if (!uploadedMedia) {
      toast({
        title: "אין מדיה לפרסום",
        description: "אנא העלה תמונה או וידאו לפרסום",
        variant: "destructive",
      });
      return;
    }
    
    if (!caption) {
      toast({
        title: "אין טקסט לפרסום",
        description: "אנא הזן טקסט לפרסום",
        variant: "destructive",
      });
      return;
    }
    
    setIsPublishing(true);
    
    // Simulate publishing process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "הפוסט פורסם בהצלחה",
      description: `הפוסט פורסם בהצלחה ל-${selectedPlatforms.join(", ")}`,
    });
    
    // Reset form
    setCaption("");
    setHashtags("");
    setLocation("");
    setUploadedMedia(null);
    setIsPublishing(false);
    setShowFullPreview(false);
  };
  
  const handleSchedulePost = () => {
    if (!date) {
      toast({
        title: "לא נבחר תאריך",
        description: "אנא בחר תאריך לתזמון הפוסט",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "הפוסט תוזמן בהצלחה",
      description: `הפוסט תוזמן ל-${format(date, "dd/MM/yyyy")}`,
    });
    
    setDate(undefined);
  };

  // Mobile full-screen media preview
  if (isMobile && showFullPreview && uploadedMedia) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="flex justify-between items-center p-4 bg-black/80 text-white">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowFullPreview(false)}
            className="text-white hover:bg-white/20"
          >
            <X size={20} />
            סגור
          </Button>
          <h2 className="font-semibold">תצוגה מקדימה</h2>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => {
              setUploadedMedia(null);
              setShowFullPreview(false);
            }}
          >
            הסר
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <img 
            src={uploadedMedia} 
            alt="Preview" 
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
        <CardTitle className="mx-auto text-center text-lg sm:text-xl">פרסום פוסטים</CardTitle>
        <Button 
          variant="soft" 
          onClick={handleUploadClick}
          className="min-h-[44px] px-6"
        >
          <Upload className="ml-2" size={16} />
          העלה מדיה
        </Button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,video/*"
          onChange={handleFileInput}
        />
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {isMobile ? (
          // Mobile layout - stacked vertically
          <div className="space-y-6">
            {/* Media preview section */}
            <div className={`bg-muted/30 rounded-lg flex items-center justify-center p-6 ${uploadedMedia ? 'overflow-hidden cursor-pointer' : ''}`}>
              {uploadedMedia ? (
                <div 
                  className="relative w-full h-48 cursor-pointer"
                  onClick={() => setShowFullPreview(true)}
                >
                  <img 
                    src={uploadedMedia} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">לחץ לתצוגה מלאה</span>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="absolute top-2 right-2 opacity-90 min-h-[40px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedMedia(null);
                    }}
                  >
                    הסר
                  </Button>
                </div>
              ) : (
                <div className="text-center w-full">
                  <Upload size={40} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-base mb-4">גרור תמונות או וידאו לכאן</p>
                  <Button 
                    variant="outline" 
                    size="default" 
                    onClick={handleSelectFiles}
                    className="min-h-[44px] px-6"
                  >
                    בחר קבצים
                  </Button>
                </div>
              )}
            </div>
            
            {/* Form inputs */}
            <div className="space-y-6">
              <div>
                <label className="block text-right mb-2 text-base font-medium">טקסט הפוסט</label>
                <Textarea 
                  placeholder="הזן את הטקסט שלך כאן..." 
                  className="min-h-[120px] text-base p-4"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-right mb-2 text-base font-medium">האשטגים</label>
                <Input 
                  placeholder="#nails #beauty #salon" 
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  dir="rtl"
                  className="text-base p-4 min-h-[48px]"
                />
              </div>
              <div>
                <label className="block text-right mb-2 text-base font-medium">מיקום</label>
                <Input 
                  placeholder="הוסף מיקום (אופציונלי)" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  dir="rtl"
                  className="text-base p-4 min-h-[48px]"
                />
              </div>
              <div className="pt-2">
                <label className="block text-right mb-3 text-base font-medium">פלטפורמות לפרסום</label>
                <div className="grid grid-cols-2 gap-3">
                  <Badge 
                    variant={selectedPlatforms.includes("instagram") ? "soft" : "outline"} 
                    className="cursor-pointer hover:bg-accent p-3 text-center justify-center min-h-[48px]"
                    onClick={() => togglePlatform("instagram")}
                  >
                    אינסטגרם
                  </Badge>
                  <Badge 
                    variant={selectedPlatforms.includes("facebook") ? "warm" : "outline"} 
                    className="cursor-pointer hover:bg-accent p-3 text-center justify-center min-h-[48px]"
                    onClick={() => togglePlatform("facebook")}
                  >
                    פייסבוק
                  </Badge>
                  <Badge 
                    variant={selectedPlatforms.includes("tiktok") ? "warm" : "outline"} 
                    className="cursor-pointer hover:bg-accent p-3 text-center justify-center min-h-[48px]"
                    onClick={() => togglePlatform("tiktok")}
                  >
                    טיקטוק
                  </Badge>
                  <Badge 
                    variant={selectedPlatforms.includes("twitter") ? "warm" : "outline"} 
                    className="cursor-pointer hover:bg-accent p-3 text-center justify-center min-h-[48px]"
                    onClick={() => togglePlatform("twitter")}
                  >
                    טוויטר / X
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Desktop layout - side by side
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Media preview - Now on the right for RTL */}
            <div className={`bg-muted/30 rounded-lg flex items-center justify-center p-4 ${uploadedMedia ? 'overflow-hidden' : ''} order-last md:order-first`}>
              {uploadedMedia ? (
                <div className="relative w-full h-full min-h-[200px]">
                  <img 
                    src={uploadedMedia} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="absolute top-2 right-2 opacity-80"
                    onClick={() => setUploadedMedia(null)}
                  >
                    הסר
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload size={32} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground text-sm mb-2">גרור תמונות או וידאו לכאן</p>
                  <Button variant="outline" size="sm" onClick={handleSelectFiles}>בחר קבצים</Button>
                </div>
              )}
            </div>
            
            {/* Form inputs - Now on the left for RTL */}
            <div className="md:order-last md:col-span-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-right mb-1 text-sm">טקסט הפוסט</label>
                  <Textarea 
                    placeholder="הזן את הטקסט שלך כאן..." 
                    className="min-h-[120px]"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-right mb-1 text-sm">האשטגים</label>
                  <Input 
                    placeholder="#nails #beauty #salon" 
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-right mb-1 text-sm">מיקום</label>
                  <Input 
                    placeholder="הוסף מיקום (אופציונלי)" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    dir="rtl"
                  />
                </div>
                <div className="pt-2">
                  <label className="block text-right mb-2 text-sm">פלטפורמות לפרסום</label>
                  <div className="flex flex-wrap gap-2 justify-end">
                    <Badge 
                      variant={selectedPlatforms.includes("instagram") ? "soft" : "outline"} 
                      className="cursor-pointer hover:bg-accent p-2"
                      onClick={() => togglePlatform("instagram")}
                    >
                      אינסטגרם
                    </Badge>
                    <Badge 
                      variant={selectedPlatforms.includes("facebook") ? "warm" : "outline"} 
                      className="cursor-pointer hover:bg-accent p-2"
                      onClick={() => togglePlatform("facebook")}
                    >
                      פייסבוק
                    </Badge>
                    <Badge 
                      variant={selectedPlatforms.includes("tiktok") ? "warm" : "outline"} 
                      className="cursor-pointer hover:bg-accent p-2"
                      onClick={() => togglePlatform("tiktok")}
                    >
                      טיקטוק
                    </Badge>
                    <Badge 
                      variant={selectedPlatforms.includes("twitter") ? "warm" : "outline"} 
                      className="cursor-pointer hover:bg-accent p-2"
                      onClick={() => togglePlatform("twitter")}
                    >
                      טוויטר / X
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between'} mt-6 pt-4 border-t`}>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={`gap-2 ${isMobile ? 'min-h-[44px] text-base' : ''}`}
              >
                <Calendar size={16} />
                {date ? format(date, "dd/MM/yyyy") : "תזמן לפרסום"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
              <div className="p-2 border-t flex justify-between">
                <Button size="sm" onClick={handleSchedulePost} className={isMobile ? 'min-h-[40px]' : ''}>אישור</Button>
                <Button size="sm" variant="outline" onClick={() => setDate(undefined)} className={isMobile ? 'min-h-[40px]' : ''}>איפוס</Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            onClick={handlePublishNow} 
            disabled={isPublishing}
            className={`gap-2 ${isMobile ? 'min-h-[44px] text-base' : ''}`}
          >
            <Send size={16} />
            {isPublishing ? "מפרסם..." : "פרסם עכשיו"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCreationPanel;
