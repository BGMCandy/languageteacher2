// lib/services/phraseRepository.ts
import { createServiceRoleClient } from '@/lib/supabase/server'
import { CanonicalPhraseRequest } from './phraseRequestNormalizer'

export interface PhraseRecord {
  id: string;
  phrase: string;
  translation_en: string;
  pinyin_marks: string; // database is text, not array
  pinyin_numbers: string; // database is text, not array
  level_system: string;
  level_value: string;
  level_confidence: number;
  type: string;
  topic?: string[]; // database is ARRAY
  length: number;
  char_set: string[];
  char_occurrences: Array<{char: string; indices: number[]}>; // database constraint requires array
  include_chars_present: string[];
  tags: string[];
  quality_checks: Record<string, boolean>;
  request_level_system?: string;
  request_level_value?: string;
  request_type?: string;
  request_topic?: string[]; // database is ARRAY
  request_include_chars?: string[];
  request_count?: number;
  request_max_len?: number;
  batch_id?: string;
  generated_at: string;
  created_at: string;
  updated_at: string;
}

export interface PhraseSearchResult {
  phrase: PhraseRecord;
  match_type: 'exact' | 'broader';
  confidence: number;
}

export class PhraseRepository {
  private supabase = createServiceRoleClient();

  /**
   * Find exact match for canonical request
   */
  async findExact(request: CanonicalPhraseRequest): Promise<PhraseRecord | null> {
    const { data, error } = await this.supabase
      .from('zh_cn_phrases')
      .select('*')
      .eq('level_system', request.level.system)
      .eq('level_value', String(request.level.value))
      .eq('type', request.type)
      .lte('length', request.max_len)
      .contains('include_chars_present', request.include_chars)
      .eq('quality_checks->>contains_all_required_chars', true)
      .order('generated_at', { ascending: false })
      .order('level_confidence', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error finding exact phrase match:', error);
      return null;
    }

    return data;
  }

  /**
   * Find broader match by relaxing constraints
   */
  async findBroader(request: CanonicalPhraseRequest): Promise<PhraseRecord | null> {
    // Try relaxing length constraint first
    let data = await this.findWithRelaxedLength(request);
    if (data) return data;

    // Try relaxing topic constraint
    data = await this.findWithRelaxedTopic(request);
    if (data) return data;

    // Try allowing superset items that still contain all required chars
    data = await this.findSupersetMatch(request);
    if (data) return data;

    return null;
  }

  /**
   * Find match with relaxed length constraint
   */
  private async findWithRelaxedLength(request: CanonicalPhraseRequest): Promise<PhraseRecord | null> {
    const relaxedLength = request.max_len + 2; // Allow 2 extra characters

    const { data, error } = await this.supabase
      .from('zh_cn_phrases')
      .select('*')
      .eq('level_system', request.level.system)
      .eq('level_value', String(request.level.value))
      .eq('type', request.type)
      .lte('length', relaxedLength)
      .contains('include_chars_present', request.include_chars)
      .eq('quality_checks->>contains_all_required_chars', true)
      .order('generated_at', { ascending: false })
      .order('level_confidence', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error finding phrase with relaxed length:', error);
      return null;
    }

    return data;
  }

  /**
   * Find match with relaxed topic constraint
   */
  private async findWithRelaxedTopic(request: CanonicalPhraseRequest): Promise<PhraseRecord | null> {
    const { data, error } = await this.supabase
      .from('zh_cn_phrases')
      .select('*')
      .eq('level_system', request.level.system)
      .eq('level_value', String(request.level.value))
      .eq('type', request.type)
      .lte('length', request.max_len)
      .contains('include_chars_present', request.include_chars)
      .eq('quality_checks->>contains_all_required_chars', true)
      .order('generated_at', { ascending: false })
      .order('level_confidence', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error finding phrase with relaxed topic:', error);
      return null;
    }

    return data;
  }

