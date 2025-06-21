
-- Add missing fields to clients table
ALTER TABLE public.clients 
ADD COLUMN preferred_treatment TEXT,
ADD COLUMN visit_count INTEGER DEFAULT 0;

-- Update existing clients with sample data
UPDATE public.clients SET 
  preferred_treatment = 'לק ג''ל',
  visit_count = 1
WHERE preferred_treatment IS NULL;

-- Insert 15 sample Israeli clients with realistic data
INSERT INTO public.clients (
  user_id, 
  full_name, 
  phone_number, 
  email, 
  preferred_treatment, 
  registration_date, 
  notes, 
  visit_count, 
  status,
  assigned_rep
) VALUES 
  (auth.uid(), 'שיר כהן', '054-1234567', 'shir.cohen@gmail.com', 'בניית ציפורניים', '2024-02-10', 'לקוחה חדשה, מעוניינת בטיפולים קבועים', 3, 'active', auth.uid()),
  (auth.uid(), 'נועה לוי', '052-9876543', 'noa.levi@walla.co.il', 'לק ג''ל', '2024-01-15', 'אלרגית לחומרים מסוימים', 8, 'active', auth.uid()),
  (auth.uid(), 'תמר אברהם', '053-5551234', 'tamar.avraham@hotmail.com', 'פדיקור', '2024-03-22', 'מגיעה כל שבועיים', 12, 'active', auth.uid()),
  (auth.uid(), 'מיכל רוזן', '058-7778899', 'michal.rosen@gmail.com', 'טיפוח עור', '2023-12-08', 'עסקית, זמינה רק אחה"צ', 5, 'active', auth.uid()),
  (auth.uid(), 'רונית דוד', '050-1112233', 'ronit.david@yahoo.com', 'בניית ציפורניים', '2024-04-18', 'מעדיפה צבעים בהירים', 6, 'active', auth.uid()),
  (auth.uid(), 'יעל שמיר', '054-4445566', 'yael.shamir@gmail.com', 'לק ג''ל', '2024-01-28', 'לקוחה קבועה, מאוד מרוצה', 15, 'active', auth.uid()),
  (auth.uid(), 'דנה גולן', '052-7890123', 'dana.golan@outlook.com', 'פדיקור', '2023-11-12', 'רגישה לכאבים', 4, 'active', auth.uid()),
  (auth.uid(), 'ליאור כץ', '053-9998877', 'lior.katz@gmail.com', 'עיצוב ציפורניים', '2024-05-03', 'אוהבת עיצובים מיוחדים', 7, 'active', auth.uid()),
  (auth.uid(), 'הדר בן שמעון', '058-3336699', 'hadar.bs@walla.co.il', 'לק ג''ל', '2024-02-14', 'עובדת במשמרות', 9, 'active', auth.uid()),
  (auth.uid(), 'שני אלון', '050-5554433', 'shani.alon@hotmail.com', 'בניית ציפורניים', '2023-10-25', 'תמיד מאחרת, צריך להזכיר', 2, 'inactive', auth.uid()),
  (auth.uid(), 'קרן ברק', '054-8887766', 'karen.barak@gmail.com', 'טיפוח עור', '2024-03-07', 'מעוניינת בחבילות טיפולים', 11, 'active', auth.uid()),
  (auth.uid(), 'אורנה פז', '052-1119988', 'orna.paz@yahoo.com', 'פדיקור', '2024-01-03', 'גרה רחוק, מגיעה פעם בחודש', 3, 'active', auth.uid()),
  (auth.uid(), 'גלית נחום', '053-2228844', 'galit.nachum@outlook.com', 'לק ג''ל', '2023-12-20', 'מביאה חברות לטיפולים', 13, 'active', auth.uid()),
  (auth.uid(), 'איריס חן', '058-6665544', 'iris.chen@gmail.com', 'עיצוב ציפורניים', '2024-04-12', 'מאוד קפדנית על איכות', 8, 'active', auth.uid()),
  (auth.uid(), 'מורן גבאי', '050-9994455', 'moran.gabai@walla.co.il', 'בניית ציפורניים', '2024-05-25', 'לקוחה חדשה בתקופת ניסיון', 1, 'lead', auth.uid());
