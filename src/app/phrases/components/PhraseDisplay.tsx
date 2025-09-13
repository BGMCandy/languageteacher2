'use client'

import { useState } from 'react'

interface PhraseData {
  phrase: string;
  translation_en: string;
  pinyin_marks: string[];
  pinyin_numbers: string[];
  level_system: string;
  level_value: string;
  level_confidence: number;
  type: string;
  topic?: string;
  length: number;
  char_set: string[];
  char_occurrences: Record<string, number>;
  include_chars_present: string[];
  tags: string[];
  quality_checks: Record<string, boolean>;
  source?: string;
  confidence?: number;
  generation_time_ms?: number;
}

interface PhraseDisplayProps {
  phrase: PhraseData;
  onNext?: () => void;
  onSave?: () => void;
  showDetails?: boolean;
}

export default function PhraseDisplay({ 
  phrase, 
  onNext, 
  onSave, 
  showDetails = true 
}: PhraseDisplayProps) {
  const [showPinyin, setShowPinyin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);

  const getLevelDisplay = () => {
    switch (phrase.level_system) {
      case 'HSK':
        return `HSK ${phrase.level_value}`;
      case 'difficulty':
        return `Difficulty ${phrase.level_value}`;
      case 'grade_band':
        return `Grade ${phrase.level_value}`;
      default:
        return `${phrase.level_system} ${phrase.level_value}`;
    }
  };

  const getSourceDisplay = () => {
    switch (phrase.source) {
      case 'cache':
        return 'Cached';
      case 'database_exact':
        return 'Database (Exact Match)';
      case 'database_broader':
        return 'Database (Similar Match)';
      case 'ai_generated':
        return 'AI Generated';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Main Phrase Display */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-gray-900 mb-4">
          {phrase.phrase}
        </div>
        
        {showPinyin && (
          <div className="text-xl text-blue-600 mb-2">
            {Array.isArray(phrase.pinyin_marks) ? phrase.pinyin_marks.join(' ') : phrase.pinyin_marks}
          </div>
        )}
        
        {showTranslation && (
          <div className="text-lg text-gray-700">
            {phrase.translation_en}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setShowPinyin(!showPinyin)}
          className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
        >
          {showPinyin ? 'Hide' : 'Show'} Pinyin
        </button>
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className="px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
        >
          {showTranslation ? 'Hide' : 'Show'} Translation
        </button>
      </div>

      {/* Character Breakdown */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Character Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {phrase.phrase.split('').map((char, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">{char}</div>
              {showPinyin && (
                <div className="text-sm text-blue-600 mb-1">
                  {phrase.pinyin_marks[index]}
                </div>
              )}
              <div className="text-xs text-gray-500">
                Position {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Level:</span>
              <div className="text-gray-900">{getLevelDisplay()}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Type:</span>
              <div className="text-gray-900 capitalize">{phrase.type}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Length:</span>
              <div className="text-gray-900">{phrase.length} characters</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Confidence:</span>
              <div className="text-gray-900">
                {Math.round((phrase.confidence || phrase.level_confidence) * 100)}%
              </div>
            </div>
          </div>

          {phrase.topic && (
            <div>
              <span className="font-medium text-gray-700">Topic:</span>
              <div className="text-gray-900">{phrase.topic}</div>
            </div>
          )}

          {phrase.tags.length > 0 && (
            <div>
              <span className="font-medium text-gray-700">Tags:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {phrase.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {phrase.include_chars_present.length > 0 && (
            <div>
              <span className="font-medium text-gray-700">Required Characters:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {phrase.include_chars_present.map((char, index) => (
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

          <div className="text-xs text-gray-500">
            Source: {getSourceDisplay()}
            {phrase.generation_time_ms && (
              <span> • Generated in {phrase.generation_time_ms}ms</span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        {onSave && (
          <button
            onClick={onSave}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Save Phrase
          </button>
        )}
        {onNext && (
          <button
            onClick={onNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Next Phrase
          </button>
        )}
      </div>
    </div>
  );
}
