
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Filter } from "lucide-react";

const Tasks = () => {
  const [newTask, setNewTask] = useState("");
  
  // Mock tasks data
  const tasks = [
    {
      id: "1",
      title: "הזמנת מלאי לק ג'ל",
      completed: false,
      priority: "גבוהה",
      category: "מלאי",
      dueDate: "08/04/2025",
    },
    {
      id: "2",
      title: "ניקוי מנורת UV",
      completed: false,
      priority: "רגילה",
      category: "תחזוקה",
      dueDate: "10/04/2025",
    },
    {
      id: "3",
      title: "התקשר ללקוחה חדשה",
      completed: true,
      priority: "רגילה",
      category: "לקוחות",
      dueDate: "05/04/2025",
    },
    {
      id: "4",
      title: "הזמנת אצטון",
      completed: false,
      priority: "גבוהה",
      category: "מלאי",
      dueDate: "08/04/2025",
    },
    {
      id: "5",
      title: "חידוש מכשיר לאקריליק",
      completed: false,
      priority: "נמוכה",
      category: "ציוד",
      dueDate: "20/04/2025",
    },
  ];

  const handleAddTask = () => {
    // Would add a new task in a real app
    setNewTask("");
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "גבוהה":
        return "destructive";
      case "רגילה":
        return "secondary";
      case "נמוכה":
        return "outline";
      default:
        return "secondary";
    }
  };

  // Count open tasks
  const openTasksCount = tasks.filter((task) => !task.completed).length;
  const highPriorityCount = tasks.filter(
    (task) => !task.completed && task.priority === "גבוהה"
  ).length;

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold mb-4">משימות</h1>
      <p className="text-muted-foreground mb-6">
        ניהול משימות יומיות ומעקב אחרי משימות דחופות.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">משימות פתוחות</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{openTasksCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">משימות בעדיפות גבוהה</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{highPriorityCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">משימות שהושלמו</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {tasks.filter((task) => task.completed).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <CardTitle>רשימת משימות</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 ml-1" />
                סינון
              </Button>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input
                  placeholder="הוסף משימה חדשה..."
                  className="w-full sm:w-[300px]"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <Button onClick={handleAddTask}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-start p-3 border rounded-lg hover:bg-accent/50 ${
                  task.completed ? "bg-accent/20" : ""
                }`}
              >
                <Checkbox
                  checked={task.completed}
                  className="mt-1 ml-2"
                  id={`task-${task.id}`}
                />
                <div className="flex-1">
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`font-medium cursor-pointer ${
                      task.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {task.title}
                  </label>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge variant={getPriorityBadgeVariant(task.priority)}>
                      {task.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {task.category} • לביצוע עד {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tasks;
