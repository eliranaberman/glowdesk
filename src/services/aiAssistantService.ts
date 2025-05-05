
// This is a placeholder service for the AI Assistant functionality
// In a real application, this would connect to a proper AI service API

import { supabase } from '@/lib/supabase';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface AIResponse {
  message: string;
  suggestions?: string[];
  tasks?: {
    title: string;
    type: string;
  }[];
}

// Mock function to simulate AI response
export const generateAIResponse = async (prompt: string): Promise<AIResponse> => {
  console.log('AI Assistant received prompt:', prompt);
  
  // In a real implementation, this would call an actual AI API
  // For now, return mock responses based on keywords
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (prompt.includes('תור') || prompt.includes('פגישה')) {
    return {
      message: "אני אעזור לך לנהל את התורים. אילו ימים את רוצה שאבדוק?",
      suggestions: [
        "בדוק תורים להיום",
        "מצא חורים ביומן השבוע",
        "מי הלקוחות הקבועים שלא קבעו תור החודש?"
      ]
    };
  }
  
  if (prompt.includes('הודע') || prompt.includes('לקוח')) {
    return {
      message: "אני יכולה לשלוח הודעות ללקוחות. איזה סוג של הודעה תרצי לשלוח?",
      suggestions: [
        "תזכורת לתורים מחר",
        "הודעה על מבצע חדש",
        "ברכת יום הולדת ללקוחות החודש"
      ]
    };
  }
  
  if (prompt.includes('אינסטגרם') || prompt.includes('פוסט')) {
    return {
      message: "אשמח להכין לך פוסט לאינסטגרם. איזה סוג של תוכן תרצי?",
      tasks: [
        { title: "יצירת פוסט על טרנדים חדשים", type: "post" },
        { title: "עיצוב תמונה לפוסט", type: "design" },
        { title: "הכנת האשטגים רלוונטיים", type: "research" }
      ]
    };
  }
  
  if (prompt.includes('הכנס') || prompt.includes('כסף') || prompt.includes('הוצא')) {
    return {
      message: "אני אעזור לך לנתח את המצב הפיננסי של העסק. מה תרצי לבדוק?",
      suggestions: [
        "כמה הרווחתי החודש?",
        "מהן ההוצאות הגדולות ביותר?",
        "השוואה לחודש קודם"
      ]
    };
  }
  
  // Default response
  return {
    message: "אני כאן לעזור לך. מה תרצי שאעשה עבורך היום?",
    suggestions: [
      "נהל את התורים שלי",
      "שלח תזכורת ללקוחות",
      "הכן פוסט לאינסטגרם"
    ]
  };
};

// Store chat history in Supabase (if available) or localStorage
export const saveChatHistory = async (userId: string, messages: AIMessage[]): Promise<void> => {
  try {
    // Try to save to Supabase if available
    if (supabase) {
      const { error } = await supabase
        .from('ai_chat_history')
        .upsert({
          user_id: userId,
          messages: JSON.stringify(messages),
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
    } else {
      // Fallback to localStorage
      localStorage.setItem(`ai_chat_history_${userId}`, JSON.stringify(messages));
    }
  } catch (error) {
    console.error('Error saving chat history:', error);
    // Fallback to localStorage on error
    localStorage.setItem(`ai_chat_history_${userId}`, JSON.stringify(messages));
  }
};

// Load chat history
export const loadChatHistory = async (userId: string): Promise<AIMessage[]> => {
  try {
    // Try to load from Supabase if available
    if (supabase) {
      const { data, error } = await supabase
        .from('ai_chat_history')
        .select('messages')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return data?.messages ? JSON.parse(data.messages) : [];
    } else {
      // Fallback to localStorage
      const storedHistory = localStorage.getItem(`ai_chat_history_${userId}`);
      return storedHistory ? JSON.parse(storedHistory) : [];
    }
  } catch (error) {
    console.error('Error loading chat history:', error);
    // Fallback to localStorage on error
    const storedHistory = localStorage.getItem(`ai_chat_history_${userId}`);
    return storedHistory ? JSON.parse(storedHistory) : [];
  }
};
