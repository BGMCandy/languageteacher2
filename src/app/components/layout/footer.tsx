import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-white border-t-2 border-black h-48">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-8 h-full flex flex-col justify-center">
        {/* Brand and copyright */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            {/* Sharp geometric logo */}
            <div className="w-8 h-8 bg-black relative">
              <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
              <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
            </div>
            <p className="text-xl font-bold text-black tracking-wider">
              LANGUAGETEACHER.IO
            </p>
          </div>
          <div className="h-px w-24 bg-black mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 tracking-wide">
            © {new Date().getFullYear()} ALL RIGHTS RESERVED
          </p>
        </div>
        
        {/* Navigation links */}
        <div className="flex flex-wrap justify-center gap-12 mb-6">
          <Link 
            href="/terms-and-conditions" 
            className="text-black hover:text-gray-600 transition-colors duration-200 text-sm font-medium tracking-wider uppercase hover:font-fugaz"
          >
            Terms & Conditions
          </Link>
          <Link 
            href="/privacy-policy" 
            className="text-black hover:text-gray-600 transition-colors duration-200 text-sm font-medium tracking-wider uppercase hover:font-fugaz"
          >
            Privacy Policy
          </Link>
          <Link 
            href="/contact" 
            className="text-black hover:text-gray-600 transition-colors duration-200 text-sm font-medium tracking-wider uppercase hover:font-fugaz"
          >
            Contact
          </Link>
          <Link 
            href="/about" 
            className="text-black hover:text-gray-600 transition-colors duration-200 text-sm font-medium tracking-wider uppercase hover:font-fugaz"
          >
            About
          </Link>
        </div>
        
        {/* Bottom accent line */}
        <div className="flex justify-center">
          <div className="h-px w-32 bg-black"></div>
        </div>
      </div>
    </footer>
  )
}

export default Footer