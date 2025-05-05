
// This is a service for the AI Assistant functionality
// It handles communication with the AI service and data storage

import { supabase } from '@/lib/supabase';
import { z } from 'zod';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface AIResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    message?: string;
    suggestions?: string[];
    tasks?: {
      title: string;
      type: string;
    }[];
  };
  errors?: Record<string, string>;
}

// Schema for validating prompt input
const promptSchema = z.object({
  prompt: z.string()
    .min(1, { message: "הודעה לא יכולה להיות ריקה" })
    .max(1000, { message: "הודעה ארוכה מדי. אורך מקסימלי הוא 1000 תווים" })
    .refine(text => !containsXSSRisk(text), {
      message: "ההודעה מכילה תווים לא מורשים"
    })
});

// Simple XSS detection function
function containsXSSRisk(text: string): boolean {
  const xssPatterns = [/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, /<[^>]*script:/gi, /javascript:/gi];
  return xssPatterns.some(pattern => pattern.test(text));
}

// Helper function to sanitize text
function sanitizeText(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Improved function to generate AI response with proper validation
export const generateAIResponse = async (prompt: unknown): Promise<AIResponse> => {
  try {
    console.log('AI Assistant received prompt:', prompt);
    
    // Validate input
    const validationResult = promptSchema.safeParse({ prompt });
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach(issue => {
        errors[issue.path.join('.')] = issue.message;
      });
      
      return {
        status: 'error',
        message: 'שגיאת אימות קלט',
        errors
      };
    }

    // Sanitize input
    const sanitizedPrompt = sanitizeText(validationResult.data.prompt);
    
    // Check for concurrent requests (simple implementation)
    const requestTimestamp = new Date().getTime();
    const lastRequest = globalThis.lastAIRequest || 0;
    if (requestTimestamp - lastRequest < 200) {
      return {
        status: 'error',
        message: 'בקשות רבות מדי. נא להמתין מעט ולנסות שוב.'
      };
    }
    globalThis.lastAIRequest = requestTimestamp;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate response based on sanitized prompt
    let responseData;
    
    if (sanitizedPrompt.includes('תור') || sanitizedPrompt.includes('פגישה')) {
      responseData = {
        message: "אני אעזור לך לנהל את התורים. אילו ימים את רוצה שאבדוק?",
        suggestions: [
          "בדוק תורים להיום",
          "מצא חורים ביומן השבוע",
          "מי הלקוחות הקבועים שלא קבעו תור החודש?"
        ]
      };
    } else if (sanitizedPrompt.includes('הודע') || sanitizedPrompt.includes('לקוח')) {
      responseData = {
        message: "אני יכולה לשלוח הודעות ללקוחות. איזה סוג של הודעה תרצי לשלוח?",
        suggestions: [
          "תזכורת לתורים מחר",
          "הודעה על מבצע חדש",
          "ברכת יום הולדת ללקוחות החודש"
        ]
      };
    } else if (sanitizedPrompt.includes('אינסטגרם') || sanitizedPrompt.includes('פוסט')) {
      responseData = {
        message: "אשמח להכין לך פוסט לאינסטגרם. איזה סוג של תוכן תרצי?",
        tasks: [
          { title: "יצירת פוסט על טרנדים חדשים", type: "post" },
          { title: "עיצוב תמונה לפוסט", type: "design" },
          { title: "הכנת האשטגים רלוונטיים", type: "research" }
        ]
      };
    } else if (sanitizedPrompt.includes('הכנס') || sanitizedPrompt.includes('כסף') || sanitizedPrompt.includes('הוצא')) {
      responseData = {
        message: "אני אעזור לך לנתח את המצב הפיננסי של העסק. מה תרצי לבדוק?",
        suggestions: [
          "כמה הרווחתי החודש?",
          "מהן ההוצאות הגדולות ביותר?",
          "השוואה לחודש קודם"
        ]
      };
    } else {
      // Default response
      responseData = {
        message: "אני כאן לעזור לך. מה תרצי שאעשה עבורך היום?",
        suggestions: [
          "נהל את התורים שלי",
          "שלח תזכורת ללקוחות",
          "הכן פוסט לאינסטגרם"
        ]
      };
    }

    return {
      status: 'success',
      message: 'בקשה בוצעה בהצלחה',
      data: responseData
    };
    
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    return {
      status: 'error',
      message: 'אירעה שגיאה בעיבוד הבקשה. נסי שוב מאוחר יותר.'
    };
  }
};

