
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
  Filter,
  ArrowDown,
  ArrowUp,
  SquareKanban,
  Info
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
import { Skeleton } from "@/components/ui/skeleton";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | null>(null);
  const [selectedDueDate, setSelectedDueDate] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
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
          (task.description && task.description.toLowerCase().includes(search)) ||
          (task.assigned_to_user?.full_name.toLowerCase().includes(search))
      );
    }
    
    if (selectedUser && selectedUser !== "all") {
      result = result.filter(task => task.assigned_to === selectedUser);
    }
    
    if (selectedPriority && selectedPriority !== "all" as any) {
      result = result.filter(task => task.priority === selectedPriority);
    }
    
    if (selectedDueDate && selectedDueDate !== "all") {
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
    
    // Sort by due date if requested
    result.sort((a, b) => {
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return sortOrder === "asc" ? 1 : -1;
      if (!b.due_date) return sortOrder === "asc" ? -1 : 1;
      
      const dateA = new Date(a.due_date).getTime();
      const dateB = new Date(b.due_date).getTime();
      
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredTasks(result);
  }, [tasks, searchTerm, selectedUser, selectedPriority, selectedDueDate, sortOrder]);
  
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
    // Add some visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.4';
    }
  };
  
  const handleDragEnd = (e: React.DragEvent) => {
    // Reset opacity when drag ends
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    // Add visual feedback for drop target
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
    }
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    // Reset visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.backgroundColor = '';
    }
  };
  
  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    // Reset visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.backgroundColor = '';
    }
    
    const taskId = e.dataTransfer.getData('taskId');
    handleStatusChange(taskId, status);
  };
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  
  const openTasks = filteredTasks.filter(task => task.status === 'open');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in_progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');
  
  const shouldShowTaskForm = isTaskFormOpen || editingTask;
  
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((colIndex) => (
        <div key={colIndex} className="space-y-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-8 rounded-full" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((index) => (
              <div key={index} className="p-4 border rounded-lg bg-card">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-3" />
                <div className="flex justify-between items-center mt-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
  
  const renderEmptyState = (status: TaskStatus) => {
    const messages = {
      open: "אין משימות פתוחות. הוסף משימה חדשה!",
      in_progress: "אין משימות בתהליך כרגע.",
      completed: "אין משימות שהושלמו."
    };
    
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 text-muted-foreground border border-dashed rounded-lg bg-background/50 px-4">
        <Info className="mb-2 h-10 w-10 opacity-30" />
        <p>{messages[status]}</p>
        {status === 'open' && (
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => handleOpenTaskForm()}
          >
            <Plus className="ml-2 h-4 w-4" />
            צור משימה חדשה
          </Button>
        )}
      </div>
    );
  };
  
  return (
    <div dir="rtl" className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">ניהול משימות</h1>
          <p className="text-muted-foreground">
            נהל, עדכן וסגור משימות בצורה קלה ומהירה
          </p>
        </div>
        
        <Button 
          onClick={() => handleOpenTaskForm()}
          className="shrink-0"
          size="lg"
        >
          <Plus className="ml-2 h-5 w-5" />
          משימה חדשה
        </Button>
      </div>
      
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="w-full md:w-1/3">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="חיפוש משימות לפי כותרת, תיאור או משתמש..."
                  className="pr-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <Select
                value={selectedUser || "all"}
                onValueChange={(value) => setSelectedUser(value === "all" ? null : value)}
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
                value={selectedPriority || "all"}
                onValueChange={(value) => 
                  setSelectedPriority(value === "all" ? null : value as TaskPriority)
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
                value={selectedDueDate || "all"}
                onValueChange={(value) => setSelectedDueDate(value === "all" ? null : value)}
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
                onClick={toggleSortOrder}
                title="מיון לפי תאריך יעד"
              >
                {sortOrder === "asc" ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedUser(null);
                  setSelectedPriority(null);
                  setSelectedDueDate(null);
                  setSortOrder("asc");
                }}
                title="נקה סינון"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            renderSkeleton()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className="space-y-4 p-4 bg-muted/30 rounded-lg transition-colors duration-200"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'open')}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center">
                    <Badge variant="outline" className="mr-2 bg-yellow-100">
                      {openTasks.length}
                    </Badge>
                    <span className="flex items-center">
                      משימות פתוחות
                    </span>
                  </h3>
                </div>
                
                <div className="space-y-3 min-h-[200px]">
                  {openTasks.length === 0 ? (
                    renderEmptyState('open')
                  ) : (
                    openTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={() => handleOpenTaskForm(task)}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        users={users}
                      />
                    ))
                  )}
                </div>
              </div>
              
              <div
                className="space-y-4 p-4 bg-muted/30 rounded-lg transition-colors duration-200"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'in_progress')}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center">
                    <Badge variant="outline" className="mr-2 bg-blue-100">
                      {inProgressTasks.length}
                    </Badge>
                    <span className="flex items-center">
                      בתהליך
                    </span>
                  </h3>
                </div>
                
                <div className="space-y-3 min-h-[200px]">
                  {inProgressTasks.length === 0 ? (
                    renderEmptyState('in_progress')
                  ) : (
                    inProgressTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={() => handleOpenTaskForm(task)}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        users={users}
                      />
                    ))
                  )}
                </div>
              </div>
              
              <div
                className="space-y-4 p-4 bg-muted/30 rounded-lg transition-colors duration-200"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'completed')}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center">
                    <Badge variant="outline" className="mr-2 bg-green-100">
                      {completedTasks.length}
                    </Badge>
                    <span className="flex items-center">
                      הושלמו
                    </span>
                  </h3>
                </div>
                
                <div className="space-y-3 min-h-[200px]">
                  {completedTasks.length === 0 ? (
                    renderEmptyState('completed')
                  ) : (
                    completedTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={() => handleOpenTaskForm(task)}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
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
