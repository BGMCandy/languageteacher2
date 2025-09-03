'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientBrowser, ThaiConsonant, ThaiVowel, ThaiTone } from '@/lib/supabase'
import QuizStartAnimation from '@/app/components/elements/animations/QuizStartAnimation'

interface QuizConfig {
  component: string
  questionCount: number
  quizType: 'pronunciation' | 'meaning' | 'mixed'
}

interface QuizQuestion {
  character: ThaiConsonant | ThaiVowel | ThaiTone
  question: string
  correctAnswer: string
  options: string[]
  questionType: 'pronunciation' | 'meaning'
  characterType: 'consonant' | 'vowel' | 'tone'
}

export interface ThaiQuizResult {
  questionId: number
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  timeSpent: number
  thaiCharacter: string
  questionText: string
  questionType: 'pronunciation' | 'meaning'
  characterType: 'consonant' | 'vowel' | 'tone'
}

export default function ThaiQuiz({ config, onComplete }: { config: QuizConfig; onComplete: (results: ThaiQuizResult[]) => void }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<ThaiQuizResult[]>([])
  const [loading, setLoading] = useState(true)
  const [showStartAnimation, setShowStartAnimation] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState<number>(0)

  const generatePronunciationOptions = useCallback((correctAnswer: string, characters: (ThaiConsonant | ThaiVowel | ThaiTone)[]): string[] => {
    const options = [correctAnswer]
    const usedOptions = new Set([correctAnswer])
    
    while (options.length < 4 && usedOptions.size < characters.length) {
      let option: string
      if (config.component === 'consonants') {
        const consonant = characters[Math.floor(Math.random() * characters.length)] as ThaiConsonant
        option = consonant.sound_equiv
      } else if (config.component === 'vowels') {
        const vowel = characters[Math.floor(Math.random() * characters.length)] as ThaiVowel
        option = vowel.sound_equiv
      } else if (config.component === 'tones') {
        const tone = characters[Math.floor(Math.random() * characters.length)] as ThaiTone
        option = tone.pronunciation
      } else {
        break
      }
      
      if (!usedOptions.has(option)) {
        options.push(option)
        usedOptions.add(option)
      }
    }
    
    return shuffleArray(options)
  }, [config.component])

  const generateMeaningOptions = useCallback((correctAnswer: string, characters: (ThaiConsonant | ThaiVowel | ThaiTone)[]): string[] => {
    const options = [correctAnswer]
    const usedOptions = new Set([correctAnswer])
    
    while (options.length < 4 && usedOptions.size < characters.length) {
      let option: string
      if (config.component === 'consonants') {
        const consonant = characters[Math.floor(Math.random() * characters.length)] as ThaiConsonant
        option = consonant.gloss
      } else if (config.component === 'vowels') {
        const vowel = characters[Math.floor(Math.random() * characters.length)] as ThaiVowel
        option = vowel.gloss
      } else if (config.component === 'tones') {
        const tone = characters[Math.floor(Math.random() * characters.length)] as ThaiTone
        option = tone.tonename
      } else {
        break
      }
      
      if (!usedOptions.has(option)) {
        options.push(option)
        usedOptions.add(option)
      }
    }
    
    return shuffleArray(options)
  }, [config.component])

  const generateQuiz = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClientBrowser()
      
      let characters: (ThaiConsonant | ThaiVowel | ThaiTone)[] = []
      
      // Fetch characters based on selected component
      if (config.component === 'consonants') {
        const { data: consonantsData, error: consonantsError } = await supabase
          .from('thai_consonants')
          .select('*')
          .order('idx')
        
        if (consonantsError) {
          console.error('Error fetching consonants:', consonantsError)
          return
        }
        characters = consonantsData || []
      } else if (config.component === 'vowels') {
        const { data: vowelsData, error: vowelsError } = await supabase
          .from('thai_vowels')
          .select('*')
          .order('id')
        
        if (vowelsError) {
          console.error('Error fetching vowels:', vowelsError)
          return
        }
        characters = vowelsData || []
      } else if (config.component === 'tones') {
        const { data: tonesData, error: tonesError } = await supabase
          .from('thai_tones')
          .select('*')
          .order('id')
        
        if (tonesError) {
          console.error('Error fetching tones:', tonesError)
          return
        }
        characters = tonesData || []
      }
      
      if (characters.length === 0) {
        console.error('No characters found for component:', config.component)
        return
      }
      
      // Shuffle characters and generate questions
      const shuffledCharacters = [...characters].sort(() => Math.random() - 0.5)
      const quizQuestions: QuizQuestion[] = []
      
      for (let i = 0; i < Math.min(config.questionCount, shuffledCharacters.length); i++) {
        const character = shuffledCharacters[i]
        const questionType = config.quizType === 'mixed' 
          ? (Math.random() > 0.5 ? 'pronunciation' : 'meaning')
          : config.quizType
        
        let question: string
        let correctAnswer: string
        let options: string[]
        
        if (config.component === 'consonants') {
          const consonant = character as ThaiConsonant
          if (questionType === 'pronunciation') {
            question = `What is the pronunciation of "${consonant.letter}"?`
            correctAnswer = consonant.sound_equiv
            options = generatePronunciationOptions(consonant.sound_equiv, shuffledCharacters as ThaiConsonant[])
          } else {
            question = `What does "${consonant.letter}" mean?`
            correctAnswer = consonant.gloss
            options = generateMeaningOptions(consonant.gloss, shuffledCharacters as ThaiConsonant[])
          }
        } else if (config.component === 'vowels') {
          const vowel = character as ThaiVowel
          if (questionType === 'pronunciation') {
            question = `What is the pronunciation of "${vowel.letter}"?`
            correctAnswer = vowel.sound_equiv
            options = generatePronunciationOptions(vowel.sound_equiv, shuffledCharacters as ThaiVowel[])
          } else {
            question = `What does "${vowel.letter}" mean?`
            correctAnswer = vowel.gloss
            options = generateMeaningOptions(vowel.gloss, shuffledCharacters as ThaiVowel[])
          }
        } else if (config.component === 'tones') {
          const tone = character as ThaiTone
          if (questionType === 'pronunciation') {
            question = `What is the pronunciation of "${tone.mark}"?`
            correctAnswer = tone.pronunciation
            options = generatePronunciationOptions(tone.pronunciation, shuffledCharacters as ThaiTone[])
          } else {
            question = `What does "${tone.mark}" mean?`
            correctAnswer = tone.tonename
            options = generateMeaningOptions(tone.tonename, shuffledCharacters as ThaiTone[])
          }
        } else {
          continue // Skip if component not supported
        }
        
        quizQuestions.push({
          character,
          question,
          correctAnswer,
          options: shuffleArray(options),
          questionType,
          characterType: config.component as 'consonant' | 'vowel' | 'tone'
        })
      }
      
      setQuestions(quizQuestions)
      console.log(`Generated ${quizQuestions.length} Thai ${config.component} questions`)
      
    } catch (err) {
      console.error('Error generating Thai quiz:', err)
    } finally {
      setLoading(false)
    }
  }, [config, generatePronunciationOptions, generateMeaningOptions])



  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const saveQuizResults = async (allResults: ThaiQuizResult[]) => {
    try {
      const supabase = createClientBrowser()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.error('No authenticated user found')
        return
      }

      const totalTime = allResults.reduce((sum, result) => sum + result.timeSpent, 0)
      const correctCount = allResults.filter(result => result.isCorrect).length

      // Insert quiz result
      const { data: quizResult, error: quizError } = await supabase
        .from('quiz_results_thai')
        .insert({
          user_id: user.id,
          quiz_type: config.component,
          quiz_config: {
            questionCount: config.questionCount,
            quizType: config.quizType
          },
          total_questions: allResults.length,
          correct_answers: correctCount,
          total_time_ms: totalTime
        })
        .select()
        .single()
      
      if (quizError) {
        console.error('Error saving Thai quiz result:', quizError)
        throw new Error(`Failed to save Thai quiz result: ${quizError.message}`)
      }
      
      console.log('Thai quiz result saved with ID:', quizResult.id)
      
      // Insert individual answers
      const answersToInsert = allResults.map((result, index) => ({
        quiz_result_id: quizResult.id,
        question_number: index + 1,
        question_type: result.questionType,
        thai_character: result.thaiCharacter,
        user_answer: result.userAnswer,
        correct_answer: result.correctAnswer,
        is_correct: result.isCorrect,
        time_spent_ms: result.timeSpent
      }))
      
      const { error: answersError } = await supabase
        .from('quiz_answers_thai')
        .insert(answersToInsert)
      
      if (answersError) {
        console.error('Error saving Thai quiz answers:', answersError)
        throw new Error(`Failed to save Thai quiz answers: ${answersError.message}`)
      }
      
      console.log('Thai quiz answers saved successfully')
      
    } catch (err) {
      console.error('Error saving Thai quiz results:', err)
    }
  }

  const handleAnswer = async (selectedAnswer: string) => {
    if (currentQuestion >= questions.length) return
    
    const question = questions[currentQuestion]
    const timeSpent = Date.now() - questionStartTime
    
    const result: ThaiQuizResult = {
      questionId: currentQuestion,
      userAnswer: selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect: selectedAnswer === question.correctAnswer,
      timeSpent,
      thaiCharacter: config.component === 'consonants' ? (question.character as ThaiConsonant).letter :
                     config.component === 'vowels' ? (question.character as ThaiVowel).letter :
                     (question.character as ThaiTone).mark,
      questionText: question.question,
      questionType: question.questionType,
      characterType: question.characterType
    }
    
    setUserAnswers([...userAnswers, result])
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Quiz completed - save results to Supabase
      await saveQuizResults([...userAnswers, result])
      onComplete([...userAnswers, result])
    }
  }

  useEffect(() => {
    generateQuiz()
  }, [generateQuiz])

  useEffect(() => {
    if (questions.length > 0) {
      setShowStartAnimation(true)
      setTimeout(() => {
        setShowStartAnimation(false)
        setQuestionStartTime(Date.now())
      }, 2000)
    }
  }, [questions])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin mx-auto mb-4"></div>
          <div className="text-lg text-black tracking-wider">LOADING THAI QUIZ...</div>
        </div>
      </div>
    )
  }

  if (showStartAnimation) {
    return <QuizStartAnimation />
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">No Questions Available</h1>
          <p className="text-gray-600">Unable to generate quiz questions. Please try again.</p>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 h-2">
            <div 
              className="bg-black h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-6">
            {currentQ.question}
          </h1>
          
          {/* Character Display */}
          <div className="text-8xl md:text-9xl font-bold text-black mb-6">
            {config.component === 'consonants' ? (currentQ.character as ThaiConsonant).letter :
             config.component === 'vowels' ? (currentQ.character as ThaiVowel).letter :
             (currentQ.character as ThaiTone).mark}
          </div>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="p-3 sm:p-6 text-left border-2 border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300 group cursor-pointer"
            >
              <div className="font-medium text-black group-hover:text-white transition-colors duration-300">
                {option}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
