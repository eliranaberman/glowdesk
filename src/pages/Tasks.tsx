import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, Filter, Search, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Helmet } from 'react-helmet-async';
import { EmptyStateWrapper } from '@/components/empty-states/EmptyStateWrapper';
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
  const [filteredTasks, setFilteredTasks] = useState<LocalTask[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
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
        }
      ];
      setTasks(sampleTasks);
      localStorage.setItem('tasks', JSON.stringify(sampleTasks));
    }
  }, []);

  // Filtering logic
  useEffect(() => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, filterStatus, filterPriority]);

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

  const toggleTaskStatus = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newStatus: TaskStatus = task.status === 'completed' ? 'open' : 'completed';
        return { ...task, status: newStatus };
      }
      return task;
    });
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

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'open': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'archived': return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  // Show empty state if no tasks
  if (tasks.length === 0) {
    return (
      <>
        <Helmet>
          <title>משימות | GlowDesk</title>
        </Helmet>
        <EmptyStateWrapper
          title="עדיין אין משימות"
          description="תתחילי לנהל את המשימות היומיות שלך - הוספת מלאי, יצירת תכנים, מעקב אחר לקוחות ועוד."
          actionText="הוסף משימה ראשונה"
          actionHref="#"
          helpText="המשימות יעזרו לך לא לפספס דברים חשובים ולנהל את העסק בצורה מסודרת"
        >
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full mt-4">
                <Plus className="h-4 w-4 mr-2" />
                הוסף משימה ראשונה
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>משימה חדשה</DialogTitle>
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
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
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
                
                <div className="flex gap-2 pt-4">
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
        </EmptyStateWrapper>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>משימות | GlowDesk</title>
      </Helmet>
      <div className="space-y-6" dir="rtl">
        {/* Header and filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">משימות</h1>
            <p className="text-muted-foreground">נהלי את המשימות היומיות שלך</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                משימה חדשה
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>משימה חדשה</DialogTitle>
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
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
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
                
                <div className="flex gap-2 pt-4">
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="חיפוש משימות..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="סטטוס: הכל" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">הכל</SelectItem>
                <SelectItem value="open">פתוח</SelectItem>
                <SelectItem value="in_progress">בתהליך</SelectItem>
                <SelectItem value="completed">הושלם</SelectItem>
                <SelectItem value="archived">בארכיון</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="עדיפות: הכל" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">הכל</SelectItem>
                <SelectItem value="low">נמוכה</SelectItem>
                <SelectItem value="medium">בינונית</SelectItem>
                <SelectItem value="high">גבוהה</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Task List */}
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <Card key={task.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.status === 'completed'}
                  onCheckedChange={() => toggleTaskStatus(task.id)}
                />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    {getStatusIcon(task.status)}
                    <span className="mr-1">{task.status}</span>
                  </div>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {task.description}
                </p>
                <div className="text-xs text-muted-foreground mt-4">
                  תאריך יעד: {format(task.dueDate, 'dd/MM/yyyy', { locale: he })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Tasks;
