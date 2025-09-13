// lib/services/cacheService.ts
import { CanonicalPhraseRequest } from './phraseRequestNormalizer'
import { PhraseRecord } from './phraseRepository'

interface CacheEntry {
  data: PhraseRecord;
  timestamp: number;
  ttl: number;
}

export class CacheService {
  private cache = new Map<string, CacheEntry>();
  private defaultTTL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

  /**
   * Get cached phrase by canonical request
   */
  get(request: CanonicalPhraseRequest): PhraseRecord | null {
    const key = this.generateKey(request);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cached phrase with TTL
   */
  set(request: CanonicalPhraseRequest, phrase: PhraseRecord, ttl?: number): void {
    const key = this.generateKey(request);
    const entry: CacheEntry = {
      data: phrase,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    };

    this.cache.set(key, entry);
  }

  /**
   * Delete cached entry
   */
  delete(request: CanonicalPhraseRequest): void {
    const key = this.generateKey(request);
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    entries: Array<{ key: string; age: number; ttl: number }>;
  } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: now - entry.timestamp,
      ttl: entry.ttl
    }));

    return {
      size: this.cache.size,
      entries
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }

  /**
   * Generate cache key from canonical request
   */
  private generateKey(request: CanonicalPhraseRequest): string {
    const keyData = {
      level_system: request.level.system,
      level_value: String(request.level.value),
      type: request.type,
      topic: request.topic || '',
      include_chars: request.include_chars.sort(),
      count: request.count,
      max_len: request.max_len
    };

    // Simple hash function for cache key
    return Buffer.from(JSON.stringify(keyData)).toString('base64');
  }
}

// Singleton instance
export const cacheService = new CacheService();

// Cleanup expired entries every hour
setInterval(() => {
  const cleaned = cacheService.cleanup();
  if (cleaned > 0) {
    console.log(`Cache cleanup: removed ${cleaned} expired entries`);
  }
}, 60 * 60 * 1000);
