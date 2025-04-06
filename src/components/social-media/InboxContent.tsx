
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const InboxContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">תיבת הודעות</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/40 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">תיבת ההודעות תופיע כאן</h3>
          <p className="text-muted-foreground mb-4">חבר את חשבונות המדיה החברתית שלך כדי להתחיל</p>
          <Button variant="warm">
            חבר חשבון
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InboxContent;
