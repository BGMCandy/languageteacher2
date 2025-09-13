// lib/services/backgroundJobs.ts
import { createServiceRoleClient } from '@/lib/supabase/server'
import { PhraseValidator } from './phraseValidator'

export class BackgroundJobs {
  private supabase = createServiceRoleClient();

  /**
   * Backfill character links for phrases missing them
   */
  async backfillCharacterLinks(batchSize: number = 100): Promise<{ processed: number; errors: number }> {
    let processed = 0;
    let errors = 0;

    try {
      // Find phrases without character links
      const { data: phrases, error: fetchError } = await this.supabase
        .from('zh_cn_phrases')
        .select('id, phrase')
        .not('id', 'in', 
          this.supabase
            .from('zh_phrase_chars')
            .select('phrase_id')
        )
        .limit(batchSize);

      if (fetchError) {
        console.error('Error fetching phrases for backfill:', fetchError);
        return { processed: 0, errors: 1 };
      }

      if (!phrases || phrases.length === 0) {
        console.log('No phrases need character link backfill');
        return { processed: 0, errors: 0 };
      }

      // Process each phrase
      for (const phrase of phrases) {
        try {
          await this.createCharacterLinksForPhrase(phrase.id, phrase.phrase);
          processed++;
        } catch (error) {
          console.error(`Error processing phrase ${phrase.id}:`, error);
          errors++;
        }
      }

      console.log(`Backfill completed: ${processed} processed, ${errors} errors`);
      return { processed, errors };

    } catch (error) {
      console.error('Background job error:', error);
      return { processed, errors: 1 };
    }
  }

  /**
   * Quality sweeper - revalidate phrases and update quality checks
   */
  async qualitySweeper(batchSize: number = 50): Promise<{ processed: number; updated: number; errors: number }> {
    let processed = 0;
    let updated = 0;
    let errors = 0;

    try {
      // Find phrases that need quality revalidation (older than 30 days or never validated)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: phrases, error: fetchError } = await this.supabase
        .from('zh_cn_phrases')
        .select('*')
        .or(`generated_at.lt.${thirtyDaysAgo.toISOString()},quality_checks.is.null`)
        .limit(batchSize);

      if (fetchError) {
        console.error('Error fetching phrases for quality sweep:', fetchError);
        return { processed: 0, updated: 0, errors: 1 };
      }

      if (!phrases || phrases.length === 0) {
        console.log('No phrases need quality revalidation');
        return { processed: 0, updated: 0, errors: 0 };
      }

      // Process each phrase
      for (const phrase of phrases) {
        try {
          const updatedQualityChecks = await this.revalidatePhraseQuality(phrase);
          
          if (updatedQualityChecks) {
            await this.supabase
              .from('zh_cn_phrases')
              .update({ 
                quality_checks: updatedQualityChecks,
                updated_at: new Date().toISOString()
              })
              .eq('id', phrase.id);
            
            updated++;
          }
          
          processed++;
        } catch (error) {
          console.error(`Error revalidating phrase ${phrase.id}:`, error);
          errors++;
        }
      }

      console.log(`Quality sweep completed: ${processed} processed, ${updated} updated, ${errors} errors`);
      return { processed, updated, errors };

    } catch (error) {
      console.error('Quality sweeper error:', error);
      return { processed, updated, errors: 1 };
    }
  }

