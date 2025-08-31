'use client'

import { PracticeSettings as PracticeSettingsType } from '../page'

interface PracticeSettingsProps {
  settings: PracticeSettingsType
  onSettingsChange: (settings: PracticeSettingsType) => void
  onStartPractice: () => void
  kanjiCount: number
}

export default function PracticeSettings({ 
  settings, 
  onSettingsChange, 
  onStartPractice, 
  kanjiCount 
}: PracticeSettingsProps) {
  const levels = [
    { value: 'all', label: 'All Levels', description: 'Practice with all kanji' },
    { value: 'Level 1', label: 'Level 1', description: 'Beginner kanji' },
    { value: 'Level 2', label: 'Level 2', description: 'Basic kanji' },
    { value: 'Level 3', label: 'Level 3', description: 'Intermediate kanji' },
    { value: 'Level 4', label: 'Level 4', description: 'Advanced kanji' },
    { value: 'Level 5', label: 'Level 5', description: 'Expert kanji' },
    { value: 'Level 6', label: 'Level 6', description: 'Master level kanji' },
    { value: 'Secondary', label: 'Secondary', description: 'Additional kanji' }
  ]

  const questionTypes = [
    { value: 'meaning', label: 'Meaning Only', description: 'Test kanji meanings' },
    { value: 'pronunciation', label: 'Pronunciation Only', description: 'Test kanji readings' },
    { value: 'both', label: 'Mixed', description: 'Random mix of both types' }
  ]

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-6">Practice Settings</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Level Selection */}
        <div>
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">Difficulty Level</h3>
          <div className="space-y-2">
            {levels.map((level) => (
              <label key={level.value} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="level"
                  value={level.value}
                  checked={settings.level === level.value}
                  onChange={(e) => onSettingsChange({ ...settings, level: e.target.value })}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">{level.label}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{level.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Question Type and Options */}
        <div className="space-y-6">
          {/* Question Type */}
          <div>
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">Question Type</h3>
            <div className="space-y-2">
              {questionTypes.map((type) => (
                <label key={type.value} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="questionType"
                    value={type.value}
                    checked={settings.questionType === type.value}
                    onChange={(e) => onSettingsChange({ ...settings, questionType: e.target.value as any })}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-slate-800 dark:text-slate-200">{type.label}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{type.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Character Count */}
          <div>
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">Number of Characters</h3>
            <div className="grid grid-cols-2 gap-3">
              {[5, 10, 20, 50].map((count) => (
                <label key={count} className="flex items-center space-x-3 cursor-pointer p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                  <input
                    type="radio"
                    name="characterCount"
                    value={count}
                    checked={settings.characterCount === count}
                    onChange={(e) => onSettingsChange({ ...settings, characterCount: parseInt(e.target.value) })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-slate-800 dark:text-slate-200">{count} Characters</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {count === 5 && 'Quick practice'}
                      {count === 10 && 'Short session'}
                      {count === 20 && 'Medium session'}
                      {count === 50 && 'Long session'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Shuffle Option */}
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.shuffle}
                onChange={(e) => onSettingsChange({ ...settings, shuffle: e.target.checked })}
                className="text-blue-600 focus:ring-blue-500 rounded"
              />
              <div>
                <div className="font-medium text-slate-800 dark:text-slate-200">Shuffle Questions</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Randomize question order</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Start Practice Button */}
      <div className="mt-8 text-center">
        <button
          onClick={onStartPractice}
          className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg font-semibold text-lg transform hover:scale-105"
        >
          {kanjiCount > 0 ? `Start Practice (${settings.characterCount} characters)` : `Load Kanji & Start Practice (${settings.characterCount} characters)`}
        </button>
        
        {kanjiCount > 0 && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
            {kanjiCount.toLocaleString()} kanji characters available • Will practice {Math.min(settings.characterCount, kanjiCount)} characters
          </p>
        )}
      </div>
    </div>
  )
} 