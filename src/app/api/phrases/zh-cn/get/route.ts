// app/api/phrases/zh-cn/get/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PhraseRequestNormalizer, UIPhraseRequest } from '@/lib/services/phraseRequestNormalizer'
import { GetOrGenerateOrchestrator } from '@/lib/services/orchestrator'
import { headers } from 'next/headers'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';
    
    if (!await checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request
    const body: UIPhraseRequest = await request.json();
    
    if (!body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    // Normalize request to canonical format
    let canonicalRequest;
    try {
      canonicalRequest = PhraseRequestNormalizer.normalize(body);
      PhraseRequestNormalizer.validate(canonicalRequest);
    } catch (error) {
      return NextResponse.json(
        { error: `Invalid request: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 400 }
      );
    }

    // Get user context if available
    const headersList = await headers();
    const userId = headersList.get('x-user-id'); // Set by middleware if authenticated

    // Generate phrase using orchestrator
    const orchestrator = new GetOrGenerateOrchestrator();
    const result = await orchestrator.getOrGeneratePhrase(
      canonicalRequest,
      userId || undefined,
      ip,
      userAgent
    );

    // Return the phrase with metadata - convert PhraseRecord to GeneratedPhrase format
    return NextResponse.json({
      phrase: {
        phrase: result.phrase.phrase,
        translation_en: result.phrase.translation_en,
        pinyin_marks: result.phrase.pinyin_marks,
        pinyin_numbers: result.phrase.pinyin_numbers,
        level_system: result.phrase.level_system,
        level_value: result.phrase.level_value,
        level_confidence: result.phrase.level_confidence,
        type: result.phrase.type,
        topic: result.phrase.topic,
        length: result.phrase.length,
        char_set: result.phrase.char_set,
        char_occurrences: result.phrase.char_occurrences,
        include_chars_present: result.phrase.include_chars_present,
        tags: result.phrase.tags,
        quality_checks: result.phrase.quality_checks,
        source: result.source,
        confidence: result.confidence,
        generation_time_ms: result.generation_time_ms
      }
    });

  } catch (error) {
    console.error('Phrase generation API error:', error);
    
    // Return user-friendly error message
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return NextResponse.json(
      { 
        error: 'Failed to generate phrase',
        details: errorMessage,
        fallback: {
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
        }
      },
      { status: 500 }
    );
  }
}

/**
 * Check rate limit for IP address
 */
async function checkRateLimit(ip: string): Promise<boolean> {
  const now = Date.now();
  const windowMs = 2 * 1000; // 2 seconds
  const maxRequests = 3; // Max 3 requests per 2 seconds

  const key = `rate_limit:${ip}`;
  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    // Reset or create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  // Increment count
  current.count++;
  rateLimitStore.set(key, current);
  return true;
}

/**
 * Clean up expired rate limit entries
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute
