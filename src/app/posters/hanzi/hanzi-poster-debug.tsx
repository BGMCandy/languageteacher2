'use client'

import { useEffect, useState } from 'react'

export default function HanziPosterDebug() {
  const [status, setStatus] = useState('Starting...')
  const [data, setData] = useState<unknown>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testAPI = async () => {
      try {
        setStatus('Testing API...')
        const response = await fetch('/api/hanzi/grid?offset=0&limit=5&view=definition')
        setStatus('API response received')
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const result = await response.json()
        setStatus('Data parsed successfully')
        setData(result)
      } catch (err) {
        setStatus('Error occurred')
        setError(err instanceof Error ? err.message : 'Unknown error')
        console.error('API Error:', err)
      }
    }

    testAPI()
  }, [])

  return (
    <div className="bg-white min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Hanzi Poster</h1>
      
      <div className="mb-4">
        <p><strong>Status:</strong> {status}</p>
        {error && <p className="text-red-600"><strong>Error:</strong> {error}</p>}
      </div>

      {data && typeof data === 'object' ? (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">API Response:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ) : null}

      {(data as { items?: unknown[] })?.items && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Characters:</h2>
          <div className="grid grid-cols-10 gap-2">
            {(data as { items: { char: string }[] }).items.map((item: { char: string }, index: number) => (
              <div
                key={index}
                className="aspect-square border-2 border-gray-300 flex items-center justify-center text-lg font-medium"
              >
                {item.char}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
