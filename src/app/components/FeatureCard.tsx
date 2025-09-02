'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useScrollAnimation } from './elements/animations/useScrollAnimation'

interface FeatureCardProps {
  href: string
  title: string
  description: string
  iconStyle?: React.CSSProperties
  imageUrl: string
  /** 'left' = enter from left, stop at 20% from left; 'right' = enter from right, stop at 20% from right */
  enterFrom?: 'left' | 'right'
  /** vertical offset in %, allowed range -10 → 10 (relative to viewport height) */
  verticalOffset?: number
  /** Large, subtle text shown inside the box from bottom-right on hover */
  overlayText?: string
}

export default function FeatureCard({
  href,
  title,
  description,
  iconStyle,
  imageUrl,
  enterFrom = 'right',
  verticalOffset = 0,
  overlayText
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { ref, isVisible, scrollProgress } = useScrollAnimation({ 
    threshold: 0.1, 
    triggerOnce: false,
    trackScrollPosition: true 
  })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Clamp vertical offset to -10..10 (vh)
  const clampedOffset = Math.max(-10, Math.min(10, verticalOffset))
  const offsetY = `${clampedOffset}vh`

  // Animation values for slide-in effect
  const initialX = enterFrom === 'right' ? '100vw' : '-100vw'
  const exitX = initialX

  // Show floating image on desktop hover OR mobile scroll
  const shouldShowFloatingImage = isMobile ? (scrollProgress > 0.3) : isHovered

  return (
    <Link href={href} className="group relative">
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="relative border-2 border-black p-8 hover:bg-black hover:text-white transition-all duration-300 min-h-[280px] flex flex-col justify-between overflow-hidden"
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isMobile ? (isVisible ? 1 : 0.7) : 1,
          y: isMobile ? (isVisible ? 0 : 20) : 0
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Desktop: Floating image outside the box */}
        {shouldShowFloatingImage && !isMobile && (
          <motion.div
            className="fixed w-[90vh] h-[90vh] z-40 pointer-events-none"
            style={{ 
              top: `calc(5vh + ${offsetY})`,
              left: enterFrom === 'left' ? 'calc(10vw - 45vh)' : 'calc(90vw - 45vh)'
            }}
            initial={{ x: initialX, opacity: 0 }}
            animate={{ x: 0, opacity: 0.3 }}
            exit={{ x: exitX, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-contain"
              sizes="90vh"
              priority={false}
              style={{ backgroundColor: 'transparent' }}
            />
          </motion.div>
        )}

        {/* Mobile: Image on the right side of the box */}
        {isMobile && (
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full z-10 pointer-events-none"
            animate={{ 
              opacity: scrollProgress * 0.2,
              scale: 0.8 + (scrollProgress * 0.2)
            }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
          >
            <div className="relative w-full h-full">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 50vw, 90vh"
                priority={false}
                style={{ backgroundColor: 'transparent' }}
              />
            </div>
          </motion.div>
        )}

        {/* BIG overlay text - desktop hover or mobile scroll */}
        {overlayText && (
          <motion.div
            aria-hidden
            className="
              pointer-events-none select-none
              absolute inset-0 z-10
              flex items-end justify-end
              pr-2 pb-1 sm:pr-4 sm:pb-2
              overflow-hidden
            "
            animate={{ 
              opacity: isMobile ? (scrollProgress * 0.3) : 0
            }}
            transition={{ duration: 0.1 }}
          >
            <motion.span
              className="
                font-extrabold
                text-right
                whitespace-nowrap
                leading-none tracking-tight
                text-[clamp(1.5rem,6vw,4rem)]
              "
              animate={{ 
                scale: 0.8 + (scrollProgress * 0.2),
                opacity: isMobile ? (scrollProgress * 0.3) : 0
              }}
              transition={{ duration: 0.1 }}
            >
              {overlayText}
            </motion.span>
          </motion.div>
        )}

        {/* Content (above overlay) */}
        <motion.div 
          className="relative z-20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isMobile ? (isVisible ? 1 : 0.8) : 1,
            y: isMobile ? (isVisible ? 0 : 10) : 0
          }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <motion.div
            className="w-12 h-12 bg-black group-hover:bg-white mb-6 transition-colors duration-300"
            style={iconStyle}
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ 
              scale: isMobile ? (isVisible ? 1 : 0.8) : 1,
              rotate: isMobile ? (isVisible ? 0 : -10) : 0
            }}
            transition={{ duration: 0.4, delay: 0.3 }}
          />
          <h3 className="text-xl font-bold text-black group-hover:text-white mb-4 tracking-wider transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 group-hover:text-gray-200 leading-relaxed transition-colors duration-300">
            {description}
          </p>
        </motion.div>

        <motion.div 
          className="h-px w-16 bg-black group-hover:bg-white mt-6 transition-colors duration-300 relative z-20"
          initial={{ scaleX: 0 }}
          animate={{ 
            scaleX: isMobile ? (isVisible ? 1 : 0) : 1
          }}
          transition={{ duration: 0.4, delay: 0.4 }}
        />
      </motion.div>
    </Link>
  )
}
