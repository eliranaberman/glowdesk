
-- שלב 1: תיקון טבלת appointments - הוספת עמודת user_id וחיבור ל-customers
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- עדכון כל הרשומות הקיימות להשתמש ב-user_id מטבלת customers
UPDATE public.appointments 
SET user_id = (
  SELECT c.assigned_rep 
  FROM public.clients c 
  WHERE c.id = appointments.customer_id
) 
WHERE user_id IS NULL AND customer_id IS NOT NULL;

-- הפעלת RLS לטבלת appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- מדיניות לצפייה בפגישות (משתמשים רואים רק את הפגישות שלהם)
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
CREATE POLICY "Users can view their own appointments" 
ON public.appointments 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() IN (SELECT assigned_rep FROM public.clients WHERE id = customer_id)
);

-- מדיניות ליצירת פגישות
DROP POLICY IF EXISTS "Users can create their own appointments" ON public.appointments;
CREATE POLICY "Users can create their own appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- מדיניות לעדכון פגישות
DROP POLICY IF EXISTS "Users can update their own appointments" ON public.appointments;
CREATE POLICY "Users can update their own appointments" 
ON public.appointments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- מדיניות למחיקת פגישות
DROP POLICY IF EXISTS "Users can delete their own appointments" ON public.appointments;
CREATE POLICY "Users can delete their own appointments" 
ON public.appointments 
FOR DELETE 
USING (auth.uid() = user_id);

-- שלב 2: תיקון טבלת tasks - הסרת מדיניות חוסמת והוספת מדיניות נכונה
DROP POLICY IF EXISTS "Enable read access for all users" ON public.tasks;

-- הוספת עמודת user_id לטבלת tasks
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- עדכון רשומות קיימות
UPDATE public.tasks 
SET user_id = assigned_user_id 
WHERE user_id IS NULL AND assigned_user_id IS NOT NULL;

-- הפעלת RLS לטבלת tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- מדיניות לצפייה במשימות
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
CREATE POLICY "Users can view their own tasks" 
ON public.tasks 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = assigned_user_id);

-- מדיניות ליצירת משימות
DROP POLICY IF EXISTS "Users can create tasks" ON public.tasks;
CREATE POLICY "Users can create tasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- מדיניות לעדכון משימות
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
CREATE POLICY "Users can update their own tasks" 
ON public.tasks 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid() = assigned_user_id);

-- מדיניות למחיקת משימות
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;
CREATE POLICY "Users can delete their own tasks" 
ON public.tasks 
FOR DELETE 
USING (auth.uid() = user_id);

-- שלב 3: הוספת RLS לטבלאות נוספות שחסרות הגנה

-- טבלת clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- הוספת עמודת user_id לטבלת clients
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- עדכון רשומות קיימות
UPDATE public.clients 
SET user_id = assigned_rep 
WHERE user_id IS NULL AND assigned_rep IS NOT NULL;

-- מדיניות לטבלת clients
DROP POLICY IF EXISTS "Users can view their own clients" ON public.clients;
CREATE POLICY "Users can view their own clients" 
ON public.clients 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = assigned_rep);

DROP POLICY IF EXISTS "Users can create clients" ON public.clients;
CREATE POLICY "Users can create clients" 
ON public.clients 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own clients" ON public.clients;
CREATE POLICY "Users can update their own clients" 
ON public.clients 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid() = assigned_rep);

DROP POLICY IF EXISTS "Users can delete their own clients" ON public.clients;
CREATE POLICY "Users can delete their own clients" 
ON public.clients 
FOR DELETE 
USING (auth.uid() = user_id);

-- טבלת expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own expenses" ON public.expenses;
CREATE POLICY "Users can view their own expenses" 
ON public.expenses 
FOR SELECT 
USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can create expenses" ON public.expenses;
CREATE POLICY "Users can create expenses" 
ON public.expenses 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update their own expenses" ON public.expenses;
CREATE POLICY "Users can update their own expenses" 
ON public.expenses 
FOR UPDATE 
USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can delete their own expenses" ON public.expenses;
CREATE POLICY "Users can delete their own expenses" 
ON public.expenses 
FOR DELETE 
USING (auth.uid() = created_by);

