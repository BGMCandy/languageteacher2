import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for your language data
export interface JapaneseKanji {
  id?: number
  letter: string
  name: string
  reading: string
  sound_equiv: string
  level: string
}

export interface JapaneseHiragana {
  id?: number
  letter: string
  name: string
  reading: string
  sound_equiv: string
  level: string
}

export interface JapaneseKatakana {
  id?: number
  letter: string
  name: string
  reading: string
  sound_equiv: string
  level: string
}

export interface ThaiConsonant {
  id?: number
  letter: string
  name: string
  reading: string
  sound_equiv: string
  level: string
  wav_file?: string
}

export interface ThaiVowel {
  id?: number
  letter: string
  name: string
  reading: string
  sound_equiv: string
  level: string
  wav_file?: string
}

export interface ThaiTone {
  id?: number
  letter: string
  name: string
  reading: string
  sound_equiv: string
  level: string
  wav_file?: string
}

export type LanguageCard = JapaneseKanji | JapaneseHiragana | JapaneseKatakana | ThaiConsonant | ThaiVowel | ThaiTone 