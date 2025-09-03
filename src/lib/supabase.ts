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
  idx: number
  letter: string
  name: string
  sound_equiv: string
  class: 'mid' | 'high' | 'low'
  gloss: string
  example: string
  ipa: string
  wav_file: string
}

export interface ThaiVowel {
  id: number
  letter: string
  name: string
  length: 'long' | 'short'
  form: 'pre' | 'post' | 'above' | 'below' | 'around'
  gloss: string
  example: string
  ipa: string
  sound_equiv: string
  wav_file: string
}

export interface ThaiTone {
  id: number
  tonename: string
  mark: string
  unicode: string
  function: string
  pronunciation: string
  gloss: string
  example: string
}

export type LanguageCard = JapaneseKanji | JapaneseHiragana | JapaneseKatakana | ThaiConsonant | ThaiVowel | ThaiTone

// Thai Quiz Types
export interface ThaiQuizResult {
  id?: string
  user_id: string
  quiz_type: 'consonants' | 'vowels' | 'tones' | 'vocabulary'
  quiz_config: {
    questionCount: number
    quizType: 'pronunciation' | 'meaning' | 'mixed'
  }
  total_questions: number
  correct_answers: number
  total_time_ms: number
  created_at?: string
  updated_at?: string
}

export interface ThaiQuizAnswer {
  id?: string
  quiz_result_id: string
  question_number: number
  question_type: 'pronunciation' | 'meaning' | 'mixed'
  thai_character: string
  user_answer: string
  correct_answer: string
  is_correct: boolean
  time_spent_ms: number
  created_at?: string
} 