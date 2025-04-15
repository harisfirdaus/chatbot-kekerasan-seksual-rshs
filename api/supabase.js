import { createClient } from '@supabase/supabase-js';

// Fungsi untuk mengirim permintaan ke edge function Supabase
async function callEdgeFunction(action, data = null) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const apiKey = process.env.SUPABASE_API_KEY || process.env.SUPABASE_SERVICE_KEY;
    
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL is not defined');
    }

    const url = `${supabaseUrl}/functions/v1/chatbot-data`;
    const body = { action, ...(data && { ...data }) };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Edge function error: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Edge function error:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const { action, data } = req.body;

    if (!action) {
      return res.status(400).json({ error: 'Action is required' });
    }

    let result;
    try {
      // Coba gunakan edge function terlebih dahulu
      const edgeFunctionResult = await callEdgeFunction(action, data);
      return res.status(200).json(edgeFunctionResult);
    } catch (edgeError) {
      console.warn('Edge function failed, falling back to direct DB access:', edgeError.message);
      
      // Fallback ke akses database langsung
      switch (action) {
        case 'get_articles':
          result = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });
          break;
        
        case 'get_system_prompts':
          result = await supabase
            .from('system_prompts')
            .select('*')
            .order('created_at', { ascending: false });
          break;
          
        case 'get_article_references':
          result = await supabase
            .from('article_references')
            .select('*')
            .order('created_at', { ascending: false });
          break;
          
        case 'get_example_questions':
          result = await supabase
            .from('example_questions')
            .select('*')
            .order('created_at', { ascending: false });
          break;
          
        case 'get_chat_history':
          result = await supabase
            .from('chat_history')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
          break;
        
        case 'save_chat':
          if (!data) {
            return res.status(400).json({ error: 'Data is required for save_chat action' });
          }
          result = await supabase
            .from('chat_history')
            .insert([data]);
          break;
          
        case 'save_article_click':
          if (!data || !data.article_title || !data.article_url) {
            return res.status(400).json({ error: 'Article title and URL are required for save_article_click action' });
          }
          result = await supabase
            .from('article_clicks')
            .insert([{
              article_title: data.article_title,
              article_url: data.article_url,
              clicked_at: new Date().toISOString()
            }]);
          break;
        
        default:
          return res.status(400).json({ error: 'Invalid action' });
      }

      if (result.error) {
        throw result.error;
      }

      return res.status(200).json(result.data);
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 