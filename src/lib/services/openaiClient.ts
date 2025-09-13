// lib/services/openaiClient.ts
import OpenAI from 'openai'
import { ENV } from '@/lib/env'
import { CanonicalPhraseRequest } from './phraseRequestNormalizer'

export interface GeneratedPhrase {
  phrase: string;
  translation_en: string;
  pinyin_marks: string;
  pinyin_numbers: string;
  level: {
    system: 'HSK' | 'difficulty' | 'grade_band';
    value: string | number;
    confidence: number;
  };
  type: 'phrase' | 'sentence' | 'chengyu';
  topic?: string[];
  length: number;
  char_set: string[];
  char_occurrences: Array<{
    char: string;
    indices: number[];
  }>;
  include_chars_present: string[];
  tags: string[];
  quality_checks: {
    contains_all_required_chars: boolean;
    length_ok: boolean;
    level_reasonable: boolean;
  };
}

export interface AIGenerationResult {
  meta: {
    request: Record<string, unknown>;
    generated_at: string;
  };
  items: GeneratedPhrase[];
  model_used: string;
  generation_time_ms: number;
}

export class OpenAIClient {
  private client: OpenAI;
  private assistantId: string = 'asst_8XAaKUGCrkLOzu0GAZpkVS4n';

  constructor() {
    if (!ENV.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.client = new OpenAI({
      apiKey: ENV.OPENAI_API_KEY,
    });
  }

  /**
   * Generate phrases using OpenAI Assistant API with Chat Completions fallback
   */
  async generatePhrases(request: CanonicalPhraseRequest, existingPhrases: string[] = []): Promise<AIGenerationResult> {
    const startTime = Date.now();
    let responseText: string | null = null;
    let modelUsed: string = 'gpt-4-chat-completions'; // Default to chat completions, update if assistant works

    try {
      console.log('Attempting Assistant API with ID:', this.assistantId);
      console.log('Request:', JSON.stringify(request, null, 2));

      // Create a new thread
      const thread = await this.client.beta.threads.create();
      console.log('Assistant API: Created thread:', thread.id);

      if (!thread.id) {
        throw new Error('Assistant API: Failed to create thread - thread.id is undefined');
      }

                // Add message to thread
                const message = await this.client.beta.threads.messages.create(thread.id, {
                  role: 'user',
                  content: this.buildPrompt(request, existingPhrases)
                });
      console.log('Assistant API: Added message to thread, message ID:', message.id);

      // Create and run the assistant
      const run = await (this.client.beta.threads.runs as any).create(thread.id, {
        assistant_id: this.assistantId
      });
      console.log('Assistant API: Created run, run ID:', run.id);

      if (!run.id) {
        throw new Error('Assistant API: Failed to create run - run.id is undefined');
      }

      // Wait for completion
      const completedRun = await this.waitForCompletion(thread.id, run.id);
      console.log('Assistant API: Run completed with status:', completedRun.status);

      // Retrieve messages
      const messagesPage = await this.client.beta.threads.messages.list(thread.id, {
        order: 'desc',
        limit: 1
      });
      console.log('Assistant API: Retrieved messages, count:', messagesPage.data.length);

      const assistantMessage = messagesPage.data.find(msg => msg.role === 'assistant');
      
      if (!assistantMessage) {
        console.error('No assistant message found');
        throw new Error('Assistant API: No assistant message found');
      }
      
      // Log the entire message content structure
      console.log('Assistant API: Full message content:', JSON.stringify(assistantMessage.content, null, 2));
      
      // Concatenate all text blocks (as recommended)
      responseText = assistantMessage.content
        .filter((b: any) => b.type === 'text')
        .map((b: any) => b.text.value)
        .join('\n');
        
      modelUsed = 'gpt-4-assistant'; // Indicate Assistant API was used

      if (!responseText) {
        console.error('No text content found in assistant message');
        throw new Error('Assistant API: No response text found from assistant');
      }
      console.log('Assistant API: Raw AI response (first 1000 chars):', responseText.slice(0, 1000));

    } catch (assistantError) {
      console.error('Assistant API failed, attempting Chat Completions fallback:', assistantError);
      console.error('Assistant API error details:', JSON.stringify(assistantError, null, 2));

      // Fallback to Chat Completions API
      try {
        console.log('Trying Chat Completions API as fallback...');
        
        const response = await this.client.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a Chinese language learning assistant. Generate Chinese phrases according to the user\'s specifications. Always respond with valid JSON in the exact format requested.'
            },
                      {
                        role: 'user',
                        content: this.buildPrompt(request, existingPhrases)
                      }
          ],
          temperature: 0.7,
          max_tokens: 2000
        });

