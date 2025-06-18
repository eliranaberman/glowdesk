
-- 1. עדכון פונקציית has_permission
CREATE OR REPLACE FUNCTION public.has_permission(user_id uuid, resource text, required_permission text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  user_has_permission BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    WHERE ur.user_id = $1
    AND rp.resource = $2
    AND rp.permission = $3
  ) INTO user_has_permission;
  
  RETURN user_has_permission;
END;
$function$;

-- 2. עדכון פונקציית has_role
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, required_role text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = $1
    AND user_roles.role = $2
  );
END;
$function$;

-- 3. עדכון פונקציית is_admin_user
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = $1
    AND user_roles.role = 'admin'
  );
END;
$function$;

-- 4. עדכון פונקציית update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$function$;

-- 5. עדכון פונקציית update_modified_column
CREATE OR REPLACE FUNCTION public.update_modified_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;
