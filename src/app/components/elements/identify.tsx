import Link from 'next/link'
import React from 'react'

const identify = () => {
  return (
    <div className="w-[480px]">
        {/* Logo and Brand */}
        <Link href="/">
        <div className="flex items-center space-x-4 group cursor-pointer">
          <div className="w-10 h-10 bg-black relative transition-all duration-300 group-hover:rotate-90">
            <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
            <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
          </div>
          <div className="relative w-[220px]">
            <h1 className="text-xl font-bold text-black tracking-wider transition-all duration-300 group-hover:tracking-normal whitespace-nowrap">
              <span className="group-hover:hidden">LANGUAGE TEACHER</span>
              <span className="hidden group-hover:inline">languageteacher</span>
              <span className="inline-block ml-1 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 delay-100 text-blue-600 font-mono">
                .io
              </span>
            </h1>
            <div className="h-0.5 w-16 bg-black transition-all duration-300 group-hover:w-24 group-hover:bg-blue-600"></div>
          </div>
        </div>  
        </Link>
    </div>
  )
}

export default identify