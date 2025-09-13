'use client'

import { useState } from 'react'
import { UIPhraseRequest } from '@/lib/services/phraseRequestNormalizer'

interface PhraseRequestFormProps {
  onSubmit: (request: UIPhraseRequest) => void;
  loading?: boolean;
}

export default function PhraseRequestForm({ onSubmit, loading = false }: PhraseRequestFormProps) {
  const [formData, setFormData] = useState<UIPhraseRequest>({
    level: 1,
    level_system: 'HSK',
    type: 'phrase',
    topic: '',
    include_chars: [],
    count: 10,
    max_len: 14
  });

  const [customChars, setCustomChars] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleIncludeCharsChange = (chars: string) => {
    setCustomChars(chars);
    // Convert string to array of individual characters
    const charArray = chars.split('').filter(char => char.trim() !== '');
    setFormData(prev => ({ ...prev, include_chars: charArray }));
  };

  const predefinedCharSets = {
    HSK1: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '人', '大', '小', '中', '国', '好', '不', '是', '我', '你'],
    HSK2: ['学', '生', '老', '师', '朋', '友', '家', '里', '上', '下', '来', '去', '看', '听', '说', '读', '写', '做', '吃', '喝'],
    HSK3: ['工', '作', '时', '间', '今', '天', '明', '天', '昨', '天', '年', '月', '日', '星', '期', '早', '晚', '新', '旧', '多'],
    basic: ['你', '好', '谢', '谢', '对', '不', '起', '没', '关', '系', '再', '见', '请', '问', '这', '那', '什', '么', '怎', '样']
  };

  const addPredefinedSet = (setName: keyof typeof predefinedCharSets) => {
    const newChars = [...new Set([...formData.include_chars, ...predefinedCharSets[setName]])];
    setFormData(prev => ({ ...prev, include_chars: newChars }));
    setCustomChars(newChars.join(''));
  };

  const clearChars = () => {
    setFormData(prev => ({ ...prev, include_chars: [] }));
    setCustomChars('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Chinese Phrases</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Level System and Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level System
            </label>
            <select
              value={formData.level_system}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                level_system: e.target.value as 'HSK' | 'difficulty' | 'grade_band' 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="HSK">HSK (Hanyu Shuiping Kaoshi)</option>
              <option value="difficulty">Difficulty Level</option>
              <option value="grade_band">Grade Band</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {formData.level_system === 'HSK' && (
                <>
                  <option value={1}>HSK 1 (Beginner)</option>
                  <option value={2}>HSK 2 (Elementary)</option>
                  <option value={3}>HSK 3 (Intermediate)</option>
                  <option value={4}>HSK 4 (Upper Intermediate)</option>
                  <option value={5}>HSK 5 (Advanced)</option>
                  <option value={6}>HSK 6 (Proficient)</option>
                </>
              )}
              {formData.level_system === 'difficulty' && (
                <>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                    <option key={level} value={level}>Level {level}</option>
                  ))}
                </>
              )}
              {formData.level_system === 'grade_band' && (
                <>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                    <option key={grade} value={grade}>Grade {grade}</option>
                  ))}
                </>
              )}
            </select>
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phrase Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="phrase">Phrase</option>
            <option value="sentence">Sentence</option>
            <option value="chengyu">Chengyu (Idiom)</option>
          </select>
        </div>

        {/* Topic */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic (Optional)
          </label>
          <input
            type="text"
            value={formData.topic || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
            placeholder="e.g., greetings, food, travel, family"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Character Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Include Characters (Optional)
          </label>
          
          {/* Predefined Character Sets */}
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-2">Quick add predefined sets:</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(predefinedCharSets).map(setName => (
                <button
                  key={setName}
                  type="button"
                  onClick={() => addPredefinedSet(setName as keyof typeof predefinedCharSets)}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                >
                  {setName}
                </button>
              ))}
              <button
                type="button"
                onClick={clearChars}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Custom Character Input */}
          <input
            type="text"
            value={customChars}
            onChange={(e) => handleIncludeCharsChange(e.target.value)}
            placeholder="Enter characters to include (e.g., 你好世界)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Character Preview */}
          {formData.include_chars.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Selected characters:</p>
              <div className="flex flex-wrap gap-1">
                {formData.include_chars.map((char, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded"
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Count and Max Length */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Phrases
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={formData.count}
              onChange={(e) => setFormData(prev => ({ ...prev, count: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Length (characters)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={formData.max_len}
              onChange={(e) => setFormData(prev => ({ ...prev, max_len: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Generating...' : 'Generate Phrases'}
        </button>
      </form>
    </div>
  );
}
