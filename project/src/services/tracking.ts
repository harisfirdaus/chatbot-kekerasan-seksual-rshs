import { supabase } from '../lib/supabase';

export interface ArticleClick {
  article_title: string;
  article_url: string;
  clicked_at?: string;
}

export async function trackArticleClick(articleTitle: string, articleUrl: string) {
  try {
    const { error } = await supabase
      .from('article_clicks')
      .insert([
        {
          article_title: articleTitle,
          article_url: articleUrl,
        },
      ]);

    if (error) {
      console.error('Error tracking article click:', error);
    }
  } catch (error) {
    console.error('Error tracking article click:', error);
  }
}