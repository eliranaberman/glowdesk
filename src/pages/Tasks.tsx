
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Helmet } from 'react-helmet-async';
import { TaskPriority, TaskStatus } from '@/types/tasks';

interface LocalTask {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  category: 'client' | 'inventory' | 'marketing' | 'other';
}

const Tasks = () => {
  const [tasks, setTasks] = useState<LocalTask[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as TaskPriority,
    category: 'other' as LocalTask['category']
  });

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate)
      }));
      setTasks(parsedTasks);
    } else {
      // Add some sample tasks for demonstration
      const sampleTasks: LocalTask[] = [
        {
          id: '1',
          title: 'הזמנת חומרי גלם חדשים',
          description: 'להזמין לק ג\'ל חדש ואצטון',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          priority: 'high' as TaskPriority,
          status: 'open' as TaskStatus,
          category: 'inventory'
        },
        {
          id: '2',
          title: 'יצירת פוסט לאינסטגרם',
          description: 'פוסט על העבודה החדשה עם שרה',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          priority: 'medium' as TaskPriority,
          status: 'in_progress' as TaskStatus,
          category: 'marketing'
        },
        {
          id: '3',
          title: 'עדכון אתר',
          description: 'להוסיף תמונות חדשות לגלריה',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          priority: 'low' as TaskPriority,
          status: 'completed' as TaskStatus,
          category: 'marketing'
        }
      ];
      setTasks(sampleTasks);
      localStorage.setItem('tasks', JSON.stringify(sampleTasks));
    }
  }, []);

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task: LocalTask = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : new Date(),
      priority: newTask.priority,
      status: 'open' as TaskStatus,
      category: newTask.category
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      category: 'other'
    });
    setIsAddDialogOpen(false);
  };

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPriorityText = (priority: TaskPriority) => {
    switch (priority) {
      case 'high': return 'גבוהה';
      case 'medium': return 'בינונית';
      case 'low': return 'נמוכה';
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const TaskCard = ({ task }: { task: LocalTask }) => (
    <Card className="mb-3 cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
          <Badge className={getPriorityColor(task.priority)}>
            {getPriorityText(task.priority)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {task.description && (
          <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
        )}
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          {format(task.dueDate, 'dd/MM', { locale: he })}
        </div>
        <div className="flex gap-1 mt-2">
          {task.status !== 'open' && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-6"
              onClick={() => moveTask(task.id, 'open')}
            >
              פתוח
            </Button>
          )}
          {task.status !== 'in_progress' && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-6"
              onClick={() => moveTask(task.id, 'in_progress')}
            >
              בתהליך
            </Button>
          )}
          {task.status !== 'completed' && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-6"
              onClick={() => moveTask(task.id, 'completed')}
            >
              הושלם
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>משימות | GlowDesk</title>
      </Helmet>
      <div className="space-y-6 p-4" dir="rtl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">משימות</h1>
            <p className="text-muted-foreground">נהלי את המשימות היומיות שלך</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                משימה חדשה
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-sm sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center">משימה חדשה</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">כותרת המשימה</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="לדוגמה: הזמנת חומרי גלם"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">תיאור (אופציונלי)</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="תיאור נוסף על המשימה..."
                    className="min-h-[60px]"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">עדיפות</Label>
                    <Select value={newTask.priority} onValueChange={(value: TaskPriority) => setNewTask(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">נמוכה</SelectItem>
                        <SelectItem value="medium">בינונית</SelectItem>
                        <SelectItem value="high">גבוהה</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="category">קטגוריה</Label>
                    <Select value={newTask.category} onValueChange={(value: LocalTask['category']) => setNewTask(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">לקוחות</SelectItem>
                        <SelectItem value="inventory">מלאי</SelectItem>
                        <SelectItem value="marketing">שיווק</SelectItem>
                        <SelectItem value="other">אחר</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="dueDate">תאריך יעד</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button onClick={handleAddTask} className="flex-1">
                    הוסף משימה
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    ביטול
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Task Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Open Tasks */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-center">
              משימות פתוחות ({getTasksByStatus('open').length})
            </h2>
            <div className="min-h-[200px] bg-gray-50 rounded-lg p-4">
              {getTasksByStatus('open').map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              {getTasksByStatus('open').length === 0 && (
                <p className="text-center text-muted-foreground">אין משימות פתוחות</p>
              )}
            </div>
          </div>

          {/* In Progress Tasks */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-center">
              בתהליך ({getTasksByStatus('in_progress').length})
            </h2>
            <div className="min-h-[200px] bg-blue-50 rounded-lg p-4">
              {getTasksByStatus('in_progress').map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              {getTasksByStatus('in_progress').length === 0 && (
                <p className="text-center text-muted-foreground">אין משימות בתהליך</p>
              )}
            </div>
          </div>

          {/* Completed Tasks */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-center">
              הושלמו ({getTasksByStatus('completed').length})
            </h2>
            <div className="min-h-[200px] bg-green-50 rounded-lg p-4">
              {getTasksByStatus('completed').map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              {getTasksByStatus('completed').length === 0 && (
                <p className="text-center text-muted-foreground">אין משימות שהושלמו</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tasks;
