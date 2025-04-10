
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { User, Task, TaskPriority, TaskStatus } from "@/types/tasks";

interface TaskFormProps {
  task: Task | null;
  onClose: () => void;
  users: User[];
  isAdmin: boolean;
  currentUser: any;
}

const taskSchema = z.object({
  title: z.string().min(3, "שם המשימה חייב להכיל לפחות 3 תווים"),
  description: z.string().optional(),
  assigned_to: z.string().min(1, "יש לבחור משתמש"),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["open", "in_progress", "completed", "archived"]),
  due_date: z.date().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

const TaskForm = ({ task, onClose, users, isAdmin, currentUser }: TaskFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const defaultValues: Partial<TaskFormValues> = {
    title: "",
    description: "",
    assigned_to: currentUser?.id || "",
    priority: "medium",
    status: "open",
  };
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });
  
  // Set form values when editing a task
  useEffect(() => {
    if (task) {
      const dueDate = task.due_date ? new Date(task.due_date) : undefined;
      
      form.reset({
        title: task.title,
        description: task.description || "",
        assigned_to: task.assigned_to,
        priority: task.priority as TaskPriority,
        status: task.status as TaskStatus,
        due_date: dueDate,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [task, form]);
  
  const onSubmit = async (values: TaskFormValues) => {
    try {
      setIsLoading(true);
      
      const now = new Date().toISOString();
      const taskData = {
        title: values.title,
        description: values.description || null,
        assigned_to: values.assigned_to,
        priority: values.priority,
        status: values.status,
        due_date: values.due_date ? values.due_date.toISOString().split('T')[0] : null,
      };
      
      let result;
      
      if (task) {
        // Update existing task
        result = await supabase
          .from('tasks')
          .update({
            ...taskData,
            updated_at: now,
          })
          .eq('id', task.id);
      } else {
        // Create new task
        result = await supabase
          .from('tasks')
          .insert({
            ...taskData,
            created_by: currentUser?.id,
            created_at: now,
            updated_at: now,
          });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast({
        title: task ? "המשימה עודכנה" : "המשימה נוצרה",
        description: task ? "המשימה עודכנה בהצלחה" : "המשימה נוצרה בהצלחה",
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      toast({
        title: "שגיאה בשמירת המשימה",
        description: "אירעה שגיאה בשמירת המשימה. אנא נסה שוב",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {task ? "עריכת משימה" : "משימה חדשה"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>שם המשימה</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="הזן שם משימה" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>תיאור</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="הזן תיאור למשימה"
                      className="min-h-[100px]"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="assigned_to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>משויך ל</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                    disabled={!isAdmin && !!task}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר משתמש" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>עדיפות</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר עדיפות" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">גבוהה</SelectItem>
                        <SelectItem value="medium">בינונית</SelectItem>
                        <SelectItem value="low">נמוכה</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>סטטוס</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר סטטוס" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="open">פתוח</SelectItem>
                        <SelectItem value="in_progress">בתהליך</SelectItem>
                        <SelectItem value="completed">הושלם</SelectItem>
                        <SelectItem value="archived">בארכיון</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>תאריך יעד</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-right font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: he })
                          ) : (
                            <span>בחר תאריך</span>
                          )}
                          <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
              >
                ביטול
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "שומר..." : task ? "עדכן משימה" : "צור משימה"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
