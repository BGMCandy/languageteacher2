// lib/services/errorHandler.ts

// TypeScript types for error objects
interface OpenAIError extends Error {
  code?: string;
  status?: number;
}

interface SupabaseError extends Error {
  code?: string;
}

export interface ErrorContext {
  operation: string;
  userId?: string;
  requestId?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ErrorDetails {
  type: string;
  message: string;
  context: ErrorContext;
  stack?: string;
  retryable: boolean;
  userMessage: string;
}

export class ErrorHandler {
  /**
   * Handle and categorize errors with appropriate user messages
   */
  static handleError(error: unknown, context: ErrorContext): ErrorDetails {
    const timestamp = new Date().toISOString();
    const fullContext = { ...context, timestamp };

    // OpenAI API errors
    if (this.isOpenAIError(error)) {
      return {
        type: 'openai_error',
        message: error.message,
        context: fullContext,
        stack: error.stack,
        retryable: this.isRetryableOpenAIError(error),
        userMessage: this.getOpenAIUserMessage(error)
      };
    }

    // Supabase/Database errors
    if (this.isSupabaseError(error)) {
      return {
        type: 'database_error',
        message: error.message,
        context: fullContext,
        stack: error.stack,
        retryable: this.isRetryableDatabaseError(error),
        userMessage: 'Database error occurred. Please try again.'
      };
    }

    // Validation errors
    if (this.isValidationError(error)) {
      return {
        type: 'validation_error',
        message: error.message,
        context: fullContext,
        retryable: false,
        userMessage: error.message
      };
    }

    // Rate limiting errors
    if (this.isRateLimitError(error)) {
      return {
        type: 'rate_limit_error',
        message: error.message,
        context: fullContext,
        retryable: true,
        userMessage: 'Too many requests. Please wait a moment and try again.'
      };
    }

    // Network errors
    if (this.isNetworkError(error)) {
      return {
        type: 'network_error',
        message: error.message,
        context: fullContext,
        stack: error.stack,
        retryable: true,
        userMessage: 'Network error. Please check your connection and try again.'
      };
    }

    // Generic errors
    return {
      type: 'unknown_error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      context: fullContext,
      stack: error instanceof Error ? error.stack : undefined,
      retryable: false,
      userMessage: 'An unexpected error occurred. Please try again.'
    };
  }

  /**
   * Get fallback phrase for when generation fails
   */
  static getFallbackPhrase(level: string = '1'): Record<string, unknown> {
    const fallbackPhrases = {
      '1': {
        phrase: '你好',
        translation_en: 'Hello',
        pinyin_marks: ['nǐ', 'hǎo'],
        pinyin_numbers: ['ni3', 'hao3'],
        level_system: 'HSK',
        level_value: '1',
        level_confidence: 0.9,
        type: 'phrase',
        length: 2,
        char_set: ['你', '好'],
        char_occurrences: { '你': 1, '好': 1 },
        include_chars_present: [],
        tags: ['greeting', 'basic'],
        quality_checks: {
          contains_all_required_chars: true,
          length_ok: true,
          level_reasonable: true
        }
      },
      '2': {
        phrase: '谢谢',
        translation_en: 'Thank you',
        pinyin_marks: ['xiè', 'xie'],
        pinyin_numbers: ['xie4', 'xie'],
        level_system: 'HSK',
        level_value: '2',
        level_confidence: 0.9,
        type: 'phrase',
        length: 2,
        char_set: ['谢', '谢'],
        char_occurrences: { '谢': 2 },
        include_chars_present: [],
        tags: ['politeness', 'basic'],
        quality_checks: {
          contains_all_required_chars: true,
          length_ok: true,
          level_reasonable: true
        }
      }
    };

    return fallbackPhrases[level as keyof typeof fallbackPhrases] || fallbackPhrases['1'];
  }

  /**
   * Log error with appropriate level
   */
  static logError(errorDetails: ErrorDetails): void {
    const logLevel = errorDetails.retryable ? 'warn' : 'error';
    const logMessage = {
      type: errorDetails.type,
      message: errorDetails.message,
      context: errorDetails.context,
      retryable: errorDetails.retryable
    };

    if (logLevel === 'error') {
      console.error('Error occurred:', logMessage);
    } else {
      console.warn('Retryable error occurred:', logMessage);
    }

    // In production, you'd send this to your logging service
    // e.g., Sentry, DataDog, CloudWatch, etc.
  }

  /**
   * Check if error is retryable with exponential backoff
   */
  static shouldRetry(errorDetails: ErrorDetails, attemptCount: number): boolean {
    if (!errorDetails.retryable) return false;
    if (attemptCount >= 3) return false; // Max 3 retries

    // Return true to indicate retry should happen (delay handled elsewhere)
    return true;
  }

  // Type guards
  private static isOpenAIError(error: unknown): error is OpenAIError {
    return error instanceof Error && (
      error.message.includes('OpenAI') ||
      error.message.includes('assistant') ||
      error.message.includes('API key') ||
      (error as OpenAIError).code === 'insufficient_quota' ||
      (error as OpenAIError).status === 429 ||
      (error as OpenAIError).status === 500 ||
      (error as OpenAIError).status === 502 ||
      (error as OpenAIError).status === 503
    );
  }

  private static isSupabaseError(error: unknown): error is SupabaseError {
    return error instanceof Error && (
      error.message.includes('Supabase') ||
      error.message.includes('database') ||
      error.message.includes('connection') ||
      (error as SupabaseError).code?.startsWith('PGRST') ||
      (error as SupabaseError).code?.startsWith('23505') // Unique constraint violation
    ) || false;
  }

  private static isValidationError(error: unknown): error is Error {
    return error instanceof Error && (
      error.message.includes('Invalid') ||
      error.message.includes('required') ||
      error.message.includes('validation') ||
      error.name === 'ValidationError'
    );
  }

  private static isRateLimitError(error: unknown): error is Error {
    return error instanceof Error && (
      error.message.includes('rate limit') ||
      error.message.includes('too many requests') ||
      error.message.includes('429')
    );
  }

  private static isNetworkError(error: unknown): error is Error {
    return error instanceof Error && (
      error.message.includes('network') ||
      error.message.includes('timeout') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ENOTFOUND')
    );
  }

  private static isRetryableOpenAIError(error: unknown): boolean {
    const err = error as Error & { code?: string; status?: number };
    return err.status === 429 || // Rate limit
           err.status === 500 || // Internal server error
           err.status === 502 || // Bad gateway
           err.status === 503 || // Service unavailable
           err.code === 'insufficient_quota';
  }

  private static isRetryableDatabaseError(error: unknown): boolean {
    const err = error as Error & { code?: string };
    return err.code === 'PGRST301' || // Connection error
           err.message.includes('connection') ||
           err.message.includes('timeout');
  }

  private static getOpenAIUserMessage(error: unknown): string {
    const err = error as Error & { code?: string; status?: number };
    if (err.status === 429) {
      return 'AI service is busy. Please wait a moment and try again.';
    }
    if (err.code === 'insufficient_quota') {
      return 'AI service quota exceeded. Please try again later.';
    }
    if (err.status && err.status >= 500) {
      return 'AI service is temporarily unavailable. Please try again.';
    }
    return 'AI generation failed. Please try again.';
  }
}
