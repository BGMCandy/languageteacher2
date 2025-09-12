import { NextRequest, NextResponse } from 'next/server'
import { createClientBrowser } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phrase, pinyin, translation_en, literal_en, meaning, tags, links } = body

    // Validate required fields
    if (!phrase || !pinyin || !translation_en) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClientBrowser()

    // Start transaction by inserting the phrase
    const { data: phraseData, error: phraseError } = await supabase
      .from('zh_phrases')
      .insert({
        phrase,
        pinyin,
        translation_en,
        literal_en: literal_en || null,
        meaning: meaning || null,
        tags: tags || []
      })
      .select('id')
      .single()

    if (phraseError) {
      console.error('Error creating phrase:', phraseError)
      return NextResponse.json({ error: 'Failed to create phrase' }, { status: 500 })
    }

    const phraseId = phraseData.id

    // If links are provided, validate and insert character links
    if (links && links.length > 0) {
      // Validate that all characters exist in hanzi_characters
      const chars = links.map((link: any) => link.char)
      const { data: existingChars, error: charError } = await supabase
        .from('hanzi_characters')
        .select('char')
        .in('char', chars)

      if (charError) {
        console.error('Error validating characters:', charError)
        return NextResponse.json({ error: 'Failed to validate characters' }, { status: 500 })
      }

      const existingCharSet = new Set(existingChars?.map(c => c.char) || [])
      const missingChars = chars.filter((char: string) => !existingCharSet.has(char))

      if (missingChars.length > 0) {
        console.warn(`Missing characters: ${missingChars.join(', ')}`)
        // Filter out missing characters
        const validLinks = links.filter((link: any) => existingCharSet.has(link.char))
        
        if (validLinks.length > 0) {
          const { error: linkError } = await supabase
            .from('zh_phrase_chars')
            .insert(validLinks.map((link: any) => ({
              phrase_id: phraseId,
              char: link.char,
              char_index: link.index
            })))

          if (linkError) {
            console.error('Error creating character links:', linkError)
            // Don't fail the whole request, just log the error
          }
        }
      } else {
        // All characters exist, insert all links
        const { error: linkError } = await supabase
          .from('zh_phrase_chars')
          .insert(links.map((link: any) => ({
            phrase_id: phraseId,
            char: link.char,
            char_index: link.index
          })))

        if (linkError) {
          console.error('Error creating character links:', linkError)
          // Don't fail the whole request, just log the error
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      phrase_id: phraseId,
      message: 'Phrase created successfully' 
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phraseId = searchParams.get('id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = createClientBrowser()

    if (phraseId) {
      // Get specific phrase with character details
      const { data, error } = await supabase
        .from('zh_phrases')
        .select(`
          *,
          zh_phrase_chars (
            char,
            char_index,
            hanzi_characters (
              kdefinition,
              kmandarin,
              properties
            )
          )
        `)
        .eq('id', phraseId)
        .single()

      if (error) {
        console.error('Error fetching phrase:', error)
        return NextResponse.json({ error: 'Phrase not found' }, { status: 404 })
      }

      return NextResponse.json(data)
    } else {
      // Get list of phrases
      const { data, error } = await supabase
        .from('zh_phrases')
        .select('id, phrase, pinyin, translation_en, tags, created_at')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Error fetching phrases:', error)
        return NextResponse.json({ error: 'Failed to fetch phrases' }, { status: 500 })
      }

      return NextResponse.json({ phrases: data })
    }

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
