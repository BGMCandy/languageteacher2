// lib/services/phraseValidator.ts
import { GeneratedPhrase } from './openaiClient'
import { CanonicalPhraseRequest } from './phraseRequestNormalizer'

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class PhraseValidator {
  /**
   * Validate generated phrase against business rules
   */
  static validate(phrase: GeneratedPhrase, request: CanonicalPhraseRequest): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate phrase structure
    this.validatePhraseStructure(phrase, errors);
    
    // Validate character requirements
    this.validateCharacterRequirements(phrase, request, errors, warnings);
    
    // Validate length constraints
    this.validateLengthConstraints(phrase, request, errors, warnings);
    
    // Validate type-specific rules
    this.validateTypeSpecificRules(phrase, request, errors, warnings);
    
    // Validate pinyin consistency
    this.validatePinyinConsistency(phrase, errors, warnings);

    console.log('Validation result:', { isValid: errors.length === 0, errors, warnings });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate basic phrase structure
   */
  private static validatePhraseStructure(phrase: GeneratedPhrase, errors: string[]): void {
    if (!phrase.phrase || typeof phrase.phrase !== 'string') {
      errors.push('Phrase must be a non-empty string');
      return;
    }

    if (phrase.phrase.length === 0) {
      errors.push('Phrase cannot be empty');
      return;
    }

    // Check for valid Chinese characters
    for (const char of phrase.phrase) {
      if (!this.isCJKCharacter(char)) {
        errors.push(`Invalid character in phrase: ${char}`);
        break;
      }
    }
  }

  /**
   * Validate character requirements
   */
  private static validateCharacterRequirements(
    phrase: GeneratedPhrase, 
    request: CanonicalPhraseRequest, 
    errors: string[], 
    warnings: string[]
  ): void {
    if (request.include_chars.length === 0) return;

    const phraseChars = new Set(phrase.phrase);
    const missingChars: string[] = [];
    const extraChars: string[] = [];

    // Check for required characters
    for (const requiredChar of request.include_chars) {
      if (!phraseChars.has(requiredChar)) {
        missingChars.push(requiredChar);
      }
    }

    if (missingChars.length > 0) {
      errors.push(`Missing required characters: ${missingChars.join(', ')}`);
    }

    // Note: Extra characters are allowed - include_chars are minimum requirements
  }

  /**
   * Validate length constraints
   */
  private static validateLengthConstraints(
    phrase: GeneratedPhrase, 
    request: CanonicalPhraseRequest, 
    errors: string[], 
    warnings: string[]
  ): void {
    const actualLength = phrase.phrase.length;
    const maxLength = request.max_len;

    if (actualLength > maxLength) {
      errors.push(`Phrase length ${actualLength} exceeds maximum ${maxLength}`);
    }

    // Warn if phrase is very short for the type
    if (request.type === 'sentence' && actualLength < 6) {
      warnings.push('Sentence seems too short for the type');
    }

    if (request.type === 'idiom' && actualLength !== 4) {
      warnings.push('Chinese idioms are typically 4 characters');
    }
  }

  /**
   * Validate type-specific rules
   */
  private static validateTypeSpecificRules(
    phrase: GeneratedPhrase, 
    request: CanonicalPhraseRequest, 
    errors: string[], 
    warnings: string[]
  ): void {
    switch (request.type) {
      case 'idiom':
        if (phrase.phrase.length !== 4) {
          errors.push('Chinese idioms must be exactly 4 characters');
        }
        break;
      
      case 'sentence':
        if (phrase.phrase.length < 6) {
          warnings.push('Sentence might be too short');
        }
        break;
      
      case 'phrase':
        if (phrase.phrase.length < 2) {
          errors.push('Phrase must be at least 2 characters');
        }
        break;
    }
  }

  /**
   * Validate pinyin consistency
   */
  private static validatePinyinConsistency(
    phrase: GeneratedPhrase, 
    errors: string[], 
    warnings: string[]
  ): void {
    const phraseLength = phrase.phrase.length;
    
    // pinyin_marks is now a string, so split it to count syllables
    const pinyinMarksCount = phrase.pinyin_marks.split(' ').length;
    
    if (pinyinMarksCount !== phraseLength) {
      errors.push(`Pinyin marks count (${pinyinMarksCount}) doesn't match phrase length (${phraseLength})`);
    }
    
    // pinyin_numbers is now a string, so split it to count syllables
    const pinyinNumbersCount = phrase.pinyin_numbers.split(' ').length;
    
    if (pinyinNumbersCount !== phraseLength) {
      errors.push(`Pinyin numbers count (${pinyinNumbersCount}) doesn't match phrase length (${phraseLength})`);
    }

    // Validate pinyin format
    const pinyinMarksArray = phrase.pinyin_marks.split(' ');
    const pinyinNumbersArray = phrase.pinyin_numbers.split(' ');
    
    for (let i = 0; i < pinyinMarksArray.length; i++) {
      const marks = pinyinMarksArray[i];
      const numbers = pinyinNumbersArray[i];
      
      if (!this.isValidPinyin(marks)) {
        warnings.push(`Invalid pinyin marks format: ${marks}`);
      }
      
      if (!this.isValidPinyinNumbers(numbers)) {
        warnings.push(`Invalid pinyin numbers format: ${numbers}`);
      }
    }
  }

  /**
   * Check if character is CJK
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
   * Validate pinyin with tone marks
   */
  private static isValidPinyin(pinyin: string): boolean {
    // Basic validation - should contain letters and possibly tone marks
    return /^[a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]+$/.test(pinyin);
  }

  /**
   * Validate pinyin with tone numbers
   */
  private static isValidPinyinNumbers(pinyin: string): boolean {
    // Should end with tone number 1-5 (5 = neutral)
    return /^[a-zA-Z]+[1-5]$/.test(pinyin);
  }

  /**
   * Compute character set and occurrences from phrase
   */
  static computeCharacterAnalysis(phrase: string): {
    char_set: string[];
    char_occurrences: Record<string, number>;
  } {
    const charSet = new Set<string>();
    const occurrences: Record<string, number> = {};

    for (const char of phrase) {
      charSet.add(char);
      occurrences[char] = (occurrences[char] || 0) + 1;
    }

    return {
      char_set: Array.from(charSet).sort(),
      char_occurrences: occurrences
    };
  }

  /**
   * Check if phrase contains all required characters
   */
  static containsAllRequiredChars(phrase: string, requiredChars: string[]): boolean {
    const phraseChars = new Set(phrase);
    return requiredChars.every(char => phraseChars.has(char));
  }
}
