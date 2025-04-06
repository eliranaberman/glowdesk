
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook } from "lucide-react";

type ConnectedAccountsProps = {
  connectedAccounts: {[key: string]: boolean};
  connectPlatform: (platform: string) => void;
};

const ConnectedAccountsPanel = ({ connectedAccounts, connectPlatform }: ConnectedAccountsProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg text-center w-full">פלטפורמות מחוברות</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-row-reverse justify-between items-center border-b pb-2">
            <Button 
              variant={connectedAccounts.instagram ? "soft" : "outline"} 
              className="gap-2"
              onClick={() => connectPlatform("instagram")}
            >
              <Instagram size={16} />
              {connectedAccounts.instagram ? "מחובר" : "חבר חשבון"}
            </Button>
            <div className="text-right">
              <span className="font-medium">אינסטגרם</span>
            </div>
          </div>
          
          <div className="flex flex-row-reverse justify-between items-center border-b pb-2">
            <Button 
              variant={connectedAccounts.facebook ? "soft" : "outline"} 
              className="gap-2"
              onClick={() => connectPlatform("facebook")}
            >
              <Facebook size={16} />
              {connectedAccounts.facebook ? "מחובר" : "חבר חשבון"}
            </Button>
            <div className="text-right">
              <span className="font-medium">פייסבוק</span>
            </div>
          </div>
          
          <div className="flex flex-row-reverse justify-between items-center border-b pb-2">
            <Button variant="outline" className="gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 20l3-4 3 4M10 4.5h4c3.771 0 5.657 0 6.828 1.172C22 6.843 22 8.729 22 12.5s0 5.657-1.172 6.828C19.657 20.5 17.771 20.5 14 20.5h-4c-3.771 0-5.657 0-6.828-1.172C2 18.157 2 16.271 2 12.5s0-5.657 1.172-6.828C4.343 4.5 6.229 4.5 10 4.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              חבר חשבון
            </Button>
            <div className="text-right">
              <span className="font-medium">טיקטוק</span>
            </div>
          </div>
          
          <div className="flex flex-row-reverse justify-between items-center pb-2">
            <Button variant="outline" className="gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              חבר חשבון
            </Button>
            <div className="text-right">
              <span className="font-medium">טוויטר / X</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectedAccountsPanel;
