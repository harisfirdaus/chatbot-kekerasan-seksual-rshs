import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Read environment variables from .env file
const env = Deno.env.toObject()
const supabaseUrl = env.SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required environment variables SUPABASE_URL or SUPABASE_SERVICE_KEY')
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the request body
    const { action } = await req.json()

    let result

    switch (action) {
      case 'get_articles':
        result = await supabaseClient
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false })
        break

      case 'get_system_prompts':
        result = await supabaseClient
          .from('system_prompts')
          .select('*')
          .order('created_at', { ascending: false })
        break

      case 'get_article_references':
        result = await supabaseClient
          .from('article_references')
          .select('*')
          .order('created_at', { ascending: false })
        break

      case 'get_example_questions':
        result = await supabaseClient
          .from('example_questions')
          .select('*')
          .order('created_at', { ascending: false })
        break

      case 'save_article_click':
        const { article_title, article_url } = await req.json()
        
        // Validasi input
        if (!article_title || typeof article_title !== 'string') {
          return new Response(
            JSON.stringify({ error: 'article_title is required and must be a string' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        if (!article_url || typeof article_url !== 'string') {
          return new Response(
            JSON.stringify({ error: 'article_url is required and must be a string' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        // Validasi format URL
        try {
          new URL(article_url)
        } catch (error) {
          return new Response(
            JSON.stringify({ error: 'Invalid article_url format' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        result = await supabaseClient
          .from('article_clicks')
          .insert([{ 
            article_title: article_title.trim(),
            article_url: article_url.trim() 
          }])
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
    }

    if (result.error) {
      throw result.error
    }

    return new Response(
      JSON.stringify(result.data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}) 