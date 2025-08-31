import { createBrowserClient } from '@supabase/ssr'
import { ENV } from './env'

export function createClientBrowser() {
  const supabaseUrl = ENV.SUPABASE_URL
  const supabaseAnonKey = ENV.SUPABASE_ANON

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

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