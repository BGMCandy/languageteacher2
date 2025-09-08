'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClientBrowser } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Lazy load heavy chart components
const LineChart = dynamic(() => import('recharts').then(mod => ({ default: mod.LineChart })), { ssr: false })
const Line = dynamic(() => import('recharts').then(mod => ({ default: mod.Line })), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.XAxis })), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.YAxis })), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(mod => ({ default: mod.Tooltip })), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })), { ssr: false })
const BarChart = dynamic(() => import('recharts').then(mod => ({ default: mod.BarChart })), { ssr: false })
const Bar = dynamic(() => import('recharts').then(mod => ({ default: mod.Bar })), { ssr: false })
const PieChart = dynamic(() => import('recharts').then(mod => ({ default: mod.PieChart })), { ssr: false })
const Pie = dynamic(() => import('recharts').then(mod => ({ default: mod.Pie })), { ssr: false })
const Cell = dynamic(() => import('recharts').then(mod => ({ default: mod.Cell })), { ssr: false })
const Area = dynamic(() => import('recharts').then(mod => ({ default: mod.Area })), { ssr: false })
const AreaChart = dynamic(() => import('recharts').then(mod => ({ default: mod.AreaChart })), { ssr: false })

interface ProgressData {
  date: string
  charactersPracticed: number
  accuracy: number
  timeSpent: number
}

interface CharacterAccuracy {
  character: string
  accuracy: number
  attempts: number
  language: string
}

type TimeRange = 'week' | 'month' | '3months' | '6months' | 'year'

interface QuizAnswer {
  kanji_character?: string
  thai_character?: string
  is_correct: boolean
  time_spent_ms: number
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

export default function ProgressPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [progressData, setProgressData] = useState<ProgressData[]>([])
  const [characterAccuracy, setCharacterAccuracy] = useState<CharacterAccuracy[]>([])
  const [timeRange, setTimeRange] = useState<TimeRange>('month')

  const [dataLoading, setDataLoading] = useState(true)
  const [totalStats, setTotalStats] = useState({
    totalCharacters: 0,
    totalTime: 0,
    averageAccuracy: 0,
    highAccuracyCount: 0
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const fetchProgressData = useCallback(async () => {
    if (!user) return

    try {
      setDataLoading(true)
      const supabase = createClientBrowser()
      
      // Calculate date range
      const now = new Date()
      const startDate = new Date()
      
      switch (timeRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(now.getMonth() - 1)
          break
        case '3months':
          startDate.setMonth(now.getMonth() - 3)
          break
        case '6months':
          startDate.setMonth(now.getMonth() - 6)
          break
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1)
          break
      }

      // Fetch Japanese quiz data
      const { data: japaneseResults, error: japaneseError } = await supabase
        .from('quiz_results')
        .select(`
          *,
          quiz_answers (
            kanji_character,
            is_correct,
            time_spent_ms
          )
        `)
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

      // Fetch Thai quiz data
      const { data: thaiResults, error: thaiError } = await supabase
        .from('quiz_results_thai')
        .select(`
          *,
          quiz_answers_thai (
            thai_character,
            is_correct,
            time_spent_ms
          )
        `)
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

      if (japaneseError) console.error('Japanese data error:', japaneseError)
      if (thaiError) console.error('Thai data error:', thaiError)

      // Process data for charts
      const processedData: ProgressData[] = []
      const characterAccuracies: CharacterAccuracy[] = []

      // Process Japanese data
      if (japaneseResults) {
        japaneseResults.forEach(result => {
          const date = new Date(result.created_at).toISOString().split('T')[0]
          const answers = result.quiz_answers || []
          const correctAnswers = answers.filter((a: QuizAnswer) => a.is_correct).length
          const totalTime = answers.reduce((sum: number, a: QuizAnswer) => sum + (a.time_spent_ms || 0), 0)
          const accuracy = answers.length > 0 ? (correctAnswers / answers.length) * 100 : 0

          // Add to daily data
          const existingDay = processedData.find(d => d.date === date)
          if (existingDay) {
            existingDay.charactersPracticed += answers.length
            existingDay.accuracy = (existingDay.accuracy + accuracy) / 2
            existingDay.timeSpent += totalTime
          } else {
            processedData.push({
              date,
              charactersPracticed: answers.length,
              accuracy,
              timeSpent: totalTime
            })
          }

          // Add character accuracies
          answers.forEach((answer: QuizAnswer) => {
            const existingChar = characterAccuracies.find(c => c.character === answer.kanji_character)
            if (existingChar) {
              existingChar.attempts += 1
              existingChar.accuracy = existingChar.accuracy + (answer.is_correct ? 1 : 0)
            } else if (answer.kanji_character) {
              characterAccuracies.push({
                character: answer.kanji_character,
                accuracy: answer.is_correct ? 1 : 0,
                attempts: 1,
                language: 'Japanese'
              })
            }
          })
        })
      }

      // Process Thai data
      if (thaiResults) {
        thaiResults.forEach(result => {
          const date = new Date(result.created_at).toISOString().split('T')[0]
          const answers = result.quiz_answers_thai || []
          const correctAnswers = answers.filter((a: QuizAnswer) => a.is_correct).length
          const totalTime = answers.reduce((sum: number, a: QuizAnswer) => sum + (a.time_spent_ms || 0), 0)
          const accuracy = answers.length > 0 ? (correctAnswers / answers.length) * 100 : 0

          // Add to daily data
          const existingDay = processedData.find(d => d.date === date)
          if (existingDay) {
            existingDay.charactersPracticed += answers.length
            existingDay.accuracy = (existingDay.accuracy + accuracy) / 2
            existingDay.timeSpent += totalTime
          } else {
            processedData.push({
              date,
              charactersPracticed: answers.length,
              accuracy,
              timeSpent: totalTime
            })
          }

          // Add character accuracies
          answers.forEach((answer: QuizAnswer) => {
            const existingChar = characterAccuracies.find(c => c.character === answer.thai_character)
            if (existingChar) {
              existingChar.attempts += 1
              existingChar.accuracy = existingChar.accuracy + (answer.is_correct ? 1 : 0)
            } else if (answer.thai_character) {
              characterAccuracies.push({
                character: answer.thai_character,
                accuracy: answer.is_correct ? 1 : 0,
                attempts: 1,
                language: 'Thai'
              })
            }
          })
        })
      }

      // Calculate final accuracies
      characterAccuracies.forEach(char => {
        char.accuracy = (char.accuracy / char.attempts) * 100
      })

      // Sort and limit data
      processedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      characterAccuracies.sort((a, b) => b.accuracy - a.accuracy)

      setProgressData(processedData)
      setCharacterAccuracy(characterAccuracies)

      // Calculate total stats
      const totalCharacters = characterAccuracies.reduce((sum, char) => sum + char.attempts, 0)
      const totalTime = processedData.reduce((sum, day) => sum + day.timeSpent, 0)
      const averageAccuracy = characterAccuracies.length > 0 
        ? characterAccuracies.reduce((sum, char) => sum + char.accuracy, 0) / characterAccuracies.length 
        : 0
      const highAccuracyCount = characterAccuracies.filter(char => char.accuracy >= 90).length

      setTotalStats({
        totalCharacters,
        totalTime,
        averageAccuracy,
        highAccuracyCount
      })

    } catch (error) {
      console.error('Error fetching progress data:', error)
    } finally {
      setDataLoading(false)
    }
  }, [user, timeRange])

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000)
    const hours = Math.floor(minutes / 60)
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

