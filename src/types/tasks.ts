
export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'archived';

export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  assigned_to_user?: User;
  created_by?: string;
  created_by_user?: User;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string;
  created_at: string;
  updated_at: string;
}
