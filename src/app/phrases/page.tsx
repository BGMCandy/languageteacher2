'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PhrasesPage() {
  const router = useRouter()
  const [chineseLevel, setChineseLevel] = useState('')
  const [japaneseLevel, setJapaneseLevel] = useState('')
  const [chineseTopic, setChineseTopic] = useState('')
  const [japaneseTopic, setJapaneseTopic] = useState('')

  const startStudy = (language: 'zh' | 'ja') => {
    const level = language === 'zh' ? chineseLevel : japaneseLevel
    const topic = language === 'zh' ? chineseTopic : japaneseTopic
    
    if (!level) {
      alert('Please select a level first')
      return
    }

    const params = new URLSearchParams({ level })
    if (topic.trim()) {
      params.set('topic', topic.trim())
    }
    
    router.push(`/phrases/study/${language}?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Phrase Study Mode
          </h1>
          <p className="text-lg text-gray-600">
            Choose a language and level to start studying with AI-generated phrases
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Chinese Study Mode */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">中</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Chinese Phrases</h2>
              <p className="text-gray-600">Study Chinese phrases with Hanzi characters</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Grade Level
                </label>
                <select 
                  value={chineseLevel}
                  onChange={(e) => setChineseLevel(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Choose a grade...</option>
                  {[1, 2, 3, 4, 5, 6].map(grade => (
                    <option key={grade} value={grade}>Grade {grade}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic (Optional)
                </label>
                <input 
                  type="text" 
                  value={chineseTopic}
                  onChange={(e) => setChineseTopic(e.target.value)}
                  placeholder="e.g., greetings, food, travel..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <button 
                onClick={() => startStudy('zh')}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Start Chinese Study
              </button>
            </div>
          </div>

          {/* Japanese Study Mode */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">日</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Japanese Phrases</h2>
              <p className="text-gray-600">Study Japanese phrases with Kanji characters</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select JLPT Level
                </label>
                <select 
                  value={japaneseLevel}
                  onChange={(e) => setJapaneseLevel(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a level...</option>
                  {[5, 4, 3, 2, 1].map(level => (
                    <option key={level} value={level}>JLPT N{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic (Optional)
                </label>
                <input 
                  type="text" 
                  value={japaneseTopic}
                  onChange={(e) => setJapaneseTopic(e.target.value)}
                  placeholder="e.g., greetings, food, travel..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button 
                onClick={() => startStudy('ja')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Start Japanese Study
              </button>
            </div>
          </div>
        </div>

        {/* Recent Phrases Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Recent Phrases
          </h3>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600 text-center">
              Your generated phrases will appear here as you study
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}