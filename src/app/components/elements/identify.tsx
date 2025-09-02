'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useScrollAnimation } from './animations/useScrollAnimation'

const Identify = () => {
  const [isMobile, setIsMobile] = useState(false)
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.5, triggerOnce: false })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="w-[480px]">
        {/* Logo and Brand */}
        <Link href="/">
        <div className="flex items-center space-x-4 group cursor-pointer">
          <div className={`w-10 h-10 bg-black relative transition-all duration-300 ${
            isMobile ? (isVisible ? 'rotate-90' : '') : 'group-hover:rotate-90'
          }`}>
            <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
            <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
          </div>
          <div className="relative w-[220px]">
            <h1 className={`text-xl font-bold text-black transition-all duration-300 whitespace-nowrap ${
              isMobile ? (isVisible ? 'tracking-normal' : 'tracking-wider') : 'tracking-wider group-hover:tracking-normal'
            }`}>
              <span className={isMobile ? (isVisible ? 'hidden' : '') : 'group-hover:hidden'}>LANGUAGE TEACHER</span>
              <span className={isMobile ? (isVisible ? 'inline' : 'hidden') : 'hidden group-hover:inline'}>languageteacher</span>
              <span className={`inline-block ml-1 transform transition-all duration-300 delay-100 text-blue-600 font-mono ${
                isMobile ? (isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2') : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
              }`}>
                .io
              </span>
            </h1>
            <div className={`h-0.5 bg-black transition-all duration-300 ${
              isMobile ? (isVisible ? 'w-24 bg-blue-600' : 'w-16') : 'w-16 group-hover:w-24 group-hover:bg-blue-600'
            }`}></div>
          </div>
        </div>  
        </Link>
    </div>
  )
}

export default Identify
