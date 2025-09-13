// lib/services/phraseRequestNormalizer.ts

export interface UIPhraseRequest {
  level?: string | number;
  type?: string;
  topic?: string;
  include_chars?: string[];
  count?: number;
  max_len?: number;
  level_system?: 'HSK' | 'difficulty' | 'grade_band';
}

export interface CanonicalPhraseRequest {
  level: {
    system: 'HSK' | 'difficulty' | 'grade_band';
    value: string | number;
  };
  type: string;
  topic?: string;
  include_chars: string[];
  count: number;
  max_len: number;
}

export class PhraseRequestNormalizer {
  /**
   * Convert UI input to canonical request format
   */
  static normalize(request: UIPhraseRequest): CanonicalPhraseRequest {
    // Normalize level system
    const levelSystem = request.level_system || 'HSK';
    
    // Normalize level value
    let levelValue: string | number;
    if (request.level !== undefined) {
      levelValue = request.level;
    } else {
      throw new Error('Level is required');
    }

    // Validate level system and value combination
    this.validateLevel(levelSystem, levelValue);

    // Normalize include_chars
    const includeChars = this.normalizeIncludeChars(request.include_chars || []);

    // Normalize type with defaults
    const type = request.type || 'phrase';

    // Normalize count with defaults and limits
    const count = Math.min(Math.max(request.count || 10, 1), 50);

    // Normalize max_len with type-specific defaults
    const maxLen = request.max_len || this.getDefaultMaxLength(type);

    return {
      level: {
        system: levelSystem,
        value: levelValue
      },
      type,
      topic: request.topic?.trim() || undefined,
      include_chars: includeChars,
      count,
      max_len: maxLen
    };
  }

  /**
   * Validate level system and value combination
   */
  private static validateLevel(system: string, value: string | number): void {
    const numValue = typeof value === 'string' ? parseInt(value) : value;
    
    switch (system) {
      case 'HSK':
        if (numValue < 1 || numValue > 6) {
          throw new Error('HSK level must be between 1 and 6');
        }
        break;
      case 'difficulty':
        if (numValue < 1 || numValue > 10) {
          throw new Error('Difficulty level must be between 1 and 10');
        }
        break;
      case 'grade_band':
        if (numValue < 1 || numValue > 12) {
          throw new Error('Grade band must be between 1 and 12');
        }
        break;
      default:
        throw new Error(`Unsupported level system: ${system}`);
    }
  }

  /**
   * Normalize and validate include_chars array
   */
  private static normalizeIncludeChars(chars: string[]): string[] {
    if (!Array.isArray(chars)) {
      return [];
    }

    // Deduplicate, filter, and sort
    const normalized = chars
      .filter(char => typeof char === 'string' && char.length === 1)
      .filter(char => this.isCJKCharacter(char))
      .filter((char, index, arr) => arr.indexOf(char) === index) // dedupe
      .sort();

    return normalized;
  }

  /**
   * Check if character is CJK (Chinese, Japanese, Korean)
   */
  private static isCJKCharacter(char: string): boolean {
    const code = char.charCodeAt(0);
    return (
      (code >= 0x4E00 && code <= 0x9FFF) || // CJK Unified Ideographs
      (code >= 0x3400 && code <= 0x4DBF) || // CJK Extension A
      (code >= 0x20000 && code <= 0x2A6DF) || // CJK Extension B
      (code >= 0x2A700 && code <= 0x2B73F) || // CJK Extension C
      (code >= 0x2B740 && code <= 0x2B81F) || // CJK Extension D
      (code >= 0x2B820 && code <= 0x2CEAF) || // CJK Extension E
      (code >= 0x2CEB0 && code <= 0x2EBEF) || // CJK Extension F
      (code >= 0x30000 && code <= 0x3134F)    // CJK Extension G
    );
  }

  /**
   * Get default max length based on type
   */
  private static getDefaultMaxLength(type: string): number {
    switch (type) {
      case 'idiom':
        return 4; // Chinese idioms are typically 4 characters
      case 'sentence':
        return 20; // Longer for sentences
      case 'phrase':
      default:
        return 14; // Default for phrases
    }
  }

  /**
   * Generate cache key from canonical request
   */
  static generateCacheKey(request: CanonicalPhraseRequest): string {
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

  /**
   * Validate canonical request
   */
  static validate(request: CanonicalPhraseRequest): void {
    if (!request.level || !request.level.system || request.level.value === undefined) {
      throw new Error('Invalid level configuration');
    }

    if (!request.type) {
      throw new Error('Type is required');
    }

    if (!Array.isArray(request.include_chars)) {
      throw new Error('include_chars must be an array');
    }

    if (request.count < 1 || request.count > 50) {
      throw new Error('Count must be between 1 and 50');
    }

    if (request.max_len < 1 || request.max_len > 50) {
      throw new Error('max_len must be between 1 and 50');
    }

    this.validateLevel(request.level.system, request.level.value);
  }
}
