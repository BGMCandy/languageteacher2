-- Telemetry table for phrase generation requests and performance
CREATE TABLE phrase_generation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Request details
  request_hash VARCHAR(64) NOT NULL, -- Hash of canonical request for deduplication
  canonical_request JSONB NOT NULL, -- Full canonical request object
  
  -- Decision path tracking
  decision_path VARCHAR(50) NOT NULL, -- 'cache_hit', 'db_exact', 'db_broader', 'ai_generate'
  found_phrase_id UUID REFERENCES zh_cn_phrases(id), -- If we found an existing phrase
  
  -- Performance metrics
  db_lookup_ms INTEGER, -- Time spent in database queries
  ai_generation_ms INTEGER, -- Time spent with AI assistant
  validation_ms INTEGER, -- Time spent validating results
  total_ms INTEGER NOT NULL, -- Total request time
  
  -- Generation details
  ai_model VARCHAR(50), -- 'gpt-4', 'gpt-3.5-turbo', etc.
  ai_assistant_id VARCHAR(100), -- OpenAI Assistant ID
  items_generated INTEGER DEFAULT 0, -- Number of items AI generated
  items_validated INTEGER DEFAULT 0, -- Number that passed validation
  items_stored INTEGER DEFAULT 0, -- Number stored in database
  
  -- Error tracking
  error_type VARCHAR(50), -- 'validation_failed', 'ai_error', 'db_error', etc.
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- User context (if available)
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for analytics and debugging
CREATE INDEX idx_phrase_generation_logs_request_hash ON phrase_generation_logs(request_hash);
CREATE INDEX idx_phrase_generation_logs_decision_path ON phrase_generation_logs(decision_path);
CREATE INDEX idx_phrase_generation_logs_created_at ON phrase_generation_logs(created_at);
CREATE INDEX idx_phrase_generation_logs_user_id ON phrase_generation_logs(user_id);
CREATE INDEX idx_phrase_generation_logs_error_type ON phrase_generation_logs(error_type);
CREATE INDEX idx_phrase_generation_logs_total_ms ON phrase_generation_logs(total_ms);

-- GIN index for canonical request JSONB
CREATE INDEX idx_phrase_generation_logs_canonical_request ON phrase_generation_logs USING gin(canonical_request);

-- RLS policies
ALTER TABLE phrase_generation_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own logs
CREATE POLICY "Users can view their own generation logs" ON phrase_generation_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Service role can manage all logs
CREATE POLICY "Service role can manage all generation logs" ON phrase_generation_logs
  FOR ALL USING (auth.role() = 'service_role');
