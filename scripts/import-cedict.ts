import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Environment variables loaded

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface CedictEntry {
  traditional: string
  simplified: string
  pinyin: string
  definitions: string[]
}

function parseCedictLine(line: string): CedictEntry | null {
  // Skip empty lines and comments
  if (!line.trim() || line.startsWith('#')) {
    return null
  }

  // Parse format: 劇 剧 [ju4] /theatrical work/.../
  // The format is: traditional simplified [pinyin] /definition1/definition2/...
  
  // Try the standard format: traditional simplified [pinyin] /definitions/
  // Use a more robust regex approach
  const match = line.match(/^(.+?)\s+\[([^\]]+)\]\s+(.+)$/)
  
  if (!match) {
    // Try a different approach - find the first occurrence of [ and ]
    const openBracket = line.indexOf('[')
    const closeBracket = line.indexOf(']')
    
    if (openBracket > 0 && closeBracket > openBracket) {
      const characters = line.substring(0, openBracket).trim()
      const pinyin = line.substring(openBracket + 1, closeBracket)
      const definitionsStr = line.substring(closeBracket + 1).trim()
      
      // Split the characters into traditional and simplified
      const charParts = characters.split(/\s+/)
      const traditional = charParts[0] || ''
      const simplified = charParts[1] || traditional

      // Parse definitions
      const definitions = definitionsStr
        .split('/')
        .map(def => def.trim())
        .filter(def => def.length > 0)

      return {
        traditional,
        simplified,
        pinyin: pinyin.trim(),
        definitions
      }
    }
    
    console.warn(`Could not parse line: "${line.substring(0, 50)}..."`)
    return null
  }

  const [, characters, pinyin, definitionsStr] = match

  // Split the characters into traditional and simplified
  // The format is: "traditional simplified" or just "traditional" if they're the same
  const charParts = characters.trim().split(/\s+/)
  const traditional = charParts[0] || ''
  const simplified = charParts[1] || traditional

  // Parse definitions (split by / and filter out empty strings)
  const definitions = definitionsStr
    .split('/')
    .map(def => def.trim())
    .filter(def => def.length > 0)

  return {
    traditional,
    simplified,
    pinyin: pinyin.trim(),
    definitions
  }
}

async function importCedictData() {
  try {
    console.log('Starting CEDICT import...')
    
    // Read the CEDICT file
    const filePath = path.join(process.cwd(), 'src/app/temp/cedict_ts.u8')
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const lines = fileContent.split('\n')

    console.log(`Found ${lines.length} lines in CEDICT file`)

    const entries: CedictEntry[] = []
    let processedCount = 0
    let skippedCount = 0

    // Parse all lines
    for (const line of lines) {
      const entry = parseCedictLine(line)
      if (entry) {
        entries.push(entry)
        processedCount++
      } else {
        skippedCount++
      }

      // Log progress every 1000 entries
      if (processedCount % 1000 === 0) {
        console.log(`Processed ${processedCount} entries...`)
      }
    }

    console.log(`Parsed ${processedCount} entries, skipped ${skippedCount} lines`)

    // Insert in batches of 1000
    const batchSize = 1000
    let insertedCount = 0

    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize)
      
      const { data, error } = await supabase
        .from('cedict_entries')
        .insert(batch)
        .select()

      if (error) {
        console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error)
        throw error
      }

      insertedCount += batch.length
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(entries.length / batchSize)} (${insertedCount}/${entries.length} entries)`)
    }

    console.log(`✅ Successfully imported ${insertedCount} CEDICT entries!`)

  } catch (error) {
    console.error('Import failed:', error)
    process.exit(1)
  }
}

// Run the import
importCedictData()
