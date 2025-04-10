
import { useState } from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  MoreHorizontal, 
  Shield, 
  UserX, 
  Trash2, 
  UserCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { User } from '@/pages/UserManagement';
import { useIsMobile } from '@/hooks/use-mobile';

interface UserTableProps {
  users: User[];
  onUserAction: (actionType: string, userId: string) => Promise<void>;
}

const UserTable = ({ users, onUserAction }: UserTableProps) => {
  const isMobile = useIsMobile();
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentAction, setCurrentAction] = useState<{
    type: string;
    userId: string;
    title: string;
    description: string;
    confirmText: string;
  } | null>(null);

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Sort users
  const sortedUsers = [...users].sort((a, b) => {
    let valueA, valueB;

    switch (sortBy) {
      case 'name':
        valueA = a.user_metadata?.full_name || '';
        valueB = b.user_metadata?.full_name || '';
        break;
      case 'email':
        valueA = a.email;
        valueB = b.email;
        break;
      case 'role':
        valueA = a.app_metadata?.role || 'user';
        valueB = b.app_metadata?.role || 'user';
        break;
      case 'status':
        valueA = a.banned_until ? 'inactive' : 'active';
        valueB = b.banned_until ? 'inactive' : 'active';
        break;
      default: // created_at
        valueA = new Date(a.created_at).getTime();
        valueB = new Date(b.created_at).getTime();
        break;
    }

    const comparison = typeof valueA === 'string'
      ? valueA.localeCompare(valueB as string)
      : (valueA as number) - (valueB as number);

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Prepare a confirmation dialog
  const prepareAction = (type: string, userId: string) => {
    let dialogContent = {
      title: '',
      description: '',
      confirmText: '',
    };

    switch (type) {
      case 'deactivate':
        dialogContent = {
          title: 'השבתת חשבון',
          description: 'האם אתה בטוח שברצונך להשבית את חשבון המשתמש הזה? המשתמש לא יוכל להתחבר למערכת עד להפעלה מחדש.',
          confirmText: 'השבת חשבון',
        };
        break;
      case 'activate':
        dialogContent = {
          title: 'הפעלת חשבון',
          description: 'האם אתה בטוח שברצונך להפעיל מחדש את חשבון המשתמש הזה?',
          confirmText: 'הפעל חשבון',
        };
        break;
      case 'promote':
        dialogContent = {
          title: 'קידום לדרגת מנהל',
          description: 'האם אתה בטוח שברצונך לקדם את המשתמש הזה לדרגת מנהל? מנהלים יכולים לצפות ולנהל את כל המשתמשים במערכת.',
          confirmText: 'קדם למנהל',
        };
        break;
      case 'delete':
        dialogContent = {
          title: 'מחיקת חשבון',
          description: 'האם אתה בטוח שברצונך למחוק את חשבון המשתמש הזה לצמיתות? פעולה זו אינה ניתנת לביטול.',
          confirmText: 'מחק חשבון',
        };
        break;
      default:
        break;
    }

    setCurrentAction({
      type,
      userId,
      ...dialogContent,
    });
    setShowConfirmDialog(true);
  };

  // Handle confirmation
  const handleConfirm = async () => {
    if (currentAction) {
      await onUserAction(currentAction.type, currentAction.userId);
    }
    setShowConfirmDialog(false);
    setCurrentAction(null);
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center">
                שם מלא
                {sortBy === 'name' && (
                  sortOrder === 'asc' ? 
                    <ChevronUp className="h-4 w-4 mr-1" /> : 
                    <ChevronDown className="h-4 w-4 mr-1" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => handleSort('email')}
            >
              <div className="flex items-center">
                אימייל
                {sortBy === 'email' && (
                  sortOrder === 'asc' ? 
                    <ChevronUp className="h-4 w-4 mr-1" /> : 
                    <ChevronDown className="h-4 w-4 mr-1" />
                )}
              </div>
            </TableHead>
            {!isMobile && (
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  סטטוס
                  {sortBy === 'status' && (
                    sortOrder === 'asc' ? 
                      <ChevronUp className="h-4 w-4 mr-1" /> : 
                      <ChevronDown className="h-4 w-4 mr-1" />
                  )}
                </div>
              </TableHead>
            )}
            {!isMobile && (
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center">
                  תאריך הרשמה
                  {sortBy === 'created_at' && (
                    sortOrder === 'asc' ? 
                      <ChevronUp className="h-4 w-4 mr-1" /> : 
                      <ChevronDown className="h-4 w-4 mr-1" />
                  )}
                </div>
              </TableHead>
            )}
            <TableHead 
              className="cursor-pointer" 
              onClick={() => handleSort('role')}
            >
              <div className="flex items-center">
                תפקיד
                {sortBy === 'role' && (
                  sortOrder === 'asc' ? 
                    <ChevronUp className="h-4 w-4 mr-1" /> : 
                    <ChevronDown className="h-4 w-4 mr-1" />
                )}
              </div>
            </TableHead>
            <TableHead className="text-left">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.user_metadata?.full_name || 'משתמש ללא שם'}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              {!isMobile && (
                <TableCell>
                  <Badge 
                    variant={user.banned_until ? "destructive" : "success"}
                    className="font-normal"
                  >
                    {user.banned_until ? 'לא פעיל' : 'פעיל'}
                  </Badge>
                </TableCell>
              )}
              {!isMobile && (
                <TableCell>
                  {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: he })}
                </TableCell>
              )}
              <TableCell>
                <Badge 
                  variant={user.app_metadata?.role === 'admin' ? "default" : "outline"}
                  className="font-normal"
                >
                  {user.app_metadata?.role === 'admin' ? 'מנהל' : 'משתמש'}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">פתח תפריט</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {user.banned_until ? (
                      <DropdownMenuItem 
                        onClick={() => prepareAction('activate', user.id)}
                        className="gap-2"
                      >
                        <UserCheck className="h-4 w-4" />
                        <span>הפעל משתמש</span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem 
                        onClick={() => prepareAction('deactivate', user.id)}
                        className="gap-2"
                      >
                        <UserX className="h-4 w-4" />
                        <span>השבת משתמש</span>
                      </DropdownMenuItem>
                    )}
                    
                    {user.app_metadata?.role !== 'admin' && (
                      <DropdownMenuItem 
                        onClick={() => prepareAction('promote', user.id)}
                        className="gap-2"
                      >
                        <Shield className="h-4 w-4" />
                        <span>קדם למנהל</span>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      onClick={() => prepareAction('delete', user.id)}
                      className="text-destructive gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>מחק משתמש</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{currentAction?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {currentAction?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={
                currentAction?.type === 'delete' ? 'bg-destructive hover:bg-destructive/90' : ''
              }
            >
              {currentAction?.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserTable;
