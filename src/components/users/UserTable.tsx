
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { 
  MoreHorizontal, 
  Shield, 
  User, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Settings,
  Scissors,
  Briefcase,
  UserPlus,
  UserCheck,
  UserX 
} from 'lucide-react';
import { UserWithRoles } from '@/services/userRolesService';

interface UserTableProps {
  users: UserWithRoles[];
  onRoleChange: (userId: string, role: string, isAdding: boolean) => Promise<void>;
  currentUserId?: string;
}

const UserTable = ({ users, onRoleChange, currentUserId }: UserTableProps) => {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    userId: string;
    username: string;
    action: string;
    role?: string;
    isAdding?: boolean;
  }>({
    isOpen: false,
    userId: '',
    username: '',
    action: '',
  });

  const handleRoleAction = (userId: string, username: string, role: string, isAdding: boolean) => {
    setConfirmDialog({
      isOpen: true,
      userId,
      username,
      action: isAdding ? 'add' : 'remove',
      role,
      isAdding,
    });
  };

  const confirmRoleAction = async () => {
    if (confirmDialog.role && confirmDialog.userId) {
      await onRoleChange(
        confirmDialog.userId, 
        confirmDialog.role, 
        confirmDialog.isAdding || false
      );
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'owner':
        return 'default';
      case 'employee':
        return 'secondary';
      case 'social_manager':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-3 w-3 ml-1" />;
      case 'owner':
        return <Briefcase className="h-3 w-3 ml-1" />;
      case 'employee':
        return <User className="h-3 w-3 ml-1" />;
      case 'social_manager':
        return <Scissors className="h-3 w-3 ml-1" />;
      default:
        return null;
    }
  };

  const getFormattedDate = (dateString?: string) => {
    if (!dateString) return 'לא זמין';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">שם מלא</TableHead>
            <TableHead className="text-right">אימייל</TableHead>
            <TableHead className="text-right">תפקידים</TableHead>
            <TableHead className="text-right">תאריך הצטרפות</TableHead>
            <TableHead className="text-right">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.full_name || 'לא הוגדר'}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.roles.length === 0 ? (
                    <span className="text-muted-foreground text-sm">ללא תפקיד</span>
                  ) : (
                    user.roles.map((role) => (
                      <TooltipProvider key={role}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant={getRoleBadgeVariant(role)} className="text-xs">
                              {getRoleIcon(role)}
                              {role}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p dir="rtl">
                              {role === 'admin' && 'מנהל מערכת - גישה מלאה'}
                              {role === 'owner' && 'בעל עסק - גישה מלאה'}
                              {role === 'employee' && 'עובד - גישה חלקית'}
                              {role === 'social_manager' && 'מנהל סושיאל - גישה לניהול סושיאל'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {format(new Date(user.created_at || Date.now()), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild disabled={user.id === currentUserId}>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">פתח תפריט</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>ערוך משתמש</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Role Management */}
                    <DropdownMenuItem 
                      onClick={() => handleRoleAction(user.id, user.full_name || user.email, 'admin', !user.roles.includes('admin'))}
                      className={user.roles.includes('admin') ? 'text-destructive' : ''}
                    >
                      {user.roles.includes('admin') ? (
                        <>
                          <UserX className="mr-2 h-4 w-4" />
                          <span>הסר הרשאות מנהל</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          <span>הפוך למנהל מערכת</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => handleRoleAction(user.id, user.full_name || user.email, 'employee', !user.roles.includes('employee'))}
                      className={user.roles.includes('employee') ? 'text-destructive' : ''}
                    >
                      {user.roles.includes('employee') ? (
                        <>
                          <UserX className="mr-2 h-4 w-4" />
                          <span>הסר הרשאות עובד</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="mr-2 h-4 w-4" />
                          <span>הפוך לעובד</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => handleRoleAction(user.id, user.full_name || user.email, 'social_manager', !user.roles.includes('social_manager'))}
                      className={user.roles.includes('social_manager') ? 'text-destructive' : ''}
                    >
                      {user.roles.includes('social_manager') ? (
                        <>
                          <UserX className="mr-2 h-4 w-4" />
                          <span>הסר הרשאות מנהל סושיאל</span>
                        </>
                      ) : (
                        <>
                          <Scissors className="mr-2 h-4 w-4" />
                          <span>הפוך למנהל סושיאל</span>
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, isOpen: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.action === 'add' ? 'הוספת תפקיד' : 'הסרת תפקיד'}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.action === 'add' 
                ? `האם להוסיף את התפקיד ${confirmDialog.role} למשתמש ${confirmDialog.username}?` 
                : `האם להסיר את התפקיד ${confirmDialog.role} מהמשתמש ${confirmDialog.username}?`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}>
              ביטול
            </Button>
            <Button 
              variant={confirmDialog.action === 'add' ? 'default' : 'destructive'}
              onClick={confirmRoleAction}
            >
              {confirmDialog.action === 'add' ? 'הוסף' : 'הסר'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserTable;
