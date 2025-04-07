
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Users, ArrowRight, Send } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const InactiveClientsAlert = () => {
  const [inactivePeriod, setInactivePeriod] = useState("90");
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Mock inactive clients data
  const inactiveClients = [
    { id: "1", name: "מיטל אברהם", lastVisit: 60, totalSpent: "₪1,240", treatments: 8, risk: "high" },
    { id: "2", name: "דנה לוי", lastVisit: 45, totalSpent: "₪3,580", treatments: 12, risk: "medium" },
    { id: "3", name: "רונית כהן", lastVisit: 90, totalSpent: "₪780", treatments: 5, risk: "high" },
    { id: "4", name: "אורלי פרץ", lastVisit: 70, totalSpent: "₪2,350", treatments: 10, risk: "medium" },
    { id: "5", name: "ורדית שרעבי", lastVisit: 85, totalSpent: "₪4,120", treatments: 15, risk: "low" },
  ];

  // Filter clients based on inactive period
  const filteredClients = inactiveClients.filter(
    client => client.lastVisit >= parseInt(inactivePeriod)
  );

  // Toggle client selection
  const toggleClientSelection = (id: string) => {
    setSelectedClientIds(prev => 
      prev.includes(id) 
        ? prev.filter(clientId => clientId !== id)
        : [...prev, id]
    );
  };

  // Select all clients
  const selectAllClients = () => {
    if (selectedClientIds.length === filteredClients.length) {
      setSelectedClientIds([]);
    } else {
      setSelectedClientIds(filteredClients.map(client => client.id));
    }
  };

  // Send reminder to selected clients
  const sendReminder = () => {
    if (selectedClientIds.length === 0) {
      toast.error("נא לבחור לקוחות לשליחת תזכורת");
      return;
    }

    toast.success(`נשלחה תזכורת ל-${selectedClientIds.length} לקוחות`);
    setDialogOpen(false);
    setSelectedClientIds([]);
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "high":
        return <Badge variant="destructive">סיכון גבוה</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-amber-100">סיכון בינוני</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-green-100">סיכון נמוך</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="h-5 w-5 ml-2 text-destructive" />
              לקוחות לא פעילים
            </CardTitle>
            <CardDescription>
              לקוחות שלא ביקרו בעסק בזמן האחרון
            </CardDescription>
          </div>
          <Link to="/customers/inactive">
            <Button variant="ghost" size="sm" className="gap-1">
              לכל הלקוחות הלא פעילים
              <ArrowRight className="h-4 w-4 mr-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm font-medium">סינון לפי תקופת חוסר פעילות</p>
              <Select value={inactivePeriod} onValueChange={setInactivePeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 ימים</SelectItem>
                  <SelectItem value="60">60 ימים</SelectItem>
                  <SelectItem value="90">90 ימים</SelectItem>
                  <SelectItem value="120">120 ימים</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Send className="h-4 w-4 ml-2" />
                  שלח תזכורת
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>שליחת תזכורת ללקוחות</DialogTitle>
                  <DialogDescription>
                    בחר לקוחות לשליחת תזכורת
                  </DialogDescription>
                </DialogHeader>
                
                <div className="max-h-[300px] overflow-y-auto border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <input 
                            type="checkbox" 
                            checked={
                              filteredClients.length > 0 && 
                              selectedClientIds.length === filteredClients.length
                            }
                            onChange={selectAllClients}
                            className="h-4 w-4"
                          />
                        </TableHead>
                        <TableHead>שם</TableHead>
                        <TableHead>ימים מאז ביקור אחרון</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map((client) => (
                        <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="px-4">
                            <input 
                              type="checkbox" 
                              checked={selectedClientIds.includes(client.id)}
                              onChange={() => toggleClientSelection(client.id)}
                              className="h-4 w-4"
                            />
                          </TableCell>
                          <TableCell>{client.name}</TableCell>
                          <TableCell>{client.lastVisit} ימים</TableCell>
                        </TableRow>
                      ))}
                      {filteredClients.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                            אין לקוחות לא פעילים בתקופה זו
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    ביטול
                  </Button>
                  <Button onClick={sendReminder}>
                    שלח תזכורת ({selectedClientIds.length})
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם לקוח</TableHead>
                  <TableHead>ביקור אחרון</TableHead>
                  <TableHead className="hidden md:table-cell">רכישות</TableHead>
                  <TableHead className="hidden md:table-cell">סיכון נטישה</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.slice(0, 4).map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.lastVisit} ימים</TableCell>
                    <TableCell className="hidden md:table-cell">{client.treatments} טיפולים</TableCell>
                    <TableCell className="hidden md:table-cell">{getRiskBadge(client.risk)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => toggleClientSelection(client.id)}>
                        <Send className="h-4 w-4 ml-1" /> תזכורת
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredClients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      אין לקוחות לא פעילים בתקופה זו
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="border rounded-lg p-4 bg-muted/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-4 w-4 text-primary ml-2" />
                <span className="text-sm font-medium">סה״כ לקוחות לא פעילים</span>
              </div>
              <span className="font-semibold">
                {inactiveClients.length} לקוחות
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InactiveClientsAlert;
