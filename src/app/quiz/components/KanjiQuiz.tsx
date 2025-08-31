'use client'

import { useState, useEffect } from 'react'
import { createClientBrowser, JapaneseKanji } from '@/lib/supabase'

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
}

export default function KanjiQuiz({ config, onComplete }: { config: QuizConfig; onComplete: (results: QuizResult[]) => void }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)
  const [startTime, setStartTime] = useState<number>(0)
  const [questionStartTime, setQuestionStartTime] = useState<number>(0)

  useEffect(() => {
    generateQuiz()
  }, [config])

  useEffect(() => {
    if (questions.length > 0) {
      setQuestionStartTime(Date.now())
    }
  }, [currentQuestion, questions])

  const generateQuiz = async () => {
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
      setStartTime(Date.now())
      setQuestionStartTime(Date.now())
      setLoading(false)
    } catch (err) {
      console.error('Error generating quiz:', err)
      setLoading(false)
    }
  }

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
      timeSpent
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Generating quiz...</div>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <div className="text-xl mb-2">Error generating quiz</div>
          <div className="text-sm">Please try again</div>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-gray-800 mb-4">
              {question.kanji.letter}
            </div>
            <div className="text-xl text-gray-600">
              {question.question}
            </div>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <div className="font-medium text-gray-800">{option}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 