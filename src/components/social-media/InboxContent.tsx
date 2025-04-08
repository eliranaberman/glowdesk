
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Message } from "./types";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Instagram, Facebook, Twitter, MessageCircle } from "lucide-react";
import ConnectionModal from "./ConnectionModal";
import ReplyModal from "./ReplyModal";

const mockedMessages: Message[] = [
  {
    id: 1,
    platform: "instagram",
    sender: "sarah_nails_fan",
    message: "היי, האם יש לך פנוי לפגישה ביום שלישי?",
    time: "10:23",
    read: false,
    avatar: "https://picsum.photos/seed/1/64",
  },
  {
    id: 2,
    platform: "facebook",
    sender: "מיכל כהן",
    message: "מחיר לבנייה מלאה + לק ג'ל?",
    time: "08:45",
    read: true,
    avatar: "https://picsum.photos/seed/2/64",
  },
  {
    id: 3,
    platform: "instagram",
    sender: "beauty_trends",
    message: "אהבתי את העיצוב האחרון שפרסמת! אפשר לקבוע תור?",
    time: "יום אתמול",
    read: true,
    avatar: "https://picsum.photos/seed/3/64",
  },
  {
    id: 4,
    platform: "instagram",
    sender: "nail_inspiration",
    message: "איזה חומרים את משתמשת ליצירת האפקט הזה?",
    time: "יומיים",
    read: false,
    avatar: "https://picsum.photos/seed/4/64",
  },
  {
    id: 5,
    platform: "facebook",
    sender: "דנה לוי",
    message: "שלום, אפשר מחיר לטיפול קבוע?",
    time: "3 ימים",
    read: true,
    avatar: "https://picsum.photos/seed/5/64",
  }
];

const InboxContent = () => {
  const [messages, setMessages] = useState(mockedMessages);
  const [activePlatform, setActivePlatform] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  
  const { toast } = useToast();

  const filteredMessages = activePlatform === "all" 
    ? messages 
    : messages.filter(msg => msg.platform === activePlatform);

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) return;
    
    // Mark the message as read
    setMessages(prev => prev.map(msg => 
      msg.id === selectedMessage.id ? { ...msg, read: true } : msg
    ));
    
    toast({
      title: "תגובה נשלחה",
      description: `התגובה שלך ל-${selectedMessage.sender} נשלחה בהצלחה`,
    });
    
    setReplyText("");
    setSelectedMessage(null);
  };

  const handleMarkAllAsRead = () => {
    setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
    
    toast({
      title: "הכל סומן כנקרא",
      description: "כל ההודעות סומנו כנקראו בהצלחה",
    });
  };

  const handleReply = (message: Message) => {
    setSelectedMessage(message);
    setReplyModalOpen(true);
  };

  return (
    <div className="flex flex-col-reverse md:flex-row-reverse gap-6 h-[calc(100vh-220px)]">
      {/* Message View */}
      <Card className="flex-1 mb-4 md:mb-0">
        {selectedMessage ? (
          <>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex flex-row-reverse items-center">
                <div>
                  <CardTitle className="text-xl">{selectedMessage.sender}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedMessage.platform} • {selectedMessage.time}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full overflow-hidden ml-4">
                  <img 
                    src={selectedMessage.avatar} 
                    alt={selectedMessage.sender} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  פרטים נוספים
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="flex flex-col h-[calc(100vh-380px)]">
              <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-muted/20 rounded-lg mb-6">
                {/* Customer Message */}
                <div className="flex flex-row gap-4 items-start max-w-[85%] ml-auto">
                  <div className="bg-muted/50 p-5 rounded-lg text-lg">
                    <p className="mb-2">{selectedMessage.message}</p>
                    <span className="text-sm text-muted-foreground block">{selectedMessage.time}</span>
                  </div>
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src={selectedMessage.avatar} 
                      alt={selectedMessage.sender} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
                
                {/* If there was a previous response */}
                {selectedMessage.id % 2 === 0 && (
                  <div className="flex justify-end">
                    <div className="bg-primary/10 p-5 rounded-lg max-w-[85%] text-lg">
                      <p className="mb-2">תודה על פנייתך! אשמח לעזור. אפשר לתת מחיר מדויק בטלפון או כשאראה את המצב הקיים.</p>
                      <span className="text-sm text-muted-foreground block">10:30</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4">
                <textarea 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 border rounded-lg p-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="כתוב את תגובתך כאן..."
                  rows={4}
                />
                <Button 
                  onClick={handleSendReply} 
                  className="self-end h-14 px-6 text-lg" 
                  disabled={!replyText.trim()}
                >
                  שלח
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <MessageCircle size={70} className="text-muted-foreground mb-6" />
            <h3 className="text-xl font-medium">בחר הודעה לתצוגה</h3>
            <p className="text-muted-foreground mt-2 mb-4 max-w-sm text-center text-lg">
              לחץ על אחת מההודעות מהרשימה בצד ימין כדי לראות את התוכן שלה.
            </p>
          </div>
        )}
      </Card>

      {/* Message List */}
      <Card className="w-full md:w-1/3">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            חבר חשבון
          </Button>
          <CardTitle className="mx-auto">הודעות</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" value={activePlatform} onValueChange={setActivePlatform} className="w-full">
            <TabsList className="w-full grid grid-cols-3 rounded-none border-b">
              <TabsTrigger value="facebook" className="rounded-none">
                <Facebook className="ml-1" size={16} />
                פייסבוק
              </TabsTrigger>
              <TabsTrigger value="instagram" className="rounded-none">
                <Instagram className="ml-1" size={16} />
                אינסטגרם
              </TabsTrigger>
              <TabsTrigger value="all" className="rounded-none">הכל</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <MessageList 
                messages={filteredMessages} 
                selectedMessage={selectedMessage}
                setSelectedMessage={setSelectedMessage}
                handleReply={handleReply}
                handleMarkAllAsRead={handleMarkAllAsRead}
              />
            </TabsContent>
            
            <TabsContent value="instagram">
              <MessageList 
                messages={filteredMessages} 
                selectedMessage={selectedMessage}
                setSelectedMessage={setSelectedMessage}
                handleReply={handleReply}
                handleMarkAllAsRead={handleMarkAllAsRead}
              />
            </TabsContent>
            
            <TabsContent value="facebook">
              <MessageList 
                messages={filteredMessages} 
                selectedMessage={selectedMessage}
                setSelectedMessage={setSelectedMessage}
                handleReply={handleReply}
                handleMarkAllAsRead={handleMarkAllAsRead}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ConnectionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        connectedAccounts={{
          instagram: false,
          facebook: false,
          twitter: false,
          tiktok: false
        }}
        onConnect={() => {}}
      />
      
      <ReplyModal 
        open={replyModalOpen} 
        onOpenChange={setReplyModalOpen} 
        message={selectedMessage} 
      />
    </div>
  );
};