// Store chat history in Supabase with improved error handling and validation
export const saveChatHistory = async (userId: string, messages: AIMessage[]): Promise<AIResponse> => {
  try {
    if (!userId) {
      return {
        status: 'error',
        message: 'זיהוי משתמש נדרש'
      };
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return {
        status: 'error',
        message: 'אין הודעות לשמירה'
      };
    }

    // Validate message format
    const invalidMessages = messages.filter(msg => 
      !msg.role || !['system', 'user', 'assistant'].includes(msg.role) || !msg.content
    );
    
    if (invalidMessages.length > 0) {
      return {
        status: 'error',
        message: 'מבנה הודעות לא תקין',
        errors: {
          messages: 'חלק מההודעות אינן בפורמט הנדרש'
        }
      };
    }

    // Sanitize messages
    const sanitizedMessages = messages.map(msg => ({
      ...msg,
      content: sanitizeText(msg.content)
    }));

    // Check if history already exists
    const { data: existingData } = await supabase
      .from('ai_chat_history')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingData) {
      // Update existing history
      const { error } = await supabase
        .from('ai_chat_history')
        .update({
          messages: JSON.stringify(sanitizedMessages),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (error) throw error;
    } else {
      // Create new history
      const { error } = await supabase
        .from('ai_chat_history')
        .insert({
          user_id: userId,
          messages: JSON.stringify(sanitizedMessages),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        // Check for duplicate entry
        if (error.code === '23505') { // Postgres unique violation
          return {
            status: 'error',
            message: 'Entry already exists'
          };
        }
        throw error;
      }
    }

    return {
      status: 'success',
      message: 'היסטוריית הצ\'אט נשמרה בהצלחה'
    };
  } catch (error) {
    console.error('Error saving chat history:', error);
    
    // Fallback to localStorage on error
    try {
      localStorage.setItem(`ai_chat_history_${userId}`, JSON.stringify(messages));
      return {
        status: 'success',
        message: 'היסטוריית הצ\'אט נשמרה בלוקל סטורג׳'
      };
    } catch (storageError) {
      return {
        status: 'error',
        message: 'שגיאה בשמירת היסטוריית הצ\'אט'
      };
    }
  }
};

// Load chat history with improved error handling
export const loadChatHistory = async (userId: string): Promise<AIResponse> => {
  try {
    if (!userId) {
      return {
        status: 'error',
        message: 'זיהוי משתמש נדרש'
      };
    }

    // Try to load from Supabase if available
    if (supabase) {
      const { data, error } = await supabase
        .from('ai_chat_history')
        .select('messages')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          return {
            status: 'success',
            message: 'לא נמצאה היסטוריה',
            data: { message: 'אין היסטוריית שיחות קודמות' }
          };
        }
        throw error;
      }

      const messagesData = data?.messages ? JSON.parse(data.messages) : [];
      return {
        status: 'success',
        message: 'היסטוריית הצ\'אט נטענה בהצלחה',
        data: { message: 'היסטוריית שיחות נטענה בהצלחה', suggestions: ['המשך שיחה', 'התחל שיחה חדשה'] }
      };
    } else {
      // Fallback to localStorage
      const storedHistory = localStorage.getItem(`ai_chat_history_${userId}`);
      const messagesData = storedHistory ? JSON.parse(storedHistory) : [];
      
      return {
        status: 'success',
        message: 'היסטוריית הצ\'אט נטענה מלוקל סטורג׳',
        data: { message: 'היסטוריית שיחות נטענה מאחסון מקומי', suggestions: ['המשך שיחה', 'התחל שיחה חדשה'] }
      };
    }
  } catch (error) {
    console.error('Error loading chat history:', error);
    
    // Attempt to read from localStorage as fallback
    try {
      const storedHistory = localStorage.getItem(`ai_chat_history_${userId}`);
      if (storedHistory) {
        const messagesData = JSON.parse(storedHistory);
        return {
          status: 'success',
          message: 'היסטוריית הצ\'אט נטענה מלוקל סטורג׳',
          data: { message: 'היסטוריית שיחות נטענה מאחסון מקומי' }
        };
      }
      
      return {
        status: 'error',
        message: 'לא נמצאה היסטוריית שיחות'
      };
    } catch (storageError) {
      return {
        status: 'error',
        message: 'שגיאה בטעינת היסטוריית הצ\'אט'
      };
    }
  }
};

// Helper function to declare global variables for TypeScript
declare global {
  var lastAIRequest: number;
}
