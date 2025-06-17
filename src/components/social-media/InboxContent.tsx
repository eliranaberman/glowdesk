
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SocialMediaMessage, InboxContentProps } from "./types";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Instagram, Facebook, MessageCircle, User, Calendar, Clock, Flag, ArrowRight, Send, Image, FileText, Smile } from "lucide-react";
import ConnectionModal from "./ConnectionModal";
import ReplyModal from "./ReplyModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const InboxContent = ({ messages, onMarkAsRead, onReply }: InboxContentProps) => {
  const [activePlatform, setActivePlatform] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<SocialMediaMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const filteredMessages = activePlatform === "all" 
    ? messages 
    : messages.filter(msg => msg.platform === activePlatform);

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedMessage) return;

    await onReply(selectedMessage.id, replyText);
    await onMarkAsRead(selectedMessage.id);
    
    toast({
      title: "תגובה נשלחה",
      description: `התגובה שלך ל-${selectedMessage.sender_name} נשלחה בהצלחה`
    });
    
    setReplyText("");
  };

  const handleMarkAllAsRead = async () => {
    const unreadMessages = messages.filter(msg => !msg.is_read);
    for (const message of unreadMessages) {
      await onMarkAsRead(message.id);
    }
    
    toast({
      title: "הכל סומן כנקרא",
      description: "כל ההודעות סומנו כנקראו בהצלחה"
    });
  };

  const handleReply = (message: SocialMediaMessage) => {
    setSelectedMessage(message);
    setReplyModalOpen(true);
  };

  const handleShowDetails = () => {
    setDetailsOpen(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-[calc(100vh-220px)]">
      {/* Mobile view - conversation toggle */}
      {isMobile && selectedMessage && (
        <div className="fixed bottom-4 right-4 z-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="default" className="rounded-full w-14 h-14 shadow-lg">
                <MessageCircle size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="border-b p-4">
                  <SheetTitle>הודעות</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto">
                  <MessageList 
                    messages={filteredMessages} 
                    selectedMessage={selectedMessage} 
                    setSelectedMessage={setSelectedMessage} 
                    handleReply={handleReply} 
                    handleMarkAllAsRead={handleMarkAllAsRead}
                    activePlatform={activePlatform}
                    setActivePlatform={setActivePlatform}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
      
      {/* Right side - message list (in RTL view) */}
      <Card className={`${isMobile && selectedMessage ? 'hidden' : 'block'} lg:col-span-1 order-first lg:order-first`}>
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="mx-auto text-lg">הודעות</CardTitle>
          {messages.some(msg => !msg.is_read) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="px-2 py-1 h-8 text-xs whitespace-nowrap"
            >
              סמן הכל כנקרא
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsModalOpen(true)}
            className="px-2 py-1 h-8"
          >
            חבר חשבון
          </Button>
        </CardHeader>
        
        <CardContent className="p-0">
          <MessageList 
            messages={filteredMessages} 
            selectedMessage={selectedMessage} 
            setSelectedMessage={setSelectedMessage} 
            handleReply={handleReply} 
            handleMarkAllAsRead={handleMarkAllAsRead}
            activePlatform={activePlatform}
            setActivePlatform={setActivePlatform}
          />
        </CardContent>
      </Card>

      {/* Left side - conversation area (in RTL view) */}
      <Card className={`${isMobile && !selectedMessage ? 'hidden' : 'block'} lg:col-span-2 flex flex-col h-full order-last lg:order-last`}>
        {selectedMessage ? (
          <>
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent bg-muted flex items-center justify-center">
                  <User size={24} className="text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-xl">{selectedMessage.sender_name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    {getPlatformIcon(selectedMessage.platform)}
                    <span>{selectedMessage.platform}</span>
                    <span>•</span>
                    <span>{new Date(selectedMessage.received_at).toLocaleDateString('he-IL')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShowDetails}>
                  פרטים נוספים
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-muted/10 mb-2 border rounded-lg">
                <div className="flex gap-3 items-start max-w-[80%]">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="mb-2">{selectedMessage.message_text}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(selectedMessage.received_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                    <User size={16} className="text-muted-foreground" />
                  </div>
                </div>
                
                {selectedMessage.reply_text && (
                  <div className="flex justify-start">
                    <div className="bg-primary/10 p-4 rounded-lg max-w-[80%]">
                      <p className="mb-2">{selectedMessage.reply_text}</p>
                      <span className="text-xs text-muted-foreground">
                        {selectedMessage.replied_at && new Date(selectedMessage.replied_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Reply input */}
              <div className="flex items-end gap-3">
                <Button 
                  onClick={handleSendReply} 
                  disabled={!replyText.trim()} 
                  size="sm"
                  className="mb-1 px-5 gap-2"
                >
                  <Send size={14} />
                  שלח
                </Button>
                <div className="flex-1 relative">
                  <textarea 
                    value={replyText} 
                    onChange={e => setReplyText(e.target.value)}
                    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[80px] resize-none" 
                    placeholder="כתוב את תגובתך כאן..." 
                  />
                  <div className="absolute right-2 bottom-2 flex gap-1">
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                      <Image size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                      <FileText size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                      <Smile size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <MessageCircle size={70} className="text-muted-foreground mb-6" />
            <h3 className="text-xl font-medium">בחר הודעה לתצוגה</h3>
            <p className="text-muted-foreground mt-2 mb-4 max-w-sm text-center">
              לחץ על אחת מההודעות מהרשימה בצד ימין כדי לראות את התוכן שלה.
            </p>
          </div>
        )}
      </Card>

      {/* Modals */}
      <ConnectionModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        connectedAccounts={{
          instagram: false,
          facebook: false,
          tiktok: false
        }} 
        onConnect={() => {}} 
      />
      
      <ReplyModal 
        open={replyModalOpen} 
        onOpenChange={setReplyModalOpen} 
        message={selectedMessage} 
      />
      
      <CustomerDetailsDialog 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen} 
        customer={selectedMessage} 
      />
    </div>
  );
};

type MessageListProps = {
  messages: SocialMediaMessage[];
  selectedMessage: SocialMediaMessage | null;
  setSelectedMessage: (msg: SocialMediaMessage) => void;
  handleReply: (msg: SocialMediaMessage) => void;
  handleMarkAllAsRead: () => void;
  activePlatform: string;
  setActivePlatform: (platform: string) => void;
};

const MessageList = ({
  messages,
  selectedMessage,
  setSelectedMessage,
  handleReply,
  handleMarkAllAsRead,
  activePlatform,
  setActivePlatform
}: MessageListProps) => {
  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue={activePlatform} value={activePlatform} onValueChange={setActivePlatform} className="w-full">
        <TabsList className="w-full grid grid-cols-4 rounded-none border-b">
          <TabsTrigger value="facebook" className="rounded-none py-2 data-[state=active]:bg-accent/50">
            <Facebook className="ml-1.5" size={16} />
            פייסבוק
          </TabsTrigger>
          <TabsTrigger value="instagram" className="rounded-none py-2 data-[state=active]:bg-accent/50">
            <Instagram className="ml-1.5" size={16} />
            אינסטגרם
          </TabsTrigger>
          <TabsTrigger value="tiktok" className="rounded-none py-2 data-[state=active]:bg-accent/50">
            <TikTokIcon />
            טיקטוק
          </TabsTrigger>
          <TabsTrigger value="all" className="rounded-none py-2 data-[state=active]:bg-accent/50">הכל</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="h-[calc(100vh-320px)] overflow-y-auto">
        {messages.length ? messages.map(msg => (
          <div 
            key={msg.id} 
            onClick={() => setSelectedMessage(msg)} 
            className={`flex justify-between p-3 border-b cursor-pointer hover:bg-muted/20 transition-colors
              ${selectedMessage?.id === msg.id ? 'bg-muted/30' : ''} 
              ${!msg.is_read ? 'bg-muted/10' : ''}`
            }
          >
            <div className="flex gap-3 items-center w-full">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-border/30 bg-muted flex items-center justify-center">
                <User size={16} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium">{msg.sender_name}</span>
                    {!msg.is_read && <span className="w-2 h-2 bg-primary rounded-full"></span>}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.received_at).toLocaleDateString('he-IL')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate mb-1">{msg.message_text}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-muted/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                    {getPlatformIcon(msg.platform)}
                    {msg.platform}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 h-6 text-xs hover:bg-transparent hover:underline text-muted-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReply(msg);
                    }}
                  >
                    השב
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <MessageCircle size={40} className="text-muted-foreground mb-2" />
            <p className="text-muted-foreground">אין הודעות להצגה</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CustomerDetailsDialog = ({
  open,
  onOpenChange,
  customer
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: SocialMediaMessage | null;
}) => {
  if (!customer) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="border-b pb-4 mb-4">
          <DialogTitle className="text-center text-xl">פרטי לקוח</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-accent bg-muted flex items-center justify-center">
            <User size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-1">{customer.sender_name}</h3>
          <p className="text-muted-foreground flex items-center gap-1 mb-6">
            {getPlatformIcon(customer.platform)}
            {customer.platform}
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span>משתמש מאז</span>
            </div>
            <span>{new Date(customer.created_at).toLocaleDateString('he-IL')}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>הודעה אחרונה</span>
            </div>
            <span>{new Date(customer.received_at).toLocaleDateString('he-IL')}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>סטטוס</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${
              customer.is_read ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {customer.is_read ? 'נקרא' : 'לא נקרא'}
            </span>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button variant="outline" className="flex items-center gap-2 px-6" onClick={() => onOpenChange(false)}>
            <ArrowRight size={16} />
            סגור
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to get platform icon
const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "instagram":
      return <Instagram size={16} className="text-pink-500" />;
    case "facebook":
      return <Facebook size={16} className="text-blue-600" />;
    case "tiktok":
      return <TikTokIcon />;
    default:
      return <MessageCircle size={16} className="text-gray-500" />;
  }
};

const TikTokIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z" fill="currentColor"/>
  </svg>
);

export default InboxContent;