  /**
   * Find superset match (phrase contains all required chars but may have more)
   */
  private async findSupersetMatch(request: CanonicalPhraseRequest): Promise<PhraseRecord | null> {
    const { data, error } = await this.supabase
      .from('zh_cn_phrases')
      .select('*')
      .eq('level_system', request.level.system)
      .eq('level_value', String(request.level.value))
      .eq('type', request.type)
      .lte('length', request.max_len)
      .contains('char_set', request.include_chars) // char_set contains all required chars
      .eq('quality_checks->>contains_all_required_chars', true)
      .order('generated_at', { ascending: false })
      .order('level_confidence', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error finding superset phrase match:', error);
      return null;
    }

    return data;
  }

  /**
   * Count existing phrases with the same settings
   */
  async countExistingPhrases(request: CanonicalPhraseRequest): Promise<number> {
    const { count, error } = await this.supabase
      .from('zh_cn_phrases')
      .select('id', { count: 'exact' })
      .eq('level_system', request.level.system)
      .eq('level_value', String(request.level.value))
      .eq('type', request.type);

    if (error) {
      console.error('Error counting existing phrases:', error);
      return 0;
    }

    return count || 0;
  }

  /**
   * Get existing phrases for AI context to avoid duplicates
   */
  async getExistingPhrasesForContext(request: CanonicalPhraseRequest, limit: number = 20): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('zh_cn_phrases')
      .select('phrase, translation_en')
      .eq('level_system', request.level.system)
      .eq('level_value', String(request.level.value))
      .eq('type', request.type)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching existing phrases for context:', error);
      return [];
    }

    return (data || []).map(p => `${p.phrase} (${p.translation_en})`);
  }

  /**
   * Insert batch of phrases atomically
   */
  async insertBatch(phrases: Omit<PhraseRecord, 'id' | 'created_at' | 'updated_at'>[]): Promise<PhraseRecord[]> {
    if (phrases.length === 0) return [];

    console.log('Inserting phrases to database:', phrases.length);
    console.log('Sample phrase data:', JSON.stringify(phrases[0], null, 2));

    try {
      const { data, error } = await this.supabase
        .from('zh_cn_phrases')
        .insert(phrases)
        .select();

      if (error) {
        console.error('Error inserting phrase batch:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('Error code:', error.code);
        console.error('Error hint:', error.hint);
        console.error('Error details:', error.details);
        throw new Error(`Failed to insert phrases: ${error.message}`);
      }

      console.log('Database insertion successful:', data?.length, 'phrases inserted');
      console.log('Inserted data:', JSON.stringify(data, null, 2));
      return data || [];
    } catch (insertError) {
      console.error('Exception during database insertion:', insertError);
      throw insertError;
    }
  }

  /**
   * Insert phrase character links
   */
  async insertPhraseChars(phraseId: string, chars: Array<{ char: string; index: number }>): Promise<void> {
    if (chars.length === 0) return;

    const charLinks = chars.map(({ char, index }) => ({
      phrase_id: phraseId,
      char,
      char_index: index
    }));

    const { error } = await this.supabase
      .from('zh_phrase_chars')
      .insert(charLinks);

    if (error) {
      console.error('Error inserting phrase character links:', error);
      // Don't throw here as this is not critical for the main flow
    }
  }

  /**
   * Get phrase with character details
   */
  async getPhraseWithChars(phraseId: string): Promise<PhraseRecord & { chars: Array<{ char: string; index: number; definition?: string; pinyin?: string }> } | null> {
    const { data, error } = await this.supabase
      .from('zh_cn_phrases')
      .select(`
        *,
        zh_phrase_chars (
          char,
          char_index,
          char_definition,
          char_pinyin
        )
      `)
      .eq('id', phraseId)
      .single();

    if (error) {
      console.error('Error fetching phrase with chars:', error);
      return null;
    }

    return data;
  }

  /**
   * Check if phrase already exists (case-insensitive)
   */
  async phraseExists(phrase: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('zh_cn_phrases')
      .select('id')
      .ilike('phrase', phrase)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error checking phrase existence:', error);
      return false;
    }

    return !!data;
  }
}
