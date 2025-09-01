import React from 'react'

interface RegisterPopupProps {
  isOpen: boolean
  onClose: () => void
}

const RegisterPopup: React.FC<RegisterPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-black p-8 max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-gray-600 text-xl font-bold"
        >
          ×
        </button>
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-black relative mx-auto mb-4">
            <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
            <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
          </div>
          <h2 className="text-2xl font-bold text-black tracking-wider mb-2">
            SIGN IN REQUIRED
          </h2>
          <div className="h-px w-16 bg-black mx-auto mb-4"></div>
        </div>
        
        {/* Content */}
        <div className="text-center space-y-4">
          <p className="text-gray-700 tracking-wide">
            To access the <strong>Performance View</strong> and track your kanji learning progress, 
            you need to be signed in.
          </p>
          
          <div className="space-y-3 pt-4">
            <a
              href="/login"
              className="block w-full bg-black text-white py-3 px-6 text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors border-2 border-black"
            >
              SIGN IN
            </a>
            <a
              href="/auth/forgot"
              className="block w-full bg-white text-black py-3 px-6 text-sm font-medium tracking-wider hover:bg-gray-100 transition-colors border-2 border-black"
            >
              FORGOT PASSWORD?
            </a>
          </div>
          
          <p className="text-sm text-gray-500 pt-2">
            Don&apos;t have an account? <a href="/login" className="text-black underline hover:no-underline">Create one here</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPopup