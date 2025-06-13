
-- מחיקת כל המדיניות הקיימות על user_roles שגורמות למחזור אינסופי
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Users can insert their own roles" ON user_roles;
DROP POLICY IF EXISTS "Users can update their own roles" ON user_roles;
DROP POLICY IF EXISTS "Users can delete their own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;

-- יצירת פונקציה מאובטחת לבדיקת הרשאות מנהל
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = $1
    AND user_roles.role = 'admin'
  );
END;
$$;

-- יצירת מדיניות פשוטה לצפייה - רק מנהלים יכולים לראות תפקידים
CREATE POLICY "Only admins can view user roles"
ON user_roles FOR SELECT
TO authenticated
USING (public.is_admin_user(auth.uid()));

-- יצירת מדיניות פשוטה להכנסה - רק מנהלים יכולים להוסיף תפקידים
CREATE POLICY "Only admins can insert user roles"
ON user_roles FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_user(auth.uid()));

-- יצירת מדיניות פשוטה לעדכון - רק מנהלים יכולים לעדכן תפקידים
CREATE POLICY "Only admins can update user roles"
ON user_roles FOR UPDATE
TO authenticated
USING (public.is_admin_user(auth.uid()));

-- יצירת מדיניות פשוטה למחיקה - רק מנהלים יכולים למחוק תפקידים
CREATE POLICY "Only admins can delete user roles"
ON user_roles FOR DELETE
TO authenticated
USING (public.is_admin_user(auth.uid()));
