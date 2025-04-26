import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Search, 
  Calendar, 
  User, 
  AlertTriangle,
  Filter
} from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import TaskCard from "@/components/tasks/TaskCard";
import TaskForm from "@/components/tasks/TaskForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { TaskPriority, TaskStatus, Task, User as UserType } from "@/types/tasks";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | null>(null);
  const [selectedDueDate, setSelectedDueDate] = useState<string | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      
      try {
        let query = supabase
          .from('tasks')
          .select(`
            *,
            assigned_to_user:users!assigned_to(id, full_name, email, avatar_url),
            created_by_user:users!created_by(id, full_name)
          `)
          .order('created_at', { ascending: false });
          
        if (!isAdmin) {
          query = query.eq('assigned_to', user?.id);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setTasks(data || []);
        setFilteredTasks(data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast({
          title: "שגיאה בטעינת משימות",
          description: "אירעה שגיאה בטעינת המשימות. אנא נסה שוב מאוחר יותר",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, full_name, email, avatar_url, role')
          .order('full_name');
          
        if (error) {
          throw error;
        }
        
        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchTasks();
    fetchUsers();
    
    const tasksSubscription = supabase
      .channel('tasks-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'tasks'
        }, 
        (payload) => {
          console.log('Realtime update:', payload);
          fetchTasks();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(tasksSubscription);
    };
  }, [user?.id, isAdmin, toast]);
  
  useEffect(() => {
    let result = [...tasks];
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        task => 
          task.title.toLowerCase().includes(search) || 
          (task.description && task.description.toLowerCase().includes(search))
      );
    }
    
    if (selectedUser) {
      result = result.filter(task => task.assigned_to === selectedUser);
    }
    
    if (selectedPriority) {
      result = result.filter(task => task.priority === selectedPriority);
    }
    
    if (selectedDueDate) {
      if (selectedDueDate === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        result = result.filter(task => {
          if (!task.due_date) return false;
          const dueDate = new Date(task.due_date);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
      } else if (selectedDueDate === 'week') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const oneWeek = new Date(today);
        oneWeek.setDate(today.getDate() + 7);
        
        result = result.filter(task => {
          if (!task.due_date) return false;
          const dueDate = new Date(task.due_date);
          return dueDate >= today && dueDate <= oneWeek;
        });
      } else if (selectedDueDate === 'overdue') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        result = result.filter(task => {
          if (!task.due_date) return false;
          const dueDate = new Date(task.due_date);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate < today && task.status !== 'completed';
        });
      }
    }
    
    setFilteredTasks(result);
  }, [tasks, searchTerm, selectedUser, selectedPriority, selectedDueDate]);
  
  const handleOpenTaskForm = (task: Task | null = null) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };
  
  const handleTaskFormClose = () => {
    setEditingTask(null);
    setIsTaskFormOpen(false);
  };
  
  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', taskId);
      
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
    }
  };
  
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    handleStatusChange(taskId, status);
  };
  
  const openTasks = filteredTasks.filter(task => task.status === 'open');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in_progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');
  
  const shouldShowTaskForm = isTaskFormOpen || editingTask;
  
  return (
    <div dir="rtl" className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">משימות</h1>
          <p className="text-muted-foreground">
            ניהול משימות צוות ומעקב אחר ביצועים
          </p>
        </div>
        
        <Button 
          onClick={() => handleOpenTaskForm()}
          className="shrink-0"
        >
          <Plus className="ml-2 h-4 w-4" />
          משימה חדשה
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="w-full md:w-1/3">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="חיפוש משימות..."
                  className="pr-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <Select
                value={selectedUser || ""}
                onValueChange={(value) => setSelectedUser(value || null)}
              >
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="סינון לפי משתמש" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל המשתמשים</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={selectedPriority || ""}
                onValueChange={(value) => 
                  setSelectedPriority(value ? value as TaskPriority : null)
                }
              >
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="עדיפות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל העדיפויות</SelectItem>
                  <SelectItem value="high">גבוהה</SelectItem>
                  <SelectItem value="medium">בינונית</SelectItem>
                  <SelectItem value="low">נמוכה</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={selectedDueDate || ""}
                onValueChange={(value) => setSelectedDueDate(value || null)}
              >
                <SelectTrigger className="w-full md:w-36">
                  <SelectValue placeholder="תאריך יעד" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל התאריכים</SelectItem>
                  <SelectItem value="today">היום</SelectItem>
                  <SelectItem value="week">השבוע</SelectItem>
                  <SelectItem value="overdue">איחור</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedUser(null);
                  setSelectedPriority(null);
                  setSelectedDueDate(null);
                }}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">
              <p>טוען משימות...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className="space-y-4 p-4 bg-muted/30 rounded-lg"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'open')}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center">
                    <Badge variant="outline" className="mr-2 bg-yellow-100">
                      {openTasks.length}
                    </Badge>
                    משימות פתוחות
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {openTasks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-lg bg-background/50">
                      אין משימות פתוחות
                    </div>
                  ) : (
                    openTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={() => handleOpenTaskForm(task)}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        users={users}
                      />
                    ))
                  )}
                </div>
              </div>
              
              <div
                className="space-y-4 p-4 bg-muted/30 rounded-lg"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'in_progress')}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center">
                    <Badge variant="outline" className="mr-2 bg-blue-100">
                      {inProgressTasks.length}
                    </Badge>
                    בתהליך
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {inProgressTasks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-lg bg-background/50">
                      אין משימות בתהליך
                    </div>
                  ) : (
                    inProgressTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={() => handleOpenTaskForm(task)}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        users={users}
                      />
                    ))
                  )}
                </div>
              </div>
              
              <div
                className="space-y-4 p-4 bg-muted/30 rounded-lg"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'completed')}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center">
                    <Badge variant="outline" className="mr-2 bg-green-100">
                      {completedTasks.length}
                    </Badge>
                    הושלמו
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {completedTasks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-lg bg-background/50">
                      אין משימות שהושלמו
                    </div>
                  ) : (
                    completedTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={() => handleOpenTaskForm(task)}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        users={users}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {shouldShowTaskForm && (
        <TaskForm
          task={editingTask}
          onClose={handleTaskFormClose}
          users={users}
          isAdmin={isAdmin}
          currentUser={user}
        />
      )}
    </div>
  );
};

export default Tasks;
