
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AnalyticsContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">אנליטיקס</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/40 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">האנליטיקס יופיע בקרוב</h3>
          <p className="text-muted-foreground">מידע על הביצועים של הפוסטים שלך יופיע כאן</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsContent;
