// lib/services/orchestrator.ts
import { CanonicalPhraseRequest, PhraseRequestNormalizer } from './phraseRequestNormalizer'
import { PhraseRepository, PhraseRecord } from './phraseRepository'
import { OpenAIClient, GeneratedPhrase } from './openaiClient'
import { PhraseValidator } from './phraseValidator'
import { cacheService } from './cacheService'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export interface OrchestratorResult {
  phrase: PhraseRecord;
  source: 'cache' | 'database_exact' | 'database_broader' | 'ai_generated';
  confidence: number;
  generation_time_ms?: number;
}

export interface GenerationLog {
  request_hash: string;
  canonical_request: Record<string, unknown>;
  decision_path: string;
  found_phrase_id?: string;
  db_lookup_ms?: number;
  ai_generation_ms?: number;
  validation_ms?: number;
  total_ms: number;
  ai_model?: string;
  ai_assistant_id?: string;
  items_generated?: number;
  items_validated?: number;
  items_stored?: number;
  error_type?: string;
  error_message?: string;
  retry_count?: number;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
}

export class GetOrGenerateOrchestrator {
  private phraseRepository = new PhraseRepository();
  private openaiClient = new OpenAIClient();
  private supabase = createServiceRoleClient();

  /**
   * Main orchestration method - implements the complete get-or-generate flow
   */
  async getOrGeneratePhrase(
    request: CanonicalPhraseRequest,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<OrchestratorResult> {
    const startTime = Date.now();
    const requestHash = this.generateRequestHash(request);
    
    const log: GenerationLog = {
      request_hash: requestHash,
      canonical_request: request as unknown as Record<string, unknown>,
      decision_path: 'unknown',
      total_ms: 0,
      user_id: userId,
      ip_address: ipAddress,
      user_agent: userAgent
    };

    try {
      // Step 1: Cache lookup
      const cachedPhrase = cacheService.get(request);
      if (cachedPhrase) {
        log.decision_path = 'cache_hit';
        log.total_ms = Date.now() - startTime;
        await this.logGeneration(log);
        
        return {
          phrase: cachedPhrase,
          source: 'cache',
          confidence: cachedPhrase.level_confidence
        };
      }

      // Step 2: Check if we should reuse existing phrases (only if 10+ exist)
      const dbStartTime = Date.now();
      const existingCount = await this.phraseRepository.countExistingPhrases(request);
      console.log(`Found ${existingCount} existing phrases with these settings`);
      
      if (existingCount >= 10) {
        console.log('10+ phrases exist - attempting to reuse existing phrase');
        const exactMatch = await this.phraseRepository.findExact(request);
        log.db_lookup_ms = Date.now() - dbStartTime;

        if (exactMatch) {
          log.decision_path = 'db_exact';
          log.found_phrase_id = exactMatch.id;
          log.total_ms = Date.now() - startTime;
          await this.logGeneration(log);

          // Cache the result
          cacheService.set(request, exactMatch);

          console.log(`Using existing phrase (${existingCount} available)`);
          return {
            phrase: exactMatch,
            source: 'database_exact',
            confidence: exactMatch.level_confidence
          };
        }

        // Try broader match if exact didn't work
        const broaderMatch = await this.phraseRepository.findBroader(request);
        if (broaderMatch) {
          log.decision_path = 'db_broader';
          log.found_phrase_id = broaderMatch.id;
          log.total_ms = Date.now() - startTime;
          await this.logGeneration(log);

          // Cache the result
          cacheService.set(request, broaderMatch);

          console.log(`Using broader existing phrase (${existingCount} available)`);
          return {
            phrase: broaderMatch,
            source: 'database_broader',
            confidence: broaderMatch.level_confidence * 0.8
          };
        }
      } else {
        console.log(`Only ${existingCount} existing phrases - generating NEW phrase (need 10+ to reuse)`);
        log.db_lookup_ms = Date.now() - dbStartTime;
      }

      // Step 4: AI generation - get existing phrases for context to avoid duplicates
      console.log('Generating new phrase via AI...');
      const existingPhrases = await this.phraseRepository.getExistingPhrasesForContext(request, 15);
      console.log(`Found ${existingPhrases.length} existing phrases to provide as context to avoid duplicates`);
      
      const aiStartTime = Date.now();
      const aiResult = await this.openaiClient.generatePhrases(request, existingPhrases);
      log.ai_generation_ms = Date.now() - aiStartTime;
      log.ai_model = aiResult.model_used;
      log.ai_assistant_id = 'asst_8XAaKUGCrkLOzu0GAZpkVS4n';
      log.items_generated = aiResult.items.length;

      // Step 5: Validate and select best phrase
      const validationStartTime = Date.now();
      console.log('Validating phrases:', aiResult.items.length, 'items');
      console.log('First item to validate:', JSON.stringify(aiResult.items[0], null, 2));
      
      const validPhrases = await this.validateAndSelectPhrases(aiResult.items, request);
      log.validation_ms = Date.now() - validationStartTime;
      log.items_validated = validPhrases.length;

      console.log('Validation result:', validPhrases.length, 'valid phrases out of', aiResult.items.length);

      if (validPhrases.length === 0) {
        console.error('All phrases failed validation');
        throw new Error('No valid phrases generated');
      }

      // Select the best phrase (first one that meets all requirements)
      const selectedPhrase = validPhrases[0];

      // Step 6: Store all valid phrases in database
      const batchId = uuidv4();
      const phrasesToStore = validPhrases.map(phrase => this.convertToPhraseRecord(phrase, request, batchId));
      
      console.log('Storing phrases to database:', phrasesToStore.length, 'phrases');
      console.log('First phrase to store:', JSON.stringify(phrasesToStore[0], null, 2));
      
      const storedPhrases = await this.phraseRepository.insertBatch(phrasesToStore);
      log.items_stored = storedPhrases.length;
      
      console.log('Successfully stored phrases:', storedPhrases.length);

      // Step 7: Create character links for the selected phrase
      const selectedStored = storedPhrases.find(p => p.phrase === selectedPhrase.phrase);
      if (selectedStored) {
        await this.createCharacterLinks(selectedStored.id, selectedPhrase.phrase);
      }

      log.decision_path = 'ai_generate';
      log.found_phrase_id = selectedStored?.id;
      log.total_ms = Date.now() - startTime;
      await this.logGeneration(log);

      // Cache the selected phrase
      if (selectedStored) {
        cacheService.set(request, selectedStored);
      }

      return {
        phrase: selectedStored || {
          ...this.convertToPhraseRecord(selectedPhrase, request, batchId),
          id: 'temp-id',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as PhraseRecord,
        source: 'ai_generated',
        confidence: selectedPhrase.level.confidence,
        generation_time_ms: aiResult.generation_time_ms
      };

    } catch (error) {
      log.decision_path = 'error';
      log.error_type = error instanceof Error ? error.constructor.name : 'UnknownError';
      log.error_message = error instanceof Error ? error.message : 'Unknown error';
      log.total_ms = Date.now() - startTime;
      await this.logGeneration(log);

      throw error;
    }
  }

  /**
   * Validate generated phrases and return valid ones
   */
  private async validateAndSelectPhrases(
    phrases: GeneratedPhrase[], 
    request: CanonicalPhraseRequest
  ): Promise<GeneratedPhrase[]> {
    const validPhrases: GeneratedPhrase[] = [];

    for (const phrase of phrases) {
      const validation = PhraseValidator.validate(phrase, request);
      
      if (validation.isValid) {
        validPhrases.push(phrase);
      } else {
        console.warn('Invalid phrase generated:', validation.errors);
      }
    }

    return validPhrases;
  }

  /**
   * Convert GeneratedPhrase to PhraseRecord for database storage
   */
  private convertToPhraseRecord(
    phrase: GeneratedPhrase, 
    request: CanonicalPhraseRequest, 
    batchId: string
  ): Omit<PhraseRecord, 'id' | 'created_at' | 'updated_at'> {
    // Keep char_occurrences as array - database constraint expects array format
    // AI returns: [{"char": "你", "indices": [0]}, {"char": "好", "indices": [1]}]
    // Database constraint requires this exact format
    const charOccurrences = phrase.char_occurrences;
    
    return {
      // Don't include id, created_at, updated_at - database will generate them
      phrase: phrase.phrase,
      translation_en: phrase.translation_en,
      pinyin_marks: phrase.pinyin_marks, // Keep as string (database expects text)
      pinyin_numbers: phrase.pinyin_numbers, // Keep as string (database expects text)
      level_system: phrase.level.system,
      level_value: String(phrase.level.value),
      level_confidence: phrase.level.confidence,
      type: phrase.type,
      topic: phrase.topic || [], // Convert to array (database expects ARRAY)
      length: phrase.length,
      char_set: phrase.char_set,
      char_occurrences: charOccurrences,
      include_chars_present: phrase.include_chars_present,
      tags: phrase.tags,
      quality_checks: phrase.quality_checks,
      request_level_system: request.level.system,
      request_level_value: String(request.level.value),
      request_type: request.type,
      request_topic: request.topic ? [request.topic] : [], // Convert to array (database expects ARRAY)
      request_include_chars: request.include_chars,
      request_count: request.count,
      request_max_len: request.max_len,
      batch_id: batchId,
      generated_at: new Date().toISOString()
    } as Omit<PhraseRecord, 'id' | 'created_at' | 'updated_at'>;
  }

  /**
   * Create character links for a phrase
   */
  private async createCharacterLinks(phraseId: string, phrase: string): Promise<void> {
    const chars = phrase.split('').map((char, index) => ({ char, index }));
    await this.phraseRepository.insertPhraseChars(phraseId, chars);
  }

  /**
   * Generate request hash for logging
   */
  private generateRequestHash(request: CanonicalPhraseRequest): string {
    return PhraseRequestNormalizer.generateCacheKey(request);
  }

  /**
   * Log generation attempt to database
   */
  private async logGeneration(log: GenerationLog): Promise<void> {
    try {
      await this.supabase
        .from('phrase_generation_logs')
        .insert(log);
    } catch (error) {
      console.error('Failed to log generation:', error);
      // Don't throw - logging failure shouldn't break the main flow
    }
  }
}
