-- Link table connecting phrases to individual characters
CREATE TABLE zh_phrase_chars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phrase_id UUID NOT NULL REFERENCES zh_cn_phrases(id) ON DELETE CASCADE,
  char VARCHAR(1) NOT NULL, -- Single CJK character
  char_index INTEGER NOT NULL, -- Position in phrase (0-based)
  
  -- Character metadata (denormalized for performance)
  char_definition TEXT,
  char_pinyin TEXT,
  char_grade_level INTEGER,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure unique character position per phrase
  UNIQUE(phrase_id, char_index)
);

-- Indexes for performance
CREATE INDEX idx_zh_phrase_chars_phrase_id ON zh_phrase_chars(phrase_id);
CREATE INDEX idx_zh_phrase_chars_char ON zh_phrase_chars(char);
CREATE INDEX idx_zh_phrase_chars_grade_level ON zh_phrase_chars(char_grade_level);

-- Foreign key to hanzi_characters for character validation
-- This ensures we only link to characters that exist in our character database
ALTER TABLE zh_phrase_chars 
ADD CONSTRAINT fk_zh_phrase_chars_hanzi 
FOREIGN KEY (char) REFERENCES hanzi_characters(char);

-- RLS policies
ALTER TABLE zh_phrase_chars ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read phrase character links
CREATE POLICY "Public phrase chars are viewable by everyone" ON zh_phrase_chars
  FOR SELECT USING (true);

-- Policy: Only service role can manage phrase character links
CREATE POLICY "Service role can manage phrase chars" ON zh_phrase_chars
  FOR ALL USING (auth.role() = 'service_role');
