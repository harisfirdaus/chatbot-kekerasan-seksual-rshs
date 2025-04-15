// API handler untuk Supabase
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_API_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, data } = req.body;

    if (!action) {
      return res.status(400).json({ error: 'Action is required' });
    }

    let result;
    
    // Coba ambil data langsung dari Supabase
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
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 