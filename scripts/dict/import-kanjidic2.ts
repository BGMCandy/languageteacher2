import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs/promises'
import { XMLParser } from 'fast-xml-parser'
import { dedupe } from './utils'

// Load environment variables from .env.local
config({ path: '.env.local' })

const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

type KD2Char = {
  literal: string
  misc?: { grade?: number, jlpt?: number, stroke_count?: number | number[], freq?: number }
  reading_meaning?: { rmgroup?: { reading?: Array<{ '#text': string, '@_r_type': string }>, meaning?: Array<string | { '@_m_lang': string, '#text': string }> } }
}

type KD2Row = {
  kanji: string
  grade: number | null
  jlpt: number | null
  strokes: number | null
  frequency_rank: number | null
  jouyou: boolean
  on_readings: string[]
  kun_readings: string[]
  meanings_en: string[]
  radicals: null
  raw: KD2Char
}

async function load(file: string) {
  const xml = await fs.readFile(file, 'utf8')
  const p = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', textNodeName: '#text' })
  const json = p.parse(xml)
  return json.kanjidic2.character as KD2Char[]
}

function toRow(c: KD2Char) {
  const kanji = c.literal
  const grade = typeof c.misc?.grade === 'number' ? c.misc!.grade : null
  const jlpt  = typeof c.misc?.jlpt === 'number' ? c.misc.jlpt : null
  const sc    = c.misc?.stroke_count
  const strokes = Array.isArray(sc) ? sc[0] : (typeof sc === 'number' ? sc : null)
  const freq  = typeof c.misc?.freq === 'number' ? c.misc!.freq : null

  const rm = c.reading_meaning?.rmgroup
  const readings = (rm?.reading ?? []) as Array<{ '#text': string, '@_r_type': string }> | { '#text': string, '@_r_type': string }
  
  // Handle both array and single reading cases
  let on: string[] = []
  let kun: string[] = []
  
  if (Array.isArray(readings)) {
    on  = dedupe(readings.filter(r => r['@_r_type'] === 'ja_on' ).map(r => r['#text']))
    kun = dedupe(readings.filter(r => r['@_r_type'] === 'ja_kun').map(r => r['#text']))
  } else if (readings && typeof readings === 'object') {
    if (readings['@_r_type'] === 'ja_on') {
      on = [readings['#text']]
    } else if (readings['@_r_type'] === 'ja_kun') {
      kun = [readings['#text']]
    }
  }

  // Handle meanings - can be string or object with language attribute
  const meaningsRaw = (rm?.meaning ?? []) as Array<string | { '#text': string }> | string
  
  // Handle both array and string cases
  let meanings_en: string[]
  if (Array.isArray(meaningsRaw)) {
    meanings_en = dedupe(meaningsRaw
      .filter(m => m !== null && m !== undefined)
      .map(m => {
        if (typeof m === 'string') return m
        if (m && typeof m === 'object' && m['#text']) return m['#text']
        return null
      })
      .filter((m): m is string => m !== null && m !== undefined))
  } else if (typeof meaningsRaw === 'string') {
    meanings_en = [meaningsRaw]
  } else {
    meanings_en = []
  }

  const jouyou = grade !== null && grade >= 1 && grade <= 8

  return {
    kanji, grade, jlpt, strokes,
    frequency_rank: freq,
    jouyou,
    on_readings: on,
    kun_readings: kun,
    meanings_en: meanings_en.length > 0 ? meanings_en : ['(no meaning)'],
    radicals: null,
    raw: c
  }
}

async function upsertBatch(rows: KD2Row[]) {
  const { error } = await sb.from('kanjidic2').upsert(rows, { onConflict: 'kanji' })
  if (error) throw error
}

async function main(filePath: string) {
  const all = await load(filePath)
  const rows = all.map(toRow)
  const B = 1000
  for (let i=0; i<rows.length; i+=B) {
    await upsertBatch(rows.slice(i, i+B))
    console.log(`KANJIDIC2 ${Math.min(i+B, rows.length)} / ${rows.length}`)
  }
  console.log('KANJIDIC2 import complete.')
}

const fileArg = process.argv[2]
if (!fileArg) throw new Error('Usage: ts-node scripts/dict/import-kanjidic2.ts ./data/dict/kanjidic2.xml')
main(fileArg).catch(e => { console.error(e); process.exit(1) }) 