-- טבלת inventory_items
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own inventory items" ON public.inventory_items;
CREATE POLICY "Users can view their own inventory items" 
ON public.inventory_items 
FOR SELECT 
USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can create inventory items" ON public.inventory_items;
CREATE POLICY "Users can create inventory items" 
ON public.inventory_items 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update their own inventory items" ON public.inventory_items;
CREATE POLICY "Users can update their own inventory items" 
ON public.inventory_items 
FOR UPDATE 
USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can delete their own inventory items" ON public.inventory_items;
CREATE POLICY "Users can delete their own inventory items" 
ON public.inventory_items 
FOR DELETE 
USING (auth.uid() = created_by);

-- טבלת revenues
ALTER TABLE public.revenues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own revenues" ON public.revenues;
CREATE POLICY "Users can view their own revenues" 
ON public.revenues 
FOR SELECT 
USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can create revenues" ON public.revenues;
CREATE POLICY "Users can create revenues" 
ON public.revenues 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update their own revenues" ON public.revenues;
CREATE POLICY "Users can update their own revenues" 
ON public.revenues 
FOR UPDATE 
USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can delete their own revenues" ON public.revenues;
CREATE POLICY "Users can delete their own revenues" 
ON public.revenues 
FOR DELETE 
USING (auth.uid() = created_by);

-- טבלת client_activity
ALTER TABLE public.client_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own client activity" ON public.client_activity;
CREATE POLICY "Users can view their own client activity" 
ON public.client_activity 
FOR SELECT 
USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can create client activity" ON public.client_activity;
CREATE POLICY "Users can create client activity" 
ON public.client_activity 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update their own client activity" ON public.client_activity;
CREATE POLICY "Users can update their own client activity" 
ON public.client_activity 
FOR UPDATE 
USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can delete their own client activity" ON public.client_activity;
CREATE POLICY "Users can delete their own client activity" 
ON public.client_activity 
FOR DELETE 
USING (auth.uid() = created_by);

-- טבלת client_services
ALTER TABLE public.client_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own client services" ON public.client_services;
CREATE POLICY "Users can view their own client services" 
ON public.client_services 
FOR SELECT 
USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can create client services" ON public.client_services;
CREATE POLICY "Users can create client services" 
ON public.client_services 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update their own client services" ON public.client_services;
CREATE POLICY "Users can update their own client services" 
ON public.client_services 
FOR UPDATE 
USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can delete their own client services" ON public.client_services;
CREATE POLICY "Users can delete their own client services" 
ON public.client_services 
FOR DELETE 
USING (auth.uid() = created_by);

-- שלב 4: טבלאות שכבר מוגנות באופן חלקי - עדכון מדיניות
-- הוספת מדיניות חסרות לטבלאות קיימות

-- טבלת calendar_connections
DROP POLICY IF EXISTS "Users can update their own calendar connections" ON public.calendar_connections;
CREATE POLICY "Users can update their own calendar connections" 
ON public.calendar_connections 
FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own calendar connections" ON public.calendar_connections;
CREATE POLICY "Users can delete their own calendar connections" 
ON public.calendar_connections 
FOR DELETE 
USING (auth.uid() = user_id);

-- טבלת notification_preferences
DROP POLICY IF EXISTS "Users can update their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can update their own notification preferences" 
ON public.notification_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can delete their own notification preferences" 
ON public.notification_preferences 
FOR DELETE 
USING (auth.uid() = user_id);

-- טבלת reports
DROP POLICY IF EXISTS "Users can update their own reports" ON public.reports;
CREATE POLICY "Users can update their own reports" 
ON public.reports 
FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reports" ON public.reports;
CREATE POLICY "Users can delete their own reports" 
ON public.reports 
FOR DELETE 
USING (auth.uid() = user_id);

-- טבלת portfolio_items
DROP POLICY IF EXISTS "Users can update their own portfolio items" ON public.portfolio_items;
CREATE POLICY "Users can update their own portfolio items" 
ON public.portfolio_items 
FOR UPDATE 
USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can delete their own portfolio items" ON public.portfolio_items;
CREATE POLICY "Users can delete their own portfolio items" 
ON public.portfolio_items 
FOR DELETE 
USING (auth.uid() = created_by);
