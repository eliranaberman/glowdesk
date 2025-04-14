
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id: string;
  full_name: string;
  avatar_url?: string;
}

interface UserBadgeProps {
  user: User;
  showAvatar?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const UserBadge = ({ user, showAvatar = true, size = 'md' }: UserBadgeProps) => {
  const getAvatarFallback = (name: string) => {
    if (!name) return '?';
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const getAvatarSize = () => {
    switch (size) {
      case 'sm': return 'size-6';
      case 'lg': return 'size-12';
      default: return 'size-8';
    }
  };

  if (!user) {
    return <span className="text-muted-foreground">-</span>;
  }

  if (!showAvatar) {
    return <span>{user.full_name}</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className={`${getAvatarSize()} bg-primary/10`}>
        <AvatarImage src={user.avatar_url} />
        <AvatarFallback>{getAvatarFallback(user.full_name)}</AvatarFallback>
      </Avatar>
      <span>{user.full_name}</span>
    </div>
  );
};

export default UserBadge;
