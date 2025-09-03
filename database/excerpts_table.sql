-- Excerpts table for AI-generated contextual text snippets
CREATE TABLE excerpts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  word_id VARCHAR(50) NOT NULL, -- References jmdict_entries.seq or similar
  word_text VARCHAR(100) NOT NULL, -- The actual word/kanji
  word_reading VARCHAR(200), -- Reading/pronunciation
  word_meaning TEXT, -- English meaning
  
  -- AI generation metadata
  ai_model VARCHAR(100), -- e.g., 'gpt-4', 'claude-3'
  generation_prompt TEXT,
  generation_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Content metadata
  difficulty_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
  language VARCHAR(10) DEFAULT 'japanese',
  content_type VARCHAR(50) DEFAULT 'contextual_text', -- 'contextual_text', 'dialogue', 'story', etc.
  
  -- User interaction
  created_by UUID REFERENCES auth.users(id),
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  
  -- Content quality
  quality_score FLOAT DEFAULT 0, -- 0-1 scale
  review_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP,
  
  -- Metadata
  tags TEXT[], -- Array of tags for categorization
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_excerpts_word_id ON excerpts(word_id);
CREATE INDEX idx_excerpts_slug ON excerpts(slug);
CREATE INDEX idx_excerpts_created_by ON excerpts(created_by);
CREATE INDEX idx_excerpts_is_public ON excerpts(is_public);
CREATE INDEX idx_excerpts_difficulty_level ON excerpts(difficulty_level);
CREATE INDEX idx_excerpts_created_at ON excerpts(created_at);

-- Full-text search index
CREATE INDEX idx_excerpts_content_search ON excerpts USING gin(to_tsvector('english', content || ' ' || title));

-- RLS (Row Level Security) policies
ALTER TABLE excerpts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read public excerpts
CREATE POLICY "Public excerpts are viewable by everyone" ON excerpts
  FOR SELECT USING (is_public = true);

-- Policy: Users can create excerpts
CREATE POLICY "Users can create excerpts" ON excerpts
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Policy: Users can update their own excerpts
CREATE POLICY "Users can update their own excerpts" ON excerpts
  FOR UPDATE USING (auth.uid() = created_by);

-- Policy: Users can delete their own excerpts
CREATE POLICY "Users can delete their own excerpts" ON excerpts
  FOR DELETE USING (auth.uid() = created_by);
