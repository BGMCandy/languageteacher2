// Raw test endpoint - just return whatever the AI gives us
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { ENV } from '@/lib/env'

export async function POST(request: NextRequest) {
  try {
    const openai = new OpenAI({
      apiKey: ENV.OPENAI_API_KEY,
    });

    console.log('Testing raw OpenAI call...');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a Chinese language learning assistant. Generate Chinese phrases according to the user\'s specifications. Always respond with valid JSON in the exact format requested.'
        },
        {
          role: 'user',
          content: JSON.stringify({
            level: { system: "HSK", value: 1 },
            type: "phrase",
            topic: null,
            include_chars: [],
            count: 1,
            max_len: 14
          }, null, 2)
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const message = response.choices[0]?.message;
    console.log('Raw OpenAI response:', JSON.stringify(message, null, 2));
    
    return NextResponse.json({
      success: true,
      rawResponse: message,
      content: message?.content
    });
    
  } catch (error) {
    console.error('Raw test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
