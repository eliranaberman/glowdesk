
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

type InboxStatusPanelProps = {
  handleOpenInbox: () => void;
};

const InboxStatusPanel = ({ handleOpenInbox }: InboxStatusPanelProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-center pb-2">
        <CardTitle className="text-lg text-center">סטטוס הודעות</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-right">
              <span className="font-medium">הודעות חדשות</span>
            </div>
            <Badge variant="soft">2 לא נקראו</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-right">
              <span className="font-medium">זמן תגובה ממוצע</span>
            </div>
            <span>1.2 שעות</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-right">
              <span className="font-medium">שיעור מענה</span>
            </div>
            <span>92%</span>
          </div>
          
          <Button 
            variant="warm" 
            className="w-full mt-2"
            onClick={handleOpenInbox}
          >
            <MessageSquare size={16} className="ml-2" />
            פתח תיבת הודעות
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InboxStatusPanel;
