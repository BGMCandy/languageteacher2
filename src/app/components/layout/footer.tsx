import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-white border-t-2 border-black py-12 w-full overflow-x-hidden">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Brand and copyright */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            {/* Sharp geometric logo */}
            <div className="w-8 h-8 bg-black relative flex-shrink-0">
              <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
              <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
            </div>
            <p className="text-lg sm:text-xl font-bold text-black tracking-wider">
              LANGUAGETEACHER.IO
            </p>
          </div>
        
        {/* Navigation links */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-12 mb-6">
          <Link 
            href="/terms-and-conditions" 
            className="btn-5 text-sm sm:text-base"
          >
            Terms & Conditions
          </Link>
          <Link 
            href="/privacy-policy" 
            className="btn-5 text-sm sm:text-base"
          >
            Privacy Policy
          </Link>
          <Link 
            href="/contact" 
            className="btn-5 text-sm sm:text-base"
          >
            Contact
          </Link>
          <Link 
            href="/about" 
            className="btn-5 text-sm sm:text-base"
          >
            About
          </Link>
        </div>


        <div className="w-24 bg-black mx-auto"></div>
          <p className="text-sm text-gray-600 tracking-wide">
            languageteacher.io {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