  /**
   * Clean up old generation logs
   */
  async cleanupOldLogs(daysToKeep: number = 90): Promise<{ deleted: number; errors: number }> {
    let deleted = 0;
    let errors = 0;

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const { data, error } = await this.supabase
        .from('phrase_generation_logs')
        .delete()
        .lt('created_at', cutoffDate.toISOString())
        .select('id');

      if (error) {
        console.error('Error cleaning up old logs:', error);
        return { deleted: 0, errors: 1 };
      }

      deleted = data?.length || 0;
      console.log(`Cleaned up ${deleted} old generation logs`);
      return { deleted, errors: 0 };

    } catch (error) {
      console.error('Log cleanup error:', error);
      return { deleted: 0, errors: 1 };
    }
  }

  /**
   * Create character links for a specific phrase
   */
  private async createCharacterLinksForPhrase(phraseId: string, phrase: string): Promise<void> {
    const chars = phrase.split('').map((char, index) => ({ char, index }));

    // Check which characters exist in hanzi_characters table
    const charList = chars.map(c => c.char);
    const { data: existingChars } = await this.supabase
      .from('hanzi_characters')
      .select('char')
      .in('char', charList);

    const existingCharSet = new Set(existingChars?.map(c => c.char) || []);

    // Only create links for characters that exist in hanzi_characters
    const validChars = chars.filter(c => existingCharSet.has(c.char));

    if (validChars.length === 0) {
      return; // No valid characters to link
    }

    const charLinks = validChars.map(({ char, index }) => ({
      phrase_id: phraseId,
      char,
      char_index: index
    }));

    const { error } = await this.supabase
      .from('zh_phrase_chars')
      .insert(charLinks);

    if (error) {
      throw new Error(`Failed to insert character links: ${error.message}`);
    }
  }

  /**
   * Revalidate phrase quality checks
   */
  private async revalidatePhraseQuality(phrase: Record<string, unknown>): Promise<Record<string, boolean> | null> {
    try {
      // Recompute character analysis
      const charAnalysis = PhraseValidator.computeCharacterAnalysis(phrase.phrase as string);
      
      // Validate pinyin consistency
      const pinyinValid = this.validatePinyinConsistency(phrase);
      
      // Check level reasonableness (basic heuristic)
      const levelReasonable = this.checkLevelReasonableness(phrase);

      const newQualityChecks = {
        contains_all_required_chars: PhraseValidator.containsAllRequiredChars(
          phrase.phrase as string, 
          (phrase.include_chars_present as string[]) || []
        ),
        length_ok: (phrase.length as number) <= ((phrase.request_max_len as number) || 20),
        level_reasonable: levelReasonable,
        valid_pinyin: pinyinValid,
        char_set_consistent: this.arraysEqual(
          (phrase.char_set as string[])?.sort() || [], 
          charAnalysis.char_set
        )
      };

      // Only update if quality checks have changed
      const currentChecks = phrase.quality_checks || {};
      const hasChanges = Object.keys(newQualityChecks).some(
        key => currentChecks[key] !== newQualityChecks[key]
      );

      return hasChanges ? newQualityChecks : null;

    } catch (error) {
      console.error('Error revalidating phrase quality:', error);
      return null;
    }
  }

  /**
   * Validate pinyin consistency
   */
  private validatePinyinConsistency(phrase: Record<string, unknown>): boolean {
    try {
      if (!phrase.pinyin_marks || !phrase.pinyin_numbers) {
        return false;
      }

      const marksArray = Array.isArray(phrase.pinyin_marks) 
        ? phrase.pinyin_marks as string[]
        : (phrase.pinyin_marks as string).split(' ');
      
      const numbersArray = Array.isArray(phrase.pinyin_numbers) 
        ? phrase.pinyin_numbers as string[]
        : (phrase.pinyin_numbers as string).split(' ');

      return marksArray.length === (phrase.phrase as string).length && 
             numbersArray.length === (phrase.phrase as string).length;
    } catch {
      return false;
    }
  }

  /**
   * Check if level assignment is reasonable
   */
  private checkLevelReasonableness(phrase: Record<string, unknown>): boolean {
    // Basic heuristic: longer phrases should generally be higher levels
    const length = (phrase.phrase as string).length;
    const level = parseInt(phrase.level_value as string);

    if (phrase.level_system === 'HSK') {
      // HSK levels 1-2: 1-4 chars, HSK 3-4: 2-8 chars, HSK 5-6: 3+ chars
      if (level <= 2 && length > 4) return false;
      if (level >= 5 && length < 3) return false;
    }

    return true;
  }

  /**
   * Check if two arrays are equal (order-independent)
   */
  private arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, index) => val === sortedB[index]);
  }
}

// Schedule background jobs
export function scheduleBackgroundJobs() {
  const jobs = new BackgroundJobs();

  // Run character link backfill every hour
  setInterval(async () => {
    try {
      await jobs.backfillCharacterLinks(100);
    } catch (error) {
      console.error('Scheduled backfill job failed:', error);
    }
  }, 60 * 60 * 1000);

  // Run quality sweeper daily
  setInterval(async () => {
    try {
      await jobs.qualitySweeper(50);
    } catch (error) {
      console.error('Scheduled quality sweep failed:', error);
    }
  }, 24 * 60 * 60 * 1000);

  // Clean up old logs weekly
  setInterval(async () => {
    try {
      await jobs.cleanupOldLogs(90);
    } catch (error) {
      console.error('Scheduled log cleanup failed:', error);
    }
  }, 7 * 24 * 60 * 60 * 1000);

  console.log('Background jobs scheduled');
}