  useEffect(() => {
    fetchProgressData()
  }, [fetchProgressData])

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const topCharacters = characterAccuracy.slice(0, 10)
  const highAccuracyCharacters = characterAccuracy.filter(char => char.accuracy >= 90)
  const languageBreakdown = characterAccuracy.reduce((acc, char) => {
    acc[char.language] = (acc[char.language] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Learning Progress</h1>
          <p className="text-gray-600">Track your character learning journey and achievements</p>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-black">Time Range:</label>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="px-3 py-1 border-2 border-black text-sm cursor-pointer"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-black p-6">
            <div className="text-3xl font-bold text-black mb-2">{totalStats.totalCharacters}</div>
            <div className="text-gray-600 text-sm">Characters Practiced</div>
          </div>
          
          <div className="bg-white border-2 border-black p-6">
            <div className="text-3xl font-bold text-black mb-2">{formatTime(totalStats.totalTime)}</div>
            <div className="text-gray-600 text-sm">Total Study Time</div>
          </div>
          
          <div className="bg-white border-2 border-black p-6">
            <div className="text-3xl font-bold text-black mb-2">{Math.round(totalStats.averageAccuracy)}%</div>
            <div className="text-gray-600 text-sm">Average Accuracy</div>
          </div>
          
          <div className="bg-white border-2 border-black p-6">
            <div className="text-3xl font-bold text-black mb-2">{totalStats.highAccuracyCount}</div>
            <div className="text-gray-600 text-sm">Characters ≥90% Accuracy</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Progress Chart */}
          <div className="bg-white border-2 border-black p-6">
            <h3 className="text-xl font-bold text-black mb-4">Characters Practiced Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date"
                    stroke="#374151"
                    fontSize={12}
                  />
                  <YAxis stroke="#374151" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '2px solid #000',
                      borderRadius: '0',
                      color: '#fff'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="charactersPracticed" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Accuracy Chart */}
          <div className="bg-white border-2 border-black p-6">
            <h3 className="text-xl font-bold text-black mb-4">Accuracy Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date"
                    stroke="#374151"
                    fontSize={12}
                  />
                  <YAxis stroke="#374151" fontSize={12} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '2px solid #000',
                      borderRadius: '0',
                      color: '#fff'
                    }}
                    formatter={(value) => [`${Math.round(Number(value))}%`, 'Accuracy']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Characters */}
          <div className="bg-white border-2 border-black p-6">
            <h3 className="text-xl font-bold text-black mb-4">Most Practiced Characters</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCharacters} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#374151" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="character" 
                    stroke="#374151" 
                    fontSize={12}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '2px solid #000',
                      borderRadius: '0',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="attempts" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Language Breakdown */}
          <div className="bg-white border-2 border-black p-6">
            <h3 className="text-xl font-bold text-black mb-4">Language Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(languageBreakdown).map(([language, count]) => ({ 
                      name: language, 
                      value: count 
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(languageBreakdown).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '2px solid #000',
                      borderRadius: '0',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* High Accuracy Characters */}
        {highAccuracyCharacters.length > 0 && (
          <div className="mt-8 bg-white border-2 border-black p-6">
            <h3 className="text-xl font-bold text-black mb-4">Characters with ≥90% Accuracy</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {highAccuracyCharacters.slice(0, 24).map((char, index) => (
                <div key={index} className="text-center p-3 border border-gray-200">
                  <div className="text-2xl font-bold text-black mb-1">{char.character}</div>
                  <div className="text-sm text-gray-600">{Math.round(char.accuracy)}%</div>
                  <div className="text-xs text-gray-500">{char.attempts} attempts</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
