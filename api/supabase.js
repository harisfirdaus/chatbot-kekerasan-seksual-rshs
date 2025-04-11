import { createClient } from '@supabase/supabase-js';

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
    switch (action) {
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