import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs/promises'
import { dedupe } from './utils'

// Load environment variables from .env.local
config({ path: '.env.local' })

const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

type JMEntry = {
  seq: number
  kanji?: { text: string }[]
  kana?:  { text: string }[]
  sense:  { gloss: { lang: string, text: string }[], pos?: string[], misc?: string[], field?: string[], dialect?: string[] }[]
  tags?:  { common?: boolean, freq?: string[] }
}

async function load(path: string): Promise<JMEntry[]> {
  const txt = await fs.readFile(path, 'utf8')
  return JSON.parse(txt)
}

function toRow(entry: any) {
  const seq = parseInt(entry.id)
  if (isNaN(seq)) return null
  
  // Extract kanji and kana from the new structure
  const kanji = entry.kanji?.map((k: any) => k.text) || []
  const kana = entry.kana?.map((k: any) => k.text) || []
  
  // Extract sense information
  const sense = entry.sense?.[0] || {}
  const glosses = sense.gloss?.map((g: any) => g.text) || []
  const pos = sense.partOfSpeech || []
  const misc = sense.misc || []
  
  // Check if it's a common word
  const isCommon = entry.kana?.some((k: any) => k.common) || false
  
  // Extract frequency tags from misc
  const freqTags = misc.filter((m: string) => m.startsWith('ichi') || m.startsWith('news') || m.startsWith('spec'))
  
  // Create search text
  const searchText = [...kanji, ...kana, ...glosses].join(' ')
  
  return {
    seq,
    headwords: dedupe(kanji),
    readings: dedupe(kana),
    glosses_en: dedupe(glosses),
    is_common: isCommon,
    pos_tags: dedupe(pos),
    freq_tags: dedupe(freqTags),
    search_text: searchText,
    raw: entry
  }
}

async function upsertBatch(rows: any[]) {
  const { error } = await sb.from('jmdict_entries').upsert(rows, { onConflict: 'seq' })
  if (error) throw error
}

async function main() {
  const filePath = process.argv[2] || './data/dict/sample-jmdict.json'
  console.log(`📚 Importing JMdict from: ${filePath}`)
  
  const data = JSON.parse(await fs.readFile(filePath, 'utf8'))
  
  // Handle both old sample format and new full format
  let entries: any[]
  if (data.words && Array.isArray(data.words)) {
    // New full format
    entries = data.words
    console.log(`📖 Found ${entries.length} words in full JMdict format`)
  } else if (Array.isArray(data)) {
    // Old sample format
    entries = data
    console.log(`📖 Found ${entries.length} words in sample format`)
  } else {
    throw new Error('Unknown JMdict format')
  }
  
  console.log(`🚀 Starting import of ${entries.length} words...`)
  
  // Process in batches
  const BATCH_SIZE = 1000
  let processed = 0
  
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE)
    const rows = batch.map(toRow).filter(Boolean)
    
    if (rows.length > 0) {
      const { error } = await sb
        .from('jmdict_entries')
        .upsert(rows, { onConflict: 'seq' })
      
      if (error) {
        console.error(`❌ Batch ${Math.floor(i/BATCH_SIZE) + 1} failed:`, error)
        break
      }
    }
    
    processed += batch.length
    if (processed % 5000 === 0 || processed === entries.length) {
      console.log(`📊 Progress: ${processed}/${entries.length} (${Math.round(processed/entries.length*100)}%)`)
    }
  }
  
  console.log(`✅ JMdict import complete. Processed ${processed} words.`)
}

const fileArg = process.argv[2]
if (!fileArg) throw new Error('Usage: ts-node scripts/dict/import-jmdict.ts ./data/dict/jmdict.json')
main().catch(e => { console.error(e); process.exit(1) }) 