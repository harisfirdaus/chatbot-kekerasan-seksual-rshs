export interface ArticleClick {
  article_title: string;
  article_url: string;
  clicked_at?: string;
}

export async function trackArticleClick(articleTitle: string, articleUrl: string) {
  try {
    const response = await fetch('/api/supabase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        action: 'save_chat',
        data: {
          article_title: articleTitle,
          article_url: articleUrl,
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to track article click');
    }

    return await response.json();
  } catch (error) {
    console.error('Error tracking article click:', error);
  }
}