
-- תיקון נוסף למדיניות user_roles למניעת recursion
-- מחיקת מדיניות בעייתיות שעלולות ליצור recursion
DROP POLICY IF EXISTS "Only admins can view user roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can insert user roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can update user roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can delete user roles" ON user_roles;
DROP POLICY IF EXISTS "Authenticated users can view user roles" ON user_roles;

-- יצירת מדיניות פשוטה שמאפשרת לכל המשתמשים המאומתים לקרוא תפקידים
-- זה ימנע recursion ויאפשר לפונקציות לעבוד
CREATE POLICY "Authenticated users can read roles"
ON user_roles FOR SELECT
TO authenticated
USING (true);

-- רק מנהלים יכולים לנהל תפקידים - בלי שימוש בפונקציות מורכבות
CREATE POLICY "Service role can manage user roles"
ON user_roles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
