
-- הסרת כל המדיניות הקיימות שגורמות למחזור אינסופי
DROP POLICY IF EXISTS "Only admins can view user roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can insert user roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can update user roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can delete user roles" ON user_roles;

-- יצירת מדיניות פשוטה שמאפשרת לכל המשתמשים המאומתים לקרוא תפקידים
-- זה ימנע את המחזור האינסופי ויאפשר לפונקציות לעבוד
CREATE POLICY "Authenticated users can view user roles"
ON user_roles FOR SELECT
TO authenticated
USING (true);

-- רק מנהלים יכולים להוסיף תפקידים - נשתמש בפונקציה קיימת
CREATE POLICY "Only admins can insert user roles"
ON user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- רק מנהלים יכולים לעדכן תפקידים
CREATE POLICY "Only admins can update user roles"
ON user_roles FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- רק מנהלים יכולים למחוק תפקידים
CREATE POLICY "Only admins can delete user roles"
ON user_roles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
