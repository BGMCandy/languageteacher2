'use client'

import { useState } from 'react'
import { QuizQuestion } from '../page'

interface PracticeCardProps {
  question: QuizQuestion
  onAnswer: (answer: string) => void
}

export default function PracticeCard({ question, onAnswer }: PracticeCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const playAudio = async () => {
    if (isPlaying) return
    
    // Check if we have a WAV file URL (for Thai characters)
    if ('wav_file' in question.kanji && question.kanji.wav_file && typeof question.kanji.wav_file === 'string') {
      try {
        setIsPlaying(true)
        
        // Create audio element for WAV file
        const audio = new Audio(question.kanji.wav_file)
        
        audio.onended = () => setIsPlaying(false)
        audio.onerror = () => setIsPlaying(false)
        
        await audio.play()
        
      } catch (error) {
        console.error('Error playing WAV file:', error)
        setIsPlaying(false)
      }
    } else {
      // Fallback to text-to-speech for Japanese characters
      try {
        setIsPlaying(true)
        
        // Create speech synthesis utterance
        const utterance = new SpeechSynthesisUtterance(question.kanji.sound_equiv)
        
        // Configure speech settings for better pronunciation
        utterance.lang = 'ja-JP' // Japanese language
        utterance.rate = 0.8 // Slightly slower for clarity
        utterance.pitch = 1.0
        utterance.volume = 1.0
        
        // Handle speech events
        utterance.onstart = () => setIsPlaying(true)
        utterance.onend = () => setIsPlaying(false)
        utterance.onerror = () => setIsPlaying(false)
        
        // Speak the pronunciation
        window.speechSynthesis.speak(utterance)
        
      } catch (error) {
        console.error('Error playing audio:', error)
        setIsPlaying(false)
      }
    }
  }

  const stopAudio = () => {
    // Stop text-to-speech
    window.speechSynthesis.cancel()
    
    // Stop WAV file playback
    setIsPlaying(false)
  }

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-10 border border-slate-200 dark:border-slate-700 shadow-xl">
      {/* Question Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-200 mb-6 leading-tight">
          {question.question}
        </h2>
        
        {/* Kanji Display */}
        <div className="text-9xl font-bold text-slate-800 dark:text-slate-200 mb-6 leading-none">
          {question.kanji.letter}
        </div>
        
        {/* Additional Info with Audio Button */}
        <div className="inline-flex items-center space-x-6 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-full">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Level:</span>
            <span>{question.kanji.level}</span>
          </div>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Reading:</span>
            <span>{question.kanji.reading}</span>
          </div>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Pronunciation:</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (isPlaying) {
                  stopAudio()
                } else {
                  playAudio()
                }
              }}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                isPlaying 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              title={isPlaying ? 'Stop audio' : 'Play pronunciation'}
            >
              {isPlaying ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            className="p-6 text-left bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border-2 border-slate-200 dark:border-slate-600 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-blue-300 dark:hover:border-blue-500"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                {String.fromCharCode(65 + index)}
              </div>
              <span className="text-xl font-medium text-slate-800 dark:text-slate-200">
                {option}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Hint */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Select the correct answer above
        </p>
      </div>
    </div>
  )
} 