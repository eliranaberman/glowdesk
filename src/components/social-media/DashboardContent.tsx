
import { ConnectedAccountsMap } from "./types";
import ConnectedAccountsPanel from "./ConnectedAccountsPanel";
import RecentMessagesPanel from "./RecentMessagesPanel";
import InboxStatusPanel from "./InboxStatusPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MarketingStats } from "@/types/marketing";

interface DashboardContentProps {
  connectedAccounts: ConnectedAccountsMap;
  connectPlatform: (platform: string) => void;
  handleOpenInbox: () => void;
  messages: any[];
  marketingStats: MarketingStats | null;
  isLoading: boolean;
}

const DashboardContent = ({
  connectedAccounts,
  connectPlatform,
  handleOpenInbox,
  messages,
  marketingStats,
  isLoading
}: DashboardContentProps) => {
  const connectedCount = Object.values(connectedAccounts).filter(Boolean).length;
  
  return (
    <div className="space-y-4">
      {/* Stats Grid - Centered */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-full mb-2">
                  <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-primary mx-auto" />
                </div>
                <span className="text-[11px] sm:text-sm text-muted-foreground text-center">פלטפורמות מחוברות</span>
                <span className="text-lg sm:text-2xl font-bold text-center">{connectedCount}/4</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <div className="p-2 sm:p-3 bg-secondary/10 rounded-full mb-2">
                  <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6 text-secondary mx-auto" />
                </div>
                <span className="text-[11px] sm:text-sm text-muted-foreground text-center">הודעות לא נקראו</span>
                <span className="text-lg sm:text-2xl font-bold text-center">{messages.filter(m => !m.is_read).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <div className="p-2 sm:p-3 bg-roseGold/20 rounded-full mb-2">
                  <Users className="w-4 h-4 sm:w-6 sm:h-6 text-roseGold mx-auto" />
                </div>
                <span className="text-[11px] sm:text-sm text-muted-foreground text-center">קמפיינים</span>
                <span className="text-lg sm:text-2xl font-bold text-center">{marketingStats?.total_campaigns || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <div className="p-2 sm:p-3 bg-oliveGreen/10 rounded-full mb-2">
                  <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-oliveGreen mx-auto" />
                </div>
                <span className="text-[11px] sm:text-sm text-muted-foreground text-center">הודעות שנשלחו</span>
                <span className="text-lg sm:text-2xl font-bold text-center">{marketingStats?.total_messages || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ConnectedAccountsPanel connectedAccounts={connectedAccounts} connectPlatform={connectPlatform} />

        <div className="space-y-4">
          {/* Recent Messages Panel - Removed tabs, showing only messages */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-center items-center">
                <CardTitle className="text-sm sm:text-lg text-center">הודעות אחרונות</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs ml-2" onClick={handleOpenInbox}>
                  לכל ההודעות
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <RecentMessagesPanel messages={messages} />
            </CardContent>
          </Card>
          
          <InboxStatusPanel handleOpenInbox={handleOpenInbox} />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
