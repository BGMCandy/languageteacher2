'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface QuizStartAnimationProps {
  show: boolean
}

export default function QuizStartAnimation({ show }: QuizStartAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Combined Animation Container */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ x: '100vw', opacity: 0 }}
            animate={{ 
              x: 0, // Center the container
              opacity: [0, 1, 0] // Fade in and out
            }}
            transition={{ 
              duration: 1.2, // Doubled from 0.6 to 1.2 seconds
              ease: "easeOut",
              opacity: {
                times: [0, 0.3, 1],
                duration: 1.2 // Doubled from 0.6 to 1.2 seconds
              }
            }}
          >
            {/* Fox Image Container */}
            <div className="relative w-full h-[90vh]">
              <Image
                src="https://media.languageteacher.io/adult-fox.webp"
                alt="Fox"
                fill
                className="object-contain"
                sizes="100vw"
                onError={(e) => {
                  console.error('Image failed to load, using fallback')
                  const target = e.currentTarget as HTMLImageElement
                  const fallback = target.nextElementSibling as HTMLElement
                  target.style.display = 'none'
                  if (fallback) fallback.style.display = 'block'
                }}
              />
              {/* Fallback div if image fails */}
              <div 
                className="w-full h-full bg-orange-400 flex items-center justify-center text-6xl"
                style={{ display: 'none' }}
              >
                🦊
              </div>
              
              {/* "Let's go!" Text Overlay */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
                <div className="text-6xl sm:text-8xl font-bold text-black font-fugaz">
                  Let&apos;s go!
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 