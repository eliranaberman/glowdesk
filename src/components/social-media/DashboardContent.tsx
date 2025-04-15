
import { ConnectedAccountsMap } from "./types";
import ConnectedAccountsPanel from "./ConnectedAccountsPanel";
import RecentMessagesPanel from "./RecentMessagesPanel";
import InboxStatusPanel from "./InboxStatusPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">פלטפורמות מחוברות</span>
                <span className="text-2xl font-bold">{connectedCount}/4</span>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Zap className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">הודעות לא נקראו</span>
                <span className="text-2xl font-bold">{messages.filter(m => !m.read).length}</span>
              </div>
              <div className="p-3 bg-secondary/10 rounded-full">
                <MessageSquare className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">קמפיינים</span>
                <span className="text-2xl font-bold">{marketingStats?.total_campaigns || 0}</span>
              </div>
              <div className="p-3 bg-roseGold/20 rounded-full">
                <Users className="w-6 h-6 text-roseGold" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">הודעות שנשלחו</span>
                <span className="text-2xl font-bold">{marketingStats?.total_messages || 0}</span>
              </div>
              <div className="p-3 bg-oliveGreen/10 rounded-full">
                <BarChart3 className="w-6 h-6 text-oliveGreen" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ConnectedAccountsPanel
          connectedAccounts={connectedAccounts}
          connectPlatform={connectPlatform}
        />

        <div className="space-y-4">
          <Tabs defaultValue="inbox">
            <TabsList className="grid grid-cols-2 mb-3">
              <TabsTrigger value="marketing">שיווק</TabsTrigger>
              <TabsTrigger value="inbox">הודעות</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inbox">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">הודעות אחרונות</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={handleOpenInbox}
                    >
                      לכל ההודעות
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <RecentMessagesPanel messages={messages} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="marketing">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">סטטיסטיקות שיווק</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      asChild
                    >
                      <Link to="/marketing">לדשבורד שיווק</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-6">
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-4 bg-muted rounded w-5/6"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">תבניות</p>
                        <p className="text-xl font-semibold">{marketingStats?.total_templates || 0}</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">קמפיינים</p>
                        <p className="text-xl font-semibold">{marketingStats?.total_campaigns || 0}</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">הודעות</p>
                        <p className="text-xl font-semibold">{marketingStats?.total_messages || 0}</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">קופונים פעילים</p>
                        <p className="text-xl font-semibold">{marketingStats?.active_coupons || 0}</p>
                      </div>
                    </div>
                  )}
                  <div className="mt-4 flex justify-center">
                    <Button asChild className="w-full">
                      <Link to="/marketing">
                        לניהול מלא של השיווק
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <InboxStatusPanel />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
