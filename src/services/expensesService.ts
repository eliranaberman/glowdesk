import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Expense = Tables<'expenses'>;
export type ExpenseInsert = TablesInsert<'expenses'>;
export type ExpenseUpdate = TablesUpdate<'expenses'>;

export const getExpenses = async () => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('created_by', user.user.id)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
};

export const getExpenseById = async (id: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', id)
    .eq('created_by', user.user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const createExpense = async (expense: Omit<ExpenseInsert, 'created_by'>) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('expenses')
    .insert({
      ...expense,
      created_by: user.user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateExpense = async (id: string, updates: ExpenseUpdate) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .eq('created_by', user.user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteExpense = async (id: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('created_by', user.user.id);

  if (error) throw error;
};

export const getExpensesByCategory = async (category: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('category', category)
    .eq('created_by', user.user.id)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
};

export const getExpensesByDateRange = async (startDate: string, endDate: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('created_by', user.user.id)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
};

export const uploadInvoice = async (file: File, expenseId: string): Promise<string> => {
  // Mock implementation for invoice upload
  // In a real implementation, you would upload to Supabase storage
  console.log('Uploading invoice for expense:', expenseId);
  
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock file path
  return `invoices/${expenseId}/${file.name}`;
};

// Keep the service object for backward compatibility
export const expensesService = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpensesByCategory,
  getExpensesByDateRange,
  uploadInvoice
};
