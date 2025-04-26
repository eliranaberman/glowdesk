import { supabase } from '@/integrations/supabase/client';
import { MarketingTemplate, MarketingTemplateCreate, MarketingTemplateUpdate } from '@/types/marketing';

const initialTemplates = [
  {
    title: "🎁 חבילת פינוק VIP ליום ההולדת",
    content: `היי {שם} יקרה! 🌟

מזל טוב! לרגל יום הולדתך, הכנו במיוחד עבורך חבילת טיפולים מפנקת:
✨ בניית ציפורניים + עיצוב מתנה
💅 טיפול פרפין מפנק לידיים
💖 20% הנחה על כל הטיפולים הנוספים

ההטבה בתוקף חודש מהיום - נשמח לראותך! 🎉`,
  },
  {
    title: "✨ השקת קולקציית קיץ חדשה",
    content: `היי {שם}! ✨

הגיעה קולקציית הקיץ החדשה שלנו! 🌸

🎨 לקים בגווני פסטל רכים
💅 עיצובים טרופיים מרהיבים
✨ אפקטים מנצנצים חדשניים

הזמיני תור עכשיו וקבלי 15% הנחה על העיצוב הראשון מהקולקציה! 🌺

לקביעת תור: {קישור_הזמנה}`,
  },
  {
    title: "💫 מבצע חברה מביאה חברה",
    content: `היי {שם}! 

יש לך חברה שעדיין לא מכירה אותנו? 👯‍♀️

הביאי חברה חדשה לטיפול ותקבלו שתיכן:
🎁 50% הנחה על הטיפול הראשון שלה
✨ מניקור מתנה בביקור הבא שלך

כי טיפולי יופי תמיד כיף לחלוק עם חברות! 💕`,
  },
  {
    title: "🌟 טיפול החודש במחיר מיוחד",
    content: `{שם} יקרה!

מכירה את הטרנד החדש שכולן מדברות עליו? 💅

החודש במחיר היכרות בלבד:
✨ בניית ציפורניים בשיטת BABY BOOMER
💎 כולל אפקט הולוגרפי מנצנץ
🎨 עיצוב ייחודי לבחירתך

במקום 280₪ רק 199₪!
בתוקף עד סוף החודש - מספר המקומות מוגבל! ⏰`
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
