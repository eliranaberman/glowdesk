
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Facebook, Instagram, Send, MessageCircle, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SocialMediaMessage } from "./types";

interface UnifiedInboxProps {
  messages: SocialMediaMessage[];
  onMarkAsRead: (messageId: string) => void;
  onReply: (messageId: string, reply: string) => void;
}

const UnifiedInbox = ({ messages, onMarkAsRead, onReply }: UnifiedInboxProps) => {
  const [filteredMessages, setFilteredMessages] = useState<SocialMediaMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<SocialMediaMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  
  // Filters
  const [platformFilter, setPlatformFilter] = useState<'all' | 'facebook' | 'instagram' | 'tiktok'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  
  const { toast } = useToast();

  useEffect(() => {
    // Apply filters
    let filtered = messages;

    if (platformFilter !== 'all') {
      filtered = filtered.filter(msg => msg.platform === platformFilter);
    }

    if (statusFilter === 'unread') {
      filtered = filtered.filter(msg => !msg.is_read);
    } else if (statusFilter === 'read') {
      filtered = filtered.filter(msg => msg.is_read);
    }

    if (searchQuery) {
      filtered = filtered.filter(msg => 
        msg.message_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.sender_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by received_at descending (newest first)
    filtered.sort((a, b) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime());

    setFilteredMessages(filtered);
  }, [messages, platformFilter, statusFilter, searchQuery]);

  const handleMessageClick = async (message: SocialMediaMessage) => {
    setSelectedMessage(message);
    
    // Mark as read if unread
    if (!message.is_read) {
      onMarkAsRead(message.id);
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setSending(true);
    try {
      await onReply(selectedMessage.id, replyText);
      setReplyText("");
      toast({
        title: "ההודעה נשלחה",
        description: "התגובה שלך נשלחה בהצלחה",
      });
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "שגיאה בשליחה",
        description: "לא ניתן לשלוח את התגובה. נסה שוב.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook size={16} className="text-blue-600" />;
      case 'instagram':
        return <Instagram size={16} className="text-pink-500" />;
      default:
        return <MessageCircle size={16} className="text-gray-500" />;
    }
  };

  const getStatusBadge = (message: SocialMediaMessage) => {
    if (message.reply_text) {
      return <Badge variant="default" className="text-xs bg-green-500">נענה</Badge>;
    }
    if (message.is_read) {
      return <Badge variant="secondary" className="text-xs">נקרא</Badge>;
    }
    return <Badge variant="destructive" className="text-xs">חדש</Badge>;
  };

  const unreadCount = messages.filter(msg => !msg.is_read).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Conversation Area - Left side (order-1) */}
      <div className="lg:col-span-2 order-1">
        {selectedMessage ? (
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                {getPlatformIcon(selectedMessage.platform)}
                <div>
                  <h3 className="font-medium">
                    {selectedMessage.sender_name || 'משתמש אנונימי'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedMessage.platform === 'facebook' ? 'פייסבוק מסנג\'ר' : 
                     selectedMessage.platform === 'instagram' ? 'אינסטגרם ישיר' : 'טיקטוק'}
                  </p>
                </div>
                {getStatusBadge(selectedMessage)}
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Original Message */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium">הודעה נכנסת</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(selectedMessage.received_at).toLocaleString('he-IL')}
                    </span>
                  </div>
                  <p className="text-sm">
                    {selectedMessage.message_text || '[הודעת מדיה]'}
                  </p>
                </div>

                {/* Previous Reply */}
                {selectedMessage.reply_text && (
                  <div className="bg-primary/5 p-4 rounded-lg border-r-4 border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      <Send size={16} className="text-primary" />
                      <span className="text-sm font-medium">התגובה שלך</span>
                      {selectedMessage.replied_at && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(selectedMessage.replied_at).toLocaleString('he-IL')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm">{selectedMessage.reply_text}</p>
                  </div>
                )}

                {/* Reply Form */}
                <div className="space-y-3">
                  <h4 className="font-medium">שלח תגובה</h4>
                  <Textarea
                    placeholder="כתוב את התגובה שלך כאן..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || sending}
                      className="gap-2"
                    >
                      <Send size={16} />
                      {sending ? 'שולח...' : 'שלח תגובה'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setReplyText("")}
                      disabled={sending}
                    >
                      נקה
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="font-medium mb-2">בחר הודעה כדי להציג</h3>
                <p className="text-sm">לחץ על הודעה מהרשימה כדי לקרוא ולהגיב</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Messages List - Right side (order-2) */}
      <div className="lg:col-span-1 order-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle size={20} />
                תיבת הודעות
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <Button variant="ghost" size="icon">
                <Filter size={16} />
              </Button>
            </div>
            
            {/* Filters */}
            <div className="space-y-2">
              <Input
                placeholder="חיפוש הודעות..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Select value={platformFilter} onValueChange={(value: any) => setPlatformFilter(value)}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל הפלטפורמות</SelectItem>
                    <SelectItem value="facebook">פייסבוק</SelectItem>
                    <SelectItem value="instagram">אינסטגרם</SelectItem>
                    <SelectItem value="tiktok">טיקטוק</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל הסטטוסים</SelectItem>
                    <SelectItem value="unread">לא נקראו</SelectItem>
                    <SelectItem value="read">נקראו</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {filteredMessages.length > 0 ? (
              <div className="divide-y max-h-96 overflow-y-auto">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => handleMessageClick(message)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                        {message.sender_name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {getPlatformIcon(message.platform)}
                            <span className="font-medium text-sm truncate">
                              {message.sender_name || 'משתמש אנונימי'}
                            </span>
                          </div>
                          {getStatusBadge(message)}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                          {message.message_text || '[הודעת מדיה]'}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.received_at).toLocaleDateString('he-IL', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>אין הודעות להצגה</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnifiedInbox;
