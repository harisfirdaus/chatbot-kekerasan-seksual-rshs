import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getChatHistory() {
  try {
    const response = await fetch('/api/supabase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'get_chat_history' }),
    });

    if (!response.ok) {
      throw new Error('Failed to get chat history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
}

export async function saveChat(data: any) {
  try {
    const response = await fetch('/api/supabase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        action: 'save_chat',
        data 
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save chat');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving chat:', error);
    throw error;
  }
}