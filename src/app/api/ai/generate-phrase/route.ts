import { NextRequest, NextResponse } from 'next/server'
import { createClientBrowser } from '@/lib/supabase'

interface GeneratePhraseRequest {
  language: 'zh' | 'ja'
  level: number
  topic?: string
  maxLength?: number
}

interface CharacterInfo {
  char: string
  grade_level: number | null
  has_definition: boolean
  has_pinyin: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body: GeneratePhraseRequest = await request.json()
    const { language, level, topic, maxLength = 4 } = body

    if (!language || !level) {
      return NextResponse.json({ error: 'Language and level are required' }, { status: 400 })
    }

    const supabase = createClientBrowser()

    // Get characters appropriate for the level
    let characters: CharacterInfo[] = []
    
    if (language === 'zh') {
      const { data, error } = await supabase
        .from('hanzi_characters')
        .select('char, properties, kdefinition, kmandarin')
        .eq('properties->>kGradeLevel', level.toString())
        .not('kdefinition', 'is', null)
        .limit(100)

      if (error) {
        console.error('Error fetching Chinese characters:', error)
        return NextResponse.json({ error: 'Failed to fetch characters' }, { status: 500 })
      }

      characters = data?.map(item => ({
        char: item.char,
        grade_level: item.properties?.kGradeLevel ? parseInt(String(item.properties.kGradeLevel)) : null,
        has_definition: !!item.kdefinition,
        has_pinyin: !!(item.kmandarin && item.kmandarin.length > 0)
      })) || []
    } else if (language === 'ja') {
      const { data, error } = await supabase
        .from('japanese_kanji')
        .select('letter, jlpt_level, frequency_rank')
        .eq('jlpt_level', level)
        .limit(100)

      if (error) {
        console.error('Error fetching Japanese kanji:', error)
        return NextResponse.json({ error: 'Failed to fetch kanji' }, { status: 500 })
      }

      characters = data?.map(item => ({
        char: item.letter,
        grade_level: item.jlpt_level,
        has_definition: true, // Assume kanji have definitions
        has_pinyin: false // Japanese doesn't use pinyin
      })) || []
    }

    if (characters.length === 0) {
      return NextResponse.json({ error: `No characters found for ${language} level ${level}` }, { status: 404 })
    }

    // Create AI prompt for phrase generation
    const characterList = characters.slice(0, 20).map(c => c.char).join(', ')
    const topicContext = topic ? ` about "${topic}"` : ''
    
    const _prompt = language === 'zh' 
      ? `Generate a Chinese phrase${topicContext} using only these characters: ${characterList}. 
         Requirements:
         - Use 2-${maxLength} characters from the provided list
         - Create a common, useful phrase
         - Provide pinyin with tone numbers
         - Give English translation and literal meaning
         - Include appropriate tags
         
         Respond in JSON format:
         {
           "phrase": "characters",
           "pinyin": ["pinyin1", "pinyin2"],
           "translation_en": "English translation",
           "literal_en": "literal word-by-word meaning",
           "meaning": "context and usage",
           "tags": ["tag1", "tag2"]
         }`
      : `Generate a Japanese phrase${topicContext} using only these kanji: ${characterList}.
         Requirements:
         - Use 2-${maxLength} kanji from the provided list
         - Create a common, useful phrase
         - Provide hiragana reading
         - Give romaji, English translation and literal meaning
         - Include appropriate tags
         
         Respond in JSON format:
         {
           "phrase": "kanji",
           "reading_kana": "hiragana reading",
           "romaji": "romaji reading",
           "translation_en": "English translation",
           "literal_en": "literal word-by-word meaning",
           "meaning": "context and usage",
           "tags": ["tag1", "tag2"]
         }`

    // For now, we'll use a simple fallback system
    // In production, you'd call OpenAI/Claude API here
    const generatedPhrase = generateFallbackPhrase(language, level, characters, topic)

    return NextResponse.json(generatedPhrase)

  } catch (error) {
    console.error('AI Generation Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Fallback phrase generation (replace with actual AI API call)
function generateFallbackPhrase(
  language: 'zh' | 'ja', 
  level: number, 
  characters: CharacterInfo[], 
  _topic?: string,
) {
  const availableChars = characters.slice(0, 10).map(c => c.char)
  
  if (language === 'zh') {
    const phrases = [
      {
        phrase: availableChars.slice(0, 2).join(''),
        pinyin: ['hao3', 'ren2'],
        translation_en: 'Good person',
        literal_en: 'good-person',
        meaning: 'A kind, virtuous person',
        tags: ['basic', 'character']
      },
      {
        phrase: availableChars.slice(0, 3).join(''),
        pinyin: ['da4', 'jia1', 'hao3'],
        translation_en: 'Hello everyone',
        literal_en: 'big-family-good',
        meaning: 'Greeting to a group of people',
        tags: ['greeting', 'social']
      }
    ]
    
    return phrases[Math.floor(Math.random() * phrases.length)]
  } else {
    const phrases = [
      {
        phrase: availableChars.slice(0, 2).join(''),
        reading_kana: 'こんにちは',
        romaji: 'konnichiwa',
        translation_en: 'Hello',
        literal_en: 'today',
        meaning: 'Common daytime greeting',
        tags: ['greeting', 'basic']
      },
      {
        phrase: availableChars.slice(0, 3).join(''),
        reading_kana: 'ありがとう',
        romaji: 'arigatou',
        translation_en: 'Thank you',
        literal_en: 'difficult-to-exist',
        meaning: 'Expression of gratitude',
        tags: ['gratitude', 'basic']
      }
    ]
    
    return phrases[Math.floor(Math.random() * phrases.length)]
  }
}
