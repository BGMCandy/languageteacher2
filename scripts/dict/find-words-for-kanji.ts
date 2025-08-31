import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: '.env.local' })

const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

type KanjiWithWord = {
  kanji: string
  grade: number | null
  word: string
  reading: string
  meaning: string
  is_common: boolean
}

async function findWordsForKanji() {
  console.log('Finding words for each kanji...')
  
  // Get all kanji from your japanese_kanji table
  const { data: kanjiList, error: kanjiError } = await sb
    .from('japanese_kanji')
    .select('letter, level')
    .order('level')
  
  if (kanjiError) {
    throw new Error(`Failed to fetch kanji: ${kanjiError.message}`)
  }
  
  console.log(`Found ${kanjiList.length} kanji to process`)
  
  const results: KanjiWithWord[] = []
  let foundCount = 0
  let notFoundCount = 0
  
  for (const kanji of kanjiList) {
    const letter = kanji.letter
    const level = kanji.level
    
    // Try to find a word containing this kanji
    const { data: words, error: wordError } = await sb
      .from('jmdict_entries')
      .select('headwords, readings, glosses_en, is_common')
      .or(`headwords.cs.{${letter}},readings.cs.{${letter}}`)
      .eq('is_common', true)  // Prefer common words
      .limit(1)
    
    if (wordError) {
      console.error(`Error finding word for ${letter}:`, wordError.message)
      continue
    }
    
    if (words && words.length > 0) {
      const word = words[0]
      const headword = word.headwords.find((h: string) => h.includes(letter)) || word.headwords[0] || ''
      const reading = word.readings[0] || ''
      const meaning = word.glosses_en[0] || ''
      
      results.push({
        kanji: letter,
        grade: level,
        word: headword,
        reading: reading,
        meaning: meaning,
        is_common: word.is_common
      })
      
      foundCount++
      console.log(`✓ ${letter} (level ${level}): ${headword} (${reading}) - ${meaning}`)
    } else {
      // Try without the common filter
      const { data: anyWords, error: anyWordError } = await sb
        .from('jmdict_entries')
        .select('headwords, readings, glosses_en, is_common')
        .or(`headwords.cs.{${letter}},readings.cs.{${letter}}`)
        .limit(1)
      
      if (anyWords && anyWords.length > 0) {
        const word = anyWords[0]
                 const headword = word.headwords.find((h: string) => h.includes(letter)) || word.headwords[0] || ''
        const reading = word.readings[0] || ''
        const meaning = word.glosses_en[0] || ''
        
        results.push({
          kanji: letter,
          grade: level,
          word: headword,
          reading: reading,
          meaning: meaning,
          is_common: word.is_common
        })
        
        foundCount++
        console.log(`✓ ${letter} (level ${level}): ${headword} (${reading}) - ${meaning}`)
      } else {
        notFoundCount++
        console.log(`✗ ${letter} (level ${level}): No word found`)
      }
    }
    
    // Small delay to be nice to the database
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`Total kanji: ${kanjiList.length}`)
  console.log(`Words found: ${foundCount}`)
  console.log(`No words found: ${notFoundCount}`)
  console.log(`Success rate: ${((foundCount / kanjiList.length) * 100).toFixed(1)}%`)
  
  // Save results to a file
  const fs = await import('fs/promises')
  const path = await import('path')
  
  const outputPath = path.join(process.cwd(), 'data/dict/kanji-words.json')
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2), 'utf8')
  console.log(`\n💾 Results saved to: ${outputPath}`)
  
  // Show some examples
  console.log(`\n📝 Examples:`)
  results.slice(0, 10).forEach(r => {
    console.log(`${r.kanji} (level ${r.grade}): ${r.word} (${r.reading}) - ${r.meaning}`)
  })
  
  return results
}

findWordsForKanji().catch(e => {
  console.error('Error:', e)
  process.exit(1)
}) 