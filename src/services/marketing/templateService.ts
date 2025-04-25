
import { supabase } from '@/integrations/supabase/client';
import { MarketingTemplate, MarketingTemplateCreate, MarketingTemplateUpdate } from '@/types/marketing';

// Add initial templates if none exist
const initialTemplates = [
  {
    title: "תזכורת לטיפול הבא",
    content: "היי {שם}! 🌟\nמקווים שאת נהנית מהמניקור המושלם שלך!\nהגיע הזמן לקבוע תור לטיפול הבא כדי לשמור על הציפורניים שלך במראה מושלם. 💅\n\nמתי נוח לך להגיע? יש לנו מבצע מיוחד ללקוחות קבועים! ✨",
  },
  {
    title: "מבצע חודשי מיוחד",
    content: "🎉 מבצע החודש במיוחד בשבילך {שם}!\n\n👉 בניית ציפורניים + עיצוב מתנה\n💅 מניקור משולב עם טיפול פרפין\n✨ הנחה של 20% על כל הטיפולים הנוספים\n\nהמבצע בתוקף עד סוף החודש - הזדרזי להזמין תור! 📞",
  },
  {
    title: "ברכה ליום ההולדת",
    content: "✨ מזל טוב {שם} יקרה! ✨\n\nרצינו לאחל לך יום הולדת שמח ומהנה! 🎂\nכמתנה קטנה ממנו, קבלי 30% הנחה על הטיפול הבא שלך!\n\nתקף למימוש חודש מהיום. נשמח לראותך! 🎁",
  },
  {
    title: "סדרת טיפולים חדשה",
    content: "היי {שם}! 💫\n\nהשקנו סדרת טיפולים חדשה ומפנקת במיוחד:\n🌸 מניקור יפני מסורתי\n✨ טיפול פרפין מחדש\n💅 עיצובים תלת מימדיים חדשניים\n\nבהזמנת סדרה של 3 טיפולים - טיפול רביעי במתנה! 🎁",
  },
  {
    title: "חזרה מחופשה",
    content: "לקוחות יקרות! 💝\n\nחזרנו מהחופשה מלאות באנרגיות ורעיונות חדשים! ✈️\n\nהבאנו איתנו קולקציית לקים חדשה ומדהימה 🎨\nועיצובים מיוחדים שלמדנו בהשתלמות! ✨\n\nנשמח לראותכן ולהתחדש יחד 💅",
  },
  {
    title: "טיפים לשמירה על ציפורניים",
    content: "היי {שם}! ✨\n\nרצינו לחלוק איתך כמה טיפים לשמירה על הציפורניים שלך בין הטיפולים:\n\n💧 שמרי על לחות באמצעות שמן קוטיקולות יומי\n🧤 השתמשי בכפפות בעת שימוש בחומרי ניקוי\n💅 הימנעי מלהשתמש בציפורניים ככלי עבודה\n\nמחכות לראותך בטיפול הבא! 💖",
  },
  {
    title: "קולקציה חדשה הגיעה",
    content: "היי {שם}! ✨\n\nהגיעה אלינו קולקציית צבעים חדשה ומרהיבה לקיץ! 🌈\n\nצבעי פסטל רכים, גוונים מטאליים נוצצים, ולקים בגימור מט מושלם - הכל מחכה לך!\n\nקבעי תור וגלי את הטרנדים החמים של העונה 💅",
  },
  {
    title: "חוות דעת מלקוחות",
    content: "היי {שם}! 💕\n\nאנחנו מודות לך על האמון שאת נותנת בנו.\n\nהאם תוכלי לעזור לנו בכתיבת חוות דעת קצרה על הטיפול האחרון שלך?\n\nהמשוב שלך חשוב לנו מאוד וגם עוזר לאחרים למצוא אותנו!\n\nתודה מראש 🙏✨",
  }
];

const createInitialTemplatesIfNeeded = async () => {
  try {
    const { data: existingTemplates } = await supabase
      .from('marketing_templates')
      .select('id');

    if (!existingTemplates || existingTemplates.length === 0) {
      // Get the current user's ID for created_by
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      if (!userId) {
        console.log('No authenticated user found, skipping template creation');
        return;
      }
      
      for (const template of initialTemplates) {
        await createTemplate({
          ...template,
          created_by: userId
        });
      }
    }
  } catch (error) {
    console.error('Error checking/creating initial templates:', error);
  }
};

export const getTemplates = async (): Promise<MarketingTemplate[]> => {
  try {
    await createInitialTemplatesIfNeeded();
    
    const { data, error } = await supabase
      .from('marketing_templates')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
};

export const getTemplateById = async (id: string): Promise<MarketingTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('marketing_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching template ${id}:`, error);
    throw error;
  }
};

export const createTemplate = async (template: MarketingTemplateCreate): Promise<MarketingTemplate> => {
  try {
    const { data, error } = await supabase
      .from('marketing_templates')
      .insert(template)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
};

export const updateTemplate = async (id: string, updates: MarketingTemplateUpdate): Promise<MarketingTemplate> => {
  try {
    const { data, error } = await supabase
      .from('marketing_templates')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating template ${id}:`, error);
    throw error;
  }
};

export const deleteTemplate = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('marketing_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting template ${id}:`, error);
    throw error;
  }
};
