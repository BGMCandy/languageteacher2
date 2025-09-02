'use client'

import { useState, useEffect } from 'react'

export default function PracticePage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Add your data fetching logic here when needed
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="bg-white py-16">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin mx-auto mb-2 sm:mb-4"></div>
          <div className="text-lg text-black tracking-wider">LOADING...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-8 pt-8 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-black tracking-wider mb-4">
            PRACTICE
          </h1>
          <div className="h-px w-24 bg-black mx-auto mb-4"></div>
          <p className="text-gray-600 tracking-wide">
            Practice your language skills
          </p>
        </div>
      </div>
    </div>
  )
}