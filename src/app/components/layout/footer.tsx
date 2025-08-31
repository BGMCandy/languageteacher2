import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Brand and copyright */}
        <div className="text-center mb-6">
          <p className="text-lg font-semibold text-gray-700 mb-2">
            languageteacher.io™
          </p>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
        
        {/* Navigation links */}
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          <Link 
            href="/terms-and-conditions" 
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm"
          >
            Terms & Conditions
          </Link>
          <Link 
            href="/privacy-policy" 
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm"
          >
            Privacy Policy
          </Link>
          <Link 
            href="/contact" 
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm"
          >
            Contact
          </Link>
          <Link 
            href="/about" 
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm"
          >
            About
          </Link>
        </div>
        

      </div>
    </footer>
  )
}

export default Footer