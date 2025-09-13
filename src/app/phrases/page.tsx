'use client'

import { useState } from 'react'
import PhraseRequestForm from './components/PhraseRequestForm'
import PhraseDisplay from './components/PhraseDisplay'
import { UIPhraseRequest } from '@/lib/services/phraseRequestNormalizer'

interface GeneratedPhrase {
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

export default function PhrasesPage() {
  const [currentPhrase, setCurrentPhrase] = useState<GeneratedPhrase | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPhrases, setSavedPhrases] = useState<GeneratedPhrase[]>([]);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const handleGeneratePhrase = async (request: UIPhraseRequest) => {
    setLoading(true);
    setError(null);
    setDebugInfo(['🚀 Starting phrase generation...']);

    try {
      setDebugInfo(prev => [...prev, '📤 Sending request to API...', `Request: ${JSON.stringify(request, null, 2)}`]);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        setDebugInfo(prev => [...prev, '⏰ Timeout timer triggered - aborting request']);
        controller.abort();
      }, 30000); // 30 second timeout
      
      setDebugInfo(prev => [...prev, '⏱️ Timeout set for 30 seconds']);
      
      try {
        setDebugInfo(prev => [...prev, '🌐 Making fetch request to /api/phrases/zh-cn/get']);
        
        const response = await fetch('/api/phrases/zh-cn/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        setDebugInfo(prev => [...prev, '⏱️ Timeout cleared - response received']);
        setDebugInfo(prev => [...prev, `📡 Response status: ${response.status} ${response.statusText}`]);
        setDebugInfo(prev => [...prev, `📡 Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`]);

        if (!response.ok) {
          setDebugInfo(prev => [...prev, '❌ Response not OK - parsing error data']);
          const errorData = await response.json();
          setDebugInfo(prev => [...prev, `❌ Error response: ${JSON.stringify(errorData, null, 2)}`]);
          throw new Error(errorData.error || 'Failed to generate phrase');
        }

        setDebugInfo(prev => [...prev, '✅ Response OK - parsing success data']);
        const data = await response.json();
        setDebugInfo(prev => [...prev, `✅ Success! Response: ${JSON.stringify(data, null, 2)}`]);
        
        if (data.debug_mode) {
          // Debug mode - show OpenAI response even if database failed
          setDebugInfo(prev => [...prev, '🤖 DEBUG MODE: OpenAI is working, database failed']);
          setDebugInfo(prev => [...prev, `🤖 AI Response: ${JSON.stringify(data.ai_response, null, 2)}`]);
          setDebugInfo(prev => [...prev, `🤖 Generated Phrase: ${data.raw_phrase.phrase} - ${data.raw_phrase.translation_en}`]);
          setDebugInfo(prev => [...prev, `❌ Database Error: ${data.error}`]);
          
          // Show the phrase anyway
          if (data.raw_phrase) {
            setCurrentPhrase(data.raw_phrase);
            setDebugInfo(prev => [...prev, '🎯 Showing phrase from OpenAI (not saved to database)']);
          }
        } else if (data.phrase) {
          setDebugInfo(prev => [...prev, '🎯 Setting current phrase in UI']);
          setCurrentPhrase(data.phrase);
          setDebugInfo(prev => [...prev, '🎯 Phrase set successfully']);
        } else {
          setDebugInfo(prev => [...prev, '⚠️ No phrase in response data']);
        }
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        setDebugInfo(prev => [...prev, '⏱️ Timeout cleared due to error']);
        
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          setDebugInfo(prev => [...prev, '⏰ Request timed out after 30 seconds']);
          throw new Error('Request timed out - the API is taking too long to respond');
        } else {
          setDebugInfo(prev => [...prev, `💥 Fetch error: ${fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'}`]);
          setDebugInfo(prev => [...prev, `💥 Fetch error type: ${fetchError instanceof Error ? fetchError.name : typeof fetchError}`]);
          setDebugInfo(prev => [...prev, `💥 Fetch error stack: ${fetchError instanceof Error ? fetchError.stack : 'No stack'}`]);
          throw fetchError;
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setDebugInfo(prev => [...prev, `💥 Final error: ${errorMessage}`]);
      setDebugInfo(prev => [...prev, `💥 Error type: ${err instanceof Error ? err.name : typeof err}`]);
      console.error('Error generating phrase:', err);
    } finally {
      setDebugInfo(prev => [...prev, '🏁 Finally block - setting loading to false']);
      setLoading(false);
    }
  };

  const handleSavePhrase = () => {
    if (currentPhrase) {
      setSavedPhrases(prev => [...prev, currentPhrase]);
      // In a real app, you'd also save to the database
      console.log('Phrase saved:', currentPhrase);
    }
  };

  const handleDebugTest = async () => {
    setDebugInfo(['🧪 Testing debug endpoint...']);
    
    try {
      const response = await fetch('/api/phrases/zh-cn/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 1,
          level_system: 'HSK',
          type: 'phrase',
          topic: '',
          include_chars: [],
          count: 1,
          max_len: 14
        })
      });
      
      const data = await response.json();
      setDebugInfo(prev => [...prev, `🧪 Debug result: ${JSON.stringify(data, null, 2)}`]);
    } catch (error) {
      setDebugInfo(prev => [...prev, `🧪 Debug error: ${error}`]);
    }
  };

  const handleRawTest = async () => {
    setDebugInfo(['🔥 Testing raw OpenAI call...']);
    
    try {
      const response = await fetch('/api/phrases/zh-cn/raw-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      const data = await response.json();
      setDebugInfo(prev => [...prev, `🔥 Raw test result: ${JSON.stringify(data, null, 2)}`]);
    } catch (error) {
      setDebugInfo(prev => [...prev, `🔥 Raw test error: ${error}`]);
    }
  };

  const handleNextPhrase = () => {
    setCurrentPhrase(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chinese Phrase Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate personalized Chinese phrases with AI based on your level and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Request Form */}
              <div>
            <PhraseRequestForm 
              onSubmit={handleGeneratePhrase}
              loading={loading}
            />
            
            <div className="mt-4 space-x-2">
              <button
                onClick={handleDebugTest}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                🧪 Debug Test
              </button>
              <button 
                onClick={handleRawTest}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                🔥 Raw Test
              </button>
            </div>
          </div>

          {/* Results */}
          <div>
            {/* Debug Info */}
            {debugInfo.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">Debug Info</h3>
                    <div className="text-sm text-blue-700 space-y-1">
                      {debugInfo.map((info, index) => (
                        <div key={index} className="font-mono text-xs bg-blue-100 p-2 rounded">
                          {info}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
            </div>
              </div>
            )}

            {currentPhrase && (
              <PhraseDisplay
                phrase={currentPhrase}
                onSave={handleSavePhrase}
                onNext={handleNextPhrase}
                showDetails={true}
              />
            )}

            {!currentPhrase && !error && !loading && (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate</h3>
                <p className="text-gray-600">
                  Fill out the form on the left to generate your first Chinese phrase!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Saved Phrases */}
        {savedPhrases.length > 0 && (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Phrases</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPhrases.map((phrase, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-4">
                  <div className="text-xl font-bold text-gray-900 mb-2">{phrase.phrase}</div>
                  <div className="text-blue-600 mb-1">{phrase.pinyin_marks.join(' ')}</div>
                  <div className="text-gray-700">{phrase.translation_en}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {phrase.level_system} {phrase.level_value} • {phrase.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}