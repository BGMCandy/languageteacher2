'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientBrowser, JapaneseKanji } from '@/lib/supabase'
import QuizStartAnimation from '@/app/components/elements/animations/QuizStartAnimation'

interface QuizConfig {
  questionCount: number
  levels: string[]
  quizType: 'pronunciation' | 'meaning' | 'mixed'
}

interface QuizQuestion {
  kanji: JapaneseKanji
  question: string
  correctAnswer: string
  options: string[]
  questionType: 'pronunciation' | 'meaning'
}

export interface QuizResult {
  questionId: number
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  timeSpent: number
  kanjiCharacter: string
  questionText: string
  questionType: 'pronunciation' | 'meaning'
}

export default function KanjiQuiz({ config, onComplete }: { config: QuizConfig; onComplete: (results: QuizResult[]) => void }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)
  const [showStartAnimation, setShowStartAnimation] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState<number>(0)

  const generateQuiz = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClientBrowser()
      
      // Build query based on selected levels
      let query = supabase
        .from('japanese_kanji')
        .select('*')
        .order('level')
        .limit(10000) // Get all kanji
      
      if (config.levels.length > 0) {
        query = query.in('level', config.levels)
      }
      
      const { data: kanjiData, error } = await query
      
      if (error) {
        console.error('Error fetching kanji:', error)
        return
      }
      
      if (!kanjiData || kanjiData.length === 0) {
        console.error('No kanji found')
        return
      }
      
      // Generate quiz questions
      const quizQuestions: QuizQuestion[] = []
      const shuffledKanji = [...kanjiData].sort(() => Math.random() - 0.5)
      
      for (let i = 0; i < Math.min(config.questionCount, shuffledKanji.length); i++) {
        const kanji = shuffledKanji[i]
        const questionType = config.quizType === 'mixed' 
          ? (Math.random() > 0.5 ? 'pronunciation' : 'meaning')
          : config.quizType
        
        let question: string
        let correctAnswer: string
        let options: string[]
        
        if (questionType === 'pronunciation') {
          question = `What is the pronunciation of "${kanji.letter}"?`
          correctAnswer = kanji.reading
          options = generatePronunciationOptions(kanji.reading, shuffledKanji)
        } else {
          question = `What does "${kanji.letter}" mean?`
          correctAnswer = kanji.name
          options = generateMeaningOptions(kanji.name, shuffledKanji)
        }
        
        quizQuestions.push({
          kanji,
          question,
          correctAnswer,
          options: shuffleArray(options),
          questionType
        })
      }
      
      setQuestions(quizQuestions)
      setQuestionStartTime(Date.now())
      setLoading(false)
      
      // Show start animation
      setShowStartAnimation(true)
      
      // Hide animation after 2 seconds and start quiz
      setTimeout(() => {
        setShowStartAnimation(false)
      }, 2000)
      
    } catch (err) {
      console.error('Error generating quiz:', err)
      setLoading(false)
    }
  }, [config])

  useEffect(() => {
    generateQuiz()
  }, [generateQuiz])

  useEffect(() => {
    if (questions.length > 0) {
      setQuestionStartTime(Date.now())
    }
  }, [currentQuestion, questions])

  const generatePronunciationOptions = (correctReading: string, allKanji: JapaneseKanji[]): string[] => {
    const options = [correctReading]
    
    // Get random readings from other kanji
    const otherReadings = allKanji
      .filter(k => k.reading !== correctReading)
      .map(k => k.reading)
      .filter((reading, index, arr) => arr.indexOf(reading) === index) // Remove duplicates
    
    while (options.length < 4 && otherReadings.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherReadings.length)
      const randomReading = otherReadings.splice(randomIndex, 1)[0]
      if (!options.includes(randomReading)) {
        options.push(randomReading)
      }
    }
    
    // Fill remaining slots with generic readings if needed
    const genericReadings = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ']
    while (options.length < 4) {
      const randomReading = genericReadings[Math.floor(Math.random() * genericReadings.length)]
      if (!options.includes(randomReading)) {
        options.push(randomReading)
      }
    }
    
    return options
  }

  const generateMeaningOptions = (correctMeaning: string, allKanji: JapaneseKanji[]): string[] => {
    const options = [correctMeaning]
    
    // Get random meanings from other kanji
    const otherMeanings = allKanji
      .filter(k => k.name !== correctMeaning)
      .map(k => k.name)
      .filter((meaning, index, arr) => arr.indexOf(meaning) === index) // Remove duplicates
    
    while (options.length < 4 && otherMeanings.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherMeanings.length)
      const randomMeaning = otherMeanings.splice(randomIndex, 1)[0]
      if (!options.includes(randomMeaning)) {
        options.push(randomMeaning)
      }
    }
    
    // Fill remaining slots with generic meanings if needed
    const genericMeanings = ['water', 'fire', 'earth', 'air', 'sun', 'moon', 'star', 'tree', 'flower', 'bird']
    while (options.length < 4) {
      const randomMeaning = genericMeanings[Math.floor(Math.random() * genericMeanings.length)]
      if (!options.includes(randomMeaning)) {
        options.push(randomMeaning)
      }
    }
    
    return options
  }

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const handleAnswer = async (selectedAnswer: string) => {
    if (currentQuestion >= questions.length) return
    
    const question = questions[currentQuestion]
    const timeSpent = Date.now() - questionStartTime
    
    const result: QuizResult = {
      questionId: currentQuestion,
      userAnswer: selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect: selectedAnswer === question.correctAnswer,
      timeSpent,
      kanjiCharacter: question.kanji.letter,
      questionText: question.question,
      questionType: question.questionType
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

  const saveQuizResults = async (allResults: QuizResult[]) => {
    try {
      const supabase = createClientBrowser()
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        console.log('User not authenticated, skipping save to database')
        // Still complete the quiz, just don't save to database
        return
      }
      
      // Calculate quiz summary
      const totalQuestions = allResults.length
      const correctAnswers = allResults.filter(r => r.isCorrect).length
      const totalTime = allResults.reduce((sum, r) => sum + r.timeSpent, 0)
      const averageTime = Math.round(totalTime / totalQuestions)
      
      // Insert quiz result
      const { data: quizResult, error: quizError } = await supabase
        .from('quiz_results')
        .insert({
          user_id: user.id,
          quiz_type: 'kanji',
          quiz_config: {
            questionCount: config.questionCount,
            levels: config.levels,
            quizType: config.quizType
          },
          total_questions: totalQuestions,
          correct_answers: correctAnswers,
          total_time_ms: totalTime,
          average_time_ms: averageTime
        })
        .select()
        .single()
      
      if (quizError) {
        console.error('Error saving quiz result:', quizError)
        return
      }
      
      // Insert individual answers
      const answersToInsert = allResults.map((result, index) => ({
        quiz_result_id: quizResult.id,
        question_number: index + 1,
        question_type: questions[index].questionType,
        kanji_character: questions[index].kanji.letter,
        user_answer: result.userAnswer,
        correct_answer: result.correctAnswer,
        is_correct: result.isCorrect,
        time_spent_ms: result.timeSpent
      }))
      
      const { error: answersError } = await supabase
        .from('quiz_answers')
        .insert(answersToInsert)
      
      if (answersError) {
        console.error('Error saving quiz answers:', answersError)
        return
      }
      
      console.log('Quiz results saved successfully!')
      
    } catch (err) {
      console.error('Error saving quiz results:', err)
    }
  }

  if (loading) {
    return (
      <div className="bg-white py-16">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin mx-auto mb-2 sm:mb-4"></div>
          <div className="text-lg text-black tracking-wider">GENERATING QUIZ...</div>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white py-16">
        <div className="text-center">
          <div className="text-lg sm:text-xl text-black mb-1 sm:mb-2 tracking-wider">ERROR GENERATING QUIZ</div>
          <div className="text-sm text-gray-600">Please try again</div>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="bg-white py-8">
      {/* Start Animation */}
      <QuizStartAnimation show={showStartAnimation} />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center mb-3 sm:mb-6">
          <div className="flex items-center justify-center space-x-3 mb-1 sm:mb-2">
            <div className="w-6 h-6 bg-black relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-white"></div>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-black tracking-wider mb-1 sm:mb-2">QUIZ</h1>
          <div className="h-px w-24 bg-black mx-auto"></div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3 sm:mb-6">
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <span className="text-sm text-black tracking-wider">
              QUESTION {currentQuestion + 1} OF {questions.length}
            </span>
            <span className="text-sm text-black tracking-wider">
              {Math.round(progress)}% COMPLETE
            </span>
          </div>
          <div className="w-full bg-gray-200 h-1">
            <div 
              className="bg-black h-1 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="border-2 border-black p-4 sm:p-8 mb-3 sm:mb-6">
          <div className="text-center mb-3 sm:mb-6">
            <div className="text-6xl sm:text-8xl font-bold text-black mb-2 sm:mb-4">
              {question.kanji.letter}
            </div>
            <div className="text-lg sm:text-xl text-gray-600 tracking-wider">
              {question.question}
            </div>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {question.options.map((option, index) => (
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

        {/* Bottom accent */}
        <div className="flex justify-center space-x-8">
          <div className="w-2 h-2 bg-black"></div>
          <div className="w-2 h-2 bg-black"></div>
          <div className="w-2 h-2 bg-black"></div>
        </div>
      </div>
    </div>
  )
}