        const message = response.choices[0]?.message;
        console.log('Chat Completions API: Full response message:', JSON.stringify(message, null, 2));
        
        responseText = message?.content;
        modelUsed = 'gpt-4-chat-completions'; // Indicate Chat Completions API was used

        if (!responseText) {
          console.error('No content in Chat Completions response');
          throw new Error('Chat Completions API: No response from OpenAI');
        }
        console.log('Chat Completions API: Raw AI response (first 1000 chars):', responseText.slice(0, 1000));

      } catch (chatCompletionsError) {
        console.error('Chat Completions API also failed:', chatCompletionsError);
        console.error('Chat Completions API error details:', JSON.stringify(chatCompletionsError, null, 2));
        throw new Error(`Failed to generate phrases with both Assistant and Chat Completions APIs: ${chatCompletionsError instanceof Error ? chatCompletionsError.message : 'Unknown error'}`);
      }
    }

    // After either Assistant API or Chat Completions API has provided a responseText
    if (!responseText) {
      throw new Error('No response text obtained from any OpenAI API method.');
    }

    const parsedResponse = this.parseResponse(responseText);
    const generationTime = Date.now() - startTime;

    return {
      meta: parsedResponse.meta as any,
      items: parsedResponse.items as any,
      model_used: modelUsed,
      generation_time_ms: generationTime
    };
  }

  /**
   * Build prompt from canonical request
   */
  private buildPrompt(request: CanonicalPhraseRequest, existingPhrases: string[] = []): string {
    return `Generate ${request.count} Chinese ${request.type}s for ${request.level.system} level ${request.level.value}.

CRITICAL: You MUST respond with JSON in this EXACT format:
{
  "meta": {
    "request": {
      "level": { "system": "${request.level.system}", "value": ${typeof request.level.value === 'string' ? `"${request.level.value}"` : request.level.value} },
      "type": "${request.type}",
      "topic": ${request.topic ? `"${request.topic}"` : 'null'},
      "include_chars": ${JSON.stringify(request.include_chars)},
      "count": ${request.count},
      "max_len": ${request.max_len}
    },
    "generated_at": "${new Date().toISOString()}"
  },
  "items": [
    {
      "phrase": "你好世界",
      "translation_en": "Hello world",
      "pinyin_marks": "nǐ hǎo shì jiè",
      "pinyin_numbers": "ni3 hao3 shi4 jie4",
      "level": { "system": "${request.level.system}", "value": ${typeof request.level.value === 'string' ? `"${request.level.value}"` : request.level.value}, "confidence": 0.9 },
      "type": "${request.type}",
      "topic": ${request.topic ? `["${request.topic}"]` : '[]'},
      "length": 4,
      "char_set": ["你", "好", "世", "界"],
      "char_occurrences": [{"char": "你", "indices": [0]}, {"char": "好", "indices": [1]}, {"char": "世", "indices": [2]}, {"char": "界", "indices": [3]}],
      "include_chars_present": ${JSON.stringify(request.include_chars)},
      "tags": ["greeting", "basic"],
      "quality_checks": { "contains_all_required_chars": true, "length_ok": true, "level_reasonable": true }
    }
  ]
}

Requirements:
- Each phrase must be ${request.max_len} characters or fewer
- Include all required characters: ${request.include_chars.join(', ') || 'none specified'}
- Provide accurate pinyin with tone marks and tone numbers
- Make phrases natural and commonly used
${existingPhrases.length > 0 ? `- AVOID duplicating these existing phrases: ${existingPhrases.join('; ')}` : ''}
${existingPhrases.length > 0 ? '- Create NEW and DIFFERENT phrases that vary from the existing ones' : ''}
- Return ONLY the JSON, no other text`;
  }

  /**
   * Get human-readable level description
   */
  private getLevelDescription(system: string, value: string | number): string {
    switch (system) {
      case 'HSK':
        return `HSK ${value}`;
      case 'difficulty':
        return `difficulty level ${value}`;
      case 'grade_band':
        return `grade ${value}`;
      default:
        return `${system} ${value}`;
    }
  }

  /**
   * Wait for assistant run to complete
   */
  private async waitForCompletion(threadId: string, runId: string, maxWaitMs: number = 30000): Promise<any> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitMs) {
      try {
        const run = await (this.client.beta.threads.runs as any).retrieve(threadId, runId);
        
        if (run.status === 'completed' || run.status === 'failed' || run.status === 'cancelled') {
          return run;
        }
        
        // Wait 1 second before checking again
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error retrieving run status:', error);
        throw error;
      }
    }
    
    throw new Error('Assistant run timed out');
  }

  /**
   * Parse assistant response JSON
   */
  private parseResponse(responseText: string): { meta: Record<string, unknown>; items: GeneratedPhrase[] } {
    try {
      console.log('Parsing response text (first 500 chars):', responseText.slice(0, 500));
      
      // Try the robust JSON extraction approach
      const parsed = this.extractJsonBlock(responseText);
      if (!parsed) {
        console.error('No valid JSON found in response text');
        throw new Error('No valid JSON found in response');
      }

      console.log('Extracted and parsed JSON structure:', JSON.stringify(parsed, null, 2));
      
      if (!parsed.meta || !parsed.items || !Array.isArray(parsed.items)) {
        console.error('Missing meta or items array in parsed response');
        console.error('Parsed keys:', Object.keys(parsed));
        throw new Error('Invalid response format: missing meta or items array');
      }

      // Validate each phrase
      for (const phrase of parsed.items) {
        this.validatePhrase(phrase);
      }

      return parsed;
    } catch (error) {
      console.error('Failed to parse assistant response:', error);
      console.error('Response text:', responseText);
      throw new Error(`Invalid response format: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Robust JSON extraction with multiple fallback strategies
   */
  private extractJsonBlock(s: string): any {
    // Try fast path - direct JSON
    try { 
      return JSON.parse(s); 
    } catch {}

    // Try fenced code blocks
    const fencedMatch = s.match(/```json\s*([\s\S]*?)```/i) || s.match(/```\s*([\s\S]*?)```/);
    if (fencedMatch) { 
      try { 
        return JSON.parse(fencedMatch[1]); 
      } catch {} 
    }

    // Try last { ... } block
    const start = s.lastIndexOf('{'); 
    const end = s.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      try { 
        return JSON.parse(s.slice(start, end + 1)); 
      } catch {}
    }

    // Try first { ... } block
    const firstMatch = s.match(/\{[\s\S]*\}/);
    if (firstMatch) {
      try {
        return JSON.parse(firstMatch[0]);
      } catch {}
    }

    return null;
  }

  /**
   * Validate individual phrase structure
   */
  private validatePhrase(phrase: Record<string, unknown>): void {
    const requiredFields = ['phrase', 'translation_en', 'pinyin_marks', 'pinyin_numbers', 'level', 'type', 'length', 'char_set', 'char_occurrences', 'include_chars_present', 'quality_checks'];
    
    for (const field of requiredFields) {
      if (!(field in phrase)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (typeof phrase.phrase !== 'string' || (phrase.phrase as string).length === 0) {
      throw new Error('Invalid phrase: must be non-empty string');
    }

    if (typeof phrase.pinyin_marks !== 'string' || typeof phrase.pinyin_numbers !== 'string') {
      throw new Error('Invalid pinyin: must be strings');
    }

    if (!phrase.level || typeof (phrase.level as any).confidence !== 'number' || (phrase.level as any).confidence < 0 || (phrase.level as any).confidence > 1) {
      throw new Error('level.confidence must be a number between 0 and 1');
    }

    if (!Array.isArray(phrase.char_set) || !Array.isArray(phrase.char_occurrences)) {
      throw new Error('char_set and char_occurrences must be arrays');
    }

    // Auto-correct length field if it doesn't match
    const actualLength = (phrase.phrase as string).length;
    if (phrase.length !== actualLength) {
      console.warn(`Length mismatch: expected ${phrase.length}, actual ${actualLength}. Auto-correcting.`);
      phrase.length = actualLength;
    }
  }
}
