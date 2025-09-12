import { NextRequest, NextResponse } from 'next/server'
import { createClientBrowser } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phrase, reading_kana, romaji, translation_en, literal_en, meaning, tags, links } = body

    // Validate required fields
    if (!phrase || !reading_kana || !translation_en) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClientBrowser()

    // Start transaction by inserting the phrase
    const { data: phraseData, error: phraseError } = await supabase
      .from('ja_phrases')
      .insert({
        phrase,
        reading_kana,
        romaji: romaji || null,
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

    // If links are provided, validate and insert kanji links
    if (links && links.length > 0) {
      // Validate that all kanji exist in japanese_kanji
      const letters = links.map((link: any) => link.letter)
      const { data: existingKanji, error: kanjiError } = await supabase
        .from('japanese_kanji')
        .select('letter')
        .in('letter', letters)

      if (kanjiError) {
        console.error('Error validating kanji:', kanjiError)
        return NextResponse.json({ error: 'Failed to validate kanji' }, { status: 500 })
      }

      const existingKanjiSet = new Set(existingKanji?.map(k => k.letter) || [])
      const missingKanji = letters.filter((letter: string) => !existingKanjiSet.has(letter))

      if (missingKanji.length > 0) {
        console.warn(`Missing kanji: ${missingKanji.join(', ')}`)
        // Filter out missing kanji
        const validLinks = links.filter((link: any) => existingKanjiSet.has(link.letter))
        
        if (validLinks.length > 0) {
          const { error: linkError } = await supabase
            .from('ja_phrase_kanji')
            .insert(validLinks.map((link: any) => ({
              phrase_id: phraseId,
              letter: link.letter,
              char_index: link.index
            })))

          if (linkError) {
            console.error('Error creating kanji links:', linkError)
            // Don't fail the whole request, just log the error
          }
        }
      } else {
        // All kanji exist, insert all links
        const { error: linkError } = await supabase
          .from('ja_phrase_kanji')
          .insert(links.map((link: any) => ({
            phrase_id: phraseId,
            letter: link.letter,
            char_index: link.index
          })))

        if (linkError) {
          console.error('Error creating kanji links:', linkError)
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
      // Get specific phrase with kanji details
      const { data, error } = await supabase
        .from('ja_phrases')
        .select(`
          *,
          ja_phrase_kanji (
            letter,
            char_index,
            japanese_kanji (
              jlpt_level,
              frequency_rank,
              mnemonics
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
        .from('ja_phrases')
        .select('id, phrase, reading_kana, romaji, translation_en, tags, created_at')
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
