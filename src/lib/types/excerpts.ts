export interface Excerpt {
  id: string
  slug: string
  title: string
  content: string
  word_id: string
  word_text: string
  word_reading?: string
  word_meaning?: string
  
  // AI generation metadata
  ai_model?: string
  generation_prompt?: string
  generation_timestamp?: string
  
  // Content metadata
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
  language?: string
  content_type?: 'contextual_text' | 'dialogue' | 'story' | 'explanation'
  
  // User interaction
  created_by?: string
  is_public: boolean
  is_featured: boolean
  view_count: number
  like_count: number
  
  // Content quality
  quality_score: number
  review_status: 'pending' | 'approved' | 'rejected'
  reviewed_by?: string
  reviewed_at?: string
  
  // Metadata
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface CreateExcerptRequest {
  word_id: string
  word_text: string
  word_reading?: string
  word_meaning?: string
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
  content_type?: 'contextual_text' | 'dialogue' | 'story' | 'explanation'
  custom_prompt?: string
}

export interface ExcerptFilters {
  difficulty_level?: string
  content_type?: string
  language?: string
  tags?: string[]
  search?: string
  is_featured?: boolean
}

export interface ExcerptStats {
  total_excerpts: number
  by_difficulty: Record<string, number>
  by_content_type: Record<string, number>
  by_language: Record<string, number>
}
