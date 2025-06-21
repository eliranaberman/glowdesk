
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
                <span className="text-lg sm:text-2xl font-bold text-center">{messages.filter(m => !m.read).length}</span>
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
          <Tabs defaultValue="inbox" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-auto p-1 mb-3 mx-auto">
              <TabsTrigger value="inbox" className="text-xs py-2 text-center">הודעות</TabsTrigger>
              <TabsTrigger value="marketing" className="text-xs py-2 text-center">שיווק</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inbox">
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
            </TabsContent>
            
            <TabsContent value="marketing">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-center items-center">
                    <CardTitle className="text-sm sm:text-lg text-center">סטטיסטיקות שיווק</CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs ml-2" asChild>
                      <Link to="/marketing">לדשבורד שיווק</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-pulse space-y-2 text-center">
                        <div className="h-3 bg-muted rounded w-3/4 mx-auto"></div>
                        <div className="h-3 bg-muted rounded w-1/2 mx-auto"></div>
                        <div className="h-3 bg-muted rounded w-5/6 mx-auto"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      <div className="p-2 sm:p-3 border rounded-lg text-center">
                        <p className="text-xs sm:text-sm text-muted-foreground">תבניות</p>
                        <p className="text-sm sm:text-xl font-semibold">{marketingStats?.total_templates || 0}</p>
                      </div>
                      <div className="p-2 sm:p-3 border rounded-lg text-center">
                        <p className="text-xs sm:text-sm text-muted-foreground">קמפיינים</p>
                        <p className="text-sm sm:text-xl font-semibold">{marketingStats?.total_campaigns || 0}</p>
                      </div>
                      <div className="p-2 sm:p-3 border rounded-lg text-center">
                        <p className="text-xs sm:text-sm text-muted-foreground">הודעות</p>
                        <p className="text-sm sm:text-xl font-semibold">{marketingStats?.total_messages || 0}</p>
                      </div>
                      <div className="p-2 sm:p-3 border rounded-lg text-center">
                        <p className="text-xs sm:text-sm text-muted-foreground">קופונים פעילים</p>
                        <p className="text-sm sm:text-xl font-semibold">{marketingStats?.active_coupons || 0}</p>
                      </div>
                    </div>
                  )}
                  <div className="mt-3 text-center">
                    <Button asChild className="w-full text-xs sm:text-sm mx-auto">
                      <Link to="/marketing">
                        לניהול מלא של השיווק
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <InboxStatusPanel handleOpenInbox={handleOpenInbox} />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
