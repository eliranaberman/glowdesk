
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MoreVertical, 
  Calendar, 
  Edit, 
  Trash2,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Task, User } from "@/types/tasks";

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDragStart: (e: React.DragEvent) => void;
  users: User[];
}

const TaskCard = ({ task, onEdit, onDragStart, users }: TaskCardProps) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Get initial letter for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const getPriorityColor = (priority: string): string => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700 hover:bg-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 hover:bg-orange-200';
      case 'low': return 'bg-green-100 text-green-700 hover:bg-green-200';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };
  
  const getPriorityLabel = (priority: string): string => {
    switch(priority) {
      case 'high': return 'גבוהה';
      case 'medium': return 'בינונית';
      case 'low': return 'נמוכה';
      default: return 'לא ידוע';
    }
  };
  
  const formatDueDate = (dateString?: string) => {
    if (!dateString) return "אין תאריך";
    
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: he });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };
  
  const isDueDateToday = (dateString?: string): boolean => {
    if (!dateString) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    
    return today.getTime() === dueDate.getTime();
  };
  
  const isDueDateOverdue = (dateString?: string): boolean => {
    if (!dateString) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today && task.status !== 'completed';
  };
  
  const handleStatusChange = async (newStatus: 'open' | 'in_progress' | 'completed' | 'archived') => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', task.id);
        
      if (error) throw error;
      
      toast({
        title: "סטטוס משימה עודכן",
        description: "סטטוס המשימה עודכן בהצלחה",
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "שגיאה בעדכון סטטוס",
        description: "אירעה שגיאה בעדכון סטטוס המשימה",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteTask = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', task.id);
        
      if (error) throw error;
      
      toast({
        title: "המשימה נמחקה",
        description: "המשימה נמחקה בהצלחה",
      });
      
      setConfirmDelete(false);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "שגיאה במחיקת משימה",
        description: "אירעה שגיאה במחיקת המשימה",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const assignedUser = task.assigned_to_user || 
    users.find(u => u.id === task.assigned_to);
  
  return (
    <>
      <Card 
        className={`p-4 hover:shadow-md transition-all duration-200 cursor-move ${
          isDueDateOverdue(task.due_date) ? 'border-red-300 border-2' : ''
        }`}
        draggable
        onDragStart={onDragStart}
      >
        <div className="flex justify-between items-start">
          <h4 className="font-medium mb-2 flex-1">{task.title}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="ml-2 h-4 w-4" />
                ערוך
              </DropdownMenuItem>
              {task.status !== 'completed' && (
                <DropdownMenuItem 
                  onClick={() => handleStatusChange('completed')}
                  disabled={loading}
                >
                  <CheckCircle className="ml-2 h-4 w-4" />
                  סמן כהושלם
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => setConfirmDelete(true)}
                className="text-red-600"
                disabled={loading}
              >
                <Trash2 className="ml-2 h-4 w-4" />
                מחק
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {task.description || "אין תיאור"}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <Badge className={getPriorityColor(task.priority)}>
            {getPriorityLabel(task.priority)}
          </Badge>
          
          {assignedUser && (
            <div className="flex items-center" title={assignedUser.full_name}>
              <Avatar className="h-6 w-6">
                <AvatarImage src={assignedUser.avatar_url} />
                <AvatarFallback className="text-xs">
                  {getInitials(assignedUser.full_name)}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
        
        <div className="mt-3 pt-2 border-t flex items-center text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 ml-1" />
          <span className={`${
            isDueDateToday(task.due_date) 
              ? 'text-yellow-600 font-medium' 
              : isDueDateOverdue(task.due_date) 
                ? 'text-red-600 font-medium'
                : ''
          }`}>
            {formatDueDate(task.due_date)}
          </span>
        </div>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>האם למחוק את המשימה?</DialogTitle>
            <DialogDescription>
              פעולה זו אינה ניתנת לביטול. משימה זו תימחק לצמיתות.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setConfirmDelete(false)}
              disabled={loading}
            >
              ביטול
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTask}
              disabled={loading}
            >
              {loading ? "מוחק..." : "מחק משימה"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCard;
