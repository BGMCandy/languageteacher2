// app/api/phrases/zh-cn/test/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ENV } from '@/lib/env'

export async function GET(request: NextRequest) {
  try {
    // Test environment variables
    const envCheck = {
      hasSupabaseUrl: !!ENV.SUPABASE_URL,
      hasSupabaseAnon: !!ENV.SUPABASE_ANON,
      hasSupabaseServiceRole: !!ENV.SUPABASE_SERVICE_ROLE,
      hasOpenAIKey: !!ENV.OPENAI_API_KEY,
    };

    // Test basic request normalization
    const testRequest = {
      level: 1,
      level_system: 'HSK' as const,
      type: 'phrase',
      topic: 'test',
      include_chars: ['你', '好'],
      count: 1,
      max_len: 4
    };

    return NextResponse.json({
      status: 'ok',
      env: envCheck,
      testRequest,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
