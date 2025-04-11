/*
  # Create article clicks tracking table

  1. New Tables
    - `article_clicks`
      - `id` (uuid, primary key)
      - `article_title` (text, not null)
      - `article_url` (text, not null) 
      - `clicked_at` (timestamptz, default now())
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `article_clicks` table
    - Add policy for anonymous users to insert data
    - Add policy for authenticated users to read data
*/

CREATE TABLE IF NOT EXISTS article_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_title text NOT NULL,
  article_url text NOT NULL,
  clicked_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE article_clicks ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert data
CREATE POLICY "Anyone can insert article clicks" ON article_clicks
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read data
CREATE POLICY "Authenticated users can read article clicks" ON article_clicks
  FOR SELECT
  TO authenticated
  USING (true);