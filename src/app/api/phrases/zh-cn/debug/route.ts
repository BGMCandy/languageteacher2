// Debug endpoint to test the orchestrator directly
import { NextRequest, NextResponse } from 'next/server'
import { GetOrGenerateOrchestrator } from '@/lib/services/orchestrator'
import { PhraseRequestNormalizer } from '@/lib/services/phraseRequestNormalizer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Debug endpoint received:', JSON.stringify(body, null, 2));
    
    // Normalize request
    const canonicalRequest = PhraseRequestNormalizer.normalize(body);
    console.log('Canonical request:', JSON.stringify(canonicalRequest, null, 2));
    
    // Test OpenAI client directly first
    console.log('Testing OpenAI client directly...');
    const { OpenAIClient } = await import('@/lib/services/openaiClient');
    const openaiClient = new OpenAIClient();
    
    try {
      const aiResult = await openaiClient.generatePhrases(canonicalRequest);
      console.log('OpenAI client result:', JSON.stringify(aiResult, null, 2));
      
      return NextResponse.json({
        success: true,
        aiResult: aiResult
      });
    } catch (aiError) {
      console.error('OpenAI client error:', aiError);
      return NextResponse.json({
        success: false,
        error: aiError instanceof Error ? aiError.message : 'Unknown AI error',
        stack: aiError instanceof Error ? aiError.stack : undefined
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
