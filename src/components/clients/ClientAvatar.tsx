
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Client } from '@/types/clients';

interface ClientAvatarProps {
  client: Client;
  size?: string;
}

const ClientAvatar = ({ client, size = "size-8" }: ClientAvatarProps) => {
  const getAvatarFallback = (client: Client) => {
    if (!client.full_name) return '?';
    const nameParts = client.full_name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return client.full_name[0].toUpperCase();
  };

  return (
    <Avatar className={`${size} bg-primary/10`}>
      <AvatarImage src={client.assigned_rep_user?.avatar_url} />
      <AvatarFallback>{getAvatarFallback(client)}</AvatarFallback>
    </Avatar>
  );
};

export default ClientAvatar;