// Extracted message list component to reduce code duplication
const MessageList = ({ 
  messages, 
  selectedMessage, 
  setSelectedMessage,
  handleReply,
  handleMarkAllAsRead
}: { 
  messages: Message[],
  selectedMessage: Message | null,
  setSelectedMessage: (msg: Message) => void,
  handleReply: (msg: Message) => void,
  handleMarkAllAsRead: () => void
}) => {
  // Helper function to get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram size={16} className="text-pink-500" />;
      case "facebook":
        return <Facebook size={16} className="text-blue-600" />;
      case "twitter":
        return <Twitter size={16} className="text-blue-400" />;
      default:
        return <MessageCircle size={16} className="text-gray-500" />;
    }
  };
  
  return (
    <div>
      <div className="h-[calc(100vh-320px)] overflow-y-auto">
        {messages.length ? (
          messages.map((msg) => (
            <div 
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className={`flex flex-row-reverse gap-4 p-4 border-b cursor-pointer hover:bg-muted/30 transition-colors ${selectedMessage?.id === msg.id ? 'bg-muted/50' : ''} ${!msg.read ? 'bg-muted/20' : ''}`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img src={msg.avatar} alt={msg.sender} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                  <div className="flex items-center">
                    <span className="font-medium text-base">{msg.sender}</span>
                    {!msg.read && (
                      <span className="mr-2 w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-muted/50 px-2 py-1 rounded-full flex items-center gap-1">
                    {getPlatformIcon(msg.platform)}
                    {msg.platform}
                  </span>
                  <p className="text-sm text-muted-foreground truncate max-w-[70%] text-right">{msg.message}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <MessageCircle size={40} className="text-muted-foreground mb-2" />
            <p className="text-muted-foreground">אין הודעות להצגה</p>
          </div>
        )}
      </div>
      
      {messages.length > 0 && (
        <div className="p-3 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full"
            onClick={handleMarkAllAsRead}
          >
            סמן הכל כנקרא
          </Button>
        </div>
      )}
    </div>
  );
};

export default InboxContent;
