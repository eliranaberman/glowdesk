
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Message = {
  id: number;
  platform: string;
  sender: string;
  message: string;
  time: string;
  read: boolean;
  avatar: string;
};

type RecentMessagesPanelProps = {
  messages: Message[];
};

const RecentMessagesPanel = ({ messages }: RecentMessagesPanelProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Button variant="outline" size="sm">
          טען עוד
        </Button>
        <CardTitle className="text-lg text-center mx-auto">הודעות אחרונות</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3 items-center border-b pb-3 last:border-0 text-center">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src={message.avatar} alt={message.sender} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col items-center flex-1 gap-1 text-center">
                <div className="flex items-center gap-2 justify-center w-full">
                  {!message.read && (
                    <Badge variant="soft" className="h-2 w-2 p-0 rounded-full" />
                  )}
                  <span className="font-medium">{message.sender} ({message.platform})</span>
                  <span className="text-sm text-muted-foreground">{message.time}</span>
                </div>
                <p className="text-sm">{message.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentMessagesPanel;
