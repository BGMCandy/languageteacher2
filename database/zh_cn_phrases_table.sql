-- Chinese phrases table for AI-generated and curated phrases
CREATE TABLE zh_cn_phrases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Core phrase data
  phrase VARCHAR(100) NOT NULL,
  translation_en TEXT NOT NULL,
  pinyin_marks TEXT[], -- Array of pinyin with tone marks
  pinyin_numbers TEXT[], -- Array of pinyin with tone numbers
  
  -- Level system (HSK, difficulty, grade_band)
  level_system VARCHAR(20) NOT NULL DEFAULT 'HSK',
  level_value VARCHAR(10) NOT NULL, -- '1', '2', '3', '4', '5', '6' for HSK
  level_confidence FLOAT DEFAULT 0.8, -- 0-1 confidence in level assignment
  
  -- Content classification
  type VARCHAR(20) DEFAULT 'phrase', -- 'phrase', 'sentence', 'idiom', 'expression'
  topic VARCHAR(100), -- Optional topic categorization
  length INTEGER NOT NULL, -- Character count
  
  -- Character analysis
  char_set TEXT[] NOT NULL, -- All unique characters in phrase
  char_occurrences JSONB NOT NULL, -- {"好": 2, "见": 1} character frequency
  include_chars_present TEXT[] NOT NULL, -- Characters that were specifically requested
  
  -- Quality and metadata
  tags TEXT[] DEFAULT '{}',
  quality_checks JSONB DEFAULT '{}', -- {"contains_all_required_chars": true, "valid_pinyin": true}
  
  -- Request tracking (for cache key generation and analytics)
  request_level_system VARCHAR(20),
  request_level_value VARCHAR(10),
  request_type VARCHAR(20),
  request_topic VARCHAR(100),
  request_include_chars TEXT[],
  request_count INTEGER,
  request_max_len INTEGER,
  batch_id UUID, -- Groups phrases generated together
  
  -- Timestamps
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_zh_cn_phrases_level ON zh_cn_phrases(level_system, level_value);
CREATE INDEX idx_zh_cn_phrases_type ON zh_cn_phrases(type);
CREATE INDEX idx_zh_cn_phrases_length ON zh_cn_phrases(length);
CREATE INDEX idx_zh_cn_phrases_generated_at ON zh_cn_phrases(generated_at);
CREATE INDEX idx_zh_cn_phrases_batch_id ON zh_cn_phrases(batch_id);

-- GIN indexes for array and JSONB fields
CREATE INDEX idx_zh_cn_phrases_char_set ON zh_cn_phrases USING gin(char_set);
CREATE INDEX idx_zh_cn_phrases_include_chars ON zh_cn_phrases USING gin(include_chars_present);
CREATE INDEX idx_zh_cn_phrases_tags ON zh_cn_phrases USING gin(tags);
CREATE INDEX idx_zh_cn_phrases_char_occurrences ON zh_cn_phrases USING gin(char_occurrences);

-- Unique constraint on phrase (case-insensitive)
CREATE UNIQUE INDEX idx_zh_cn_phrases_phrase_unique ON zh_cn_phrases(lower(phrase));

-- RLS (Row Level Security) policies
ALTER TABLE zh_cn_phrases ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read phrases (public content)
CREATE POLICY "Public phrases are viewable by everyone" ON zh_cn_phrases
  FOR SELECT USING (true);

-- Policy: Only service role can insert/update (server-side only)
CREATE POLICY "Service role can manage phrases" ON zh_cn_phrases
  FOR ALL USING (auth.role() = 'service_role');
