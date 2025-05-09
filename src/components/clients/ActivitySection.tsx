
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ClientActivity } from '@/types/clients';
import ClientActivityList from './ClientActivityList';
import { Plus } from 'lucide-react';

interface ActivitySectionProps {
  clientId: string;
  activities: ClientActivity[];
}

const ActivitySection = ({ clientId, activities }: ActivitySectionProps) => {
  const navigate = useNavigate();

  const handleAddActivity = () => {
    navigate(`/clients/${clientId}/activity/new`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>פעילות לקוח</CardTitle>
          <CardDescription>היסטוריית פעילות ומעקב אחרי הלקוח</CardDescription>
        </div>
        <Button 
          onClick={handleAddActivity}
          variant="soft"
          className="flex gap-2"
        >
          <Plus className="size-4" />
          פעילות חדשה
        </Button>
      </CardHeader>
      <CardContent>
        <ClientActivityList activities={activities} />
      </CardContent>
    </Card>
  );
};

export default ActivitySection;
