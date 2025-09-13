// lib/services/rateLimiter.ts

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 5000, maxRequests: number = 1) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  /**
   * Check if request is allowed for the given key
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const current = this.store.get(key);

    if (!current || now > current.resetTime) {
      // Reset or create new entry
      this.store.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }

    if (current.count >= this.maxRequests) {
      return false;
    }

    // Increment count
    current.count++;
    this.store.set(key, current);
    return true;
  }

  /**
   * Get remaining requests for a key
   */
  getRemaining(key: string): number {
    const current = this.store.get(key);
    if (!current) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - current.count);
  }

  /**
   * Get reset time for a key
   */
  getResetTime(key: string): number {
    const current = this.store.get(key);
    return current ? current.resetTime : Date.now() + this.windowMs;
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, value] of this.store.entries()) {
      if (now > value.resetTime) {
        this.store.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Get current store size
   */
  size(): number {
    return this.store.size;
  }
}

// Global rate limiter for AI requests
export const aiRequestRateLimiter = new RateLimiter(5000, 1); // 1 request per 5 seconds

// Clean up expired entries every minute
setInterval(() => {
  const cleaned = aiRequestRateLimiter.cleanup();
  if (cleaned > 0) {
    console.log(`Rate limiter cleanup: removed ${cleaned} expired entries`);
  }
}, 60 * 1000);
