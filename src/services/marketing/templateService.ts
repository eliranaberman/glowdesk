
import { supabase } from '@/integrations/supabase/client';
import { MarketingTemplate, MarketingTemplateCreate, MarketingTemplateUpdate } from '@/types/marketing';

export const getTemplates = async (): Promise<MarketingTemplate[]> => {
  try {
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
