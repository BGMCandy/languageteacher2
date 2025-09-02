'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

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

  // Clamp vertical offset to -10..10 (vh)
  const clampedOffset = Math.max(-10, Math.min(10, verticalOffset))
  const offsetY = `${clampedOffset}vh`

  // Animation values for slide-in effect
  const initialX = enterFrom === 'right' ? '100vw' : '-100vw'
  const exitX = initialX

  return (
    <Link href={href} className="group relative">
      <div
        className="relative border-2 border-black p-8 hover:bg-black hover:text-white transition-all duration-300 min-h-[280px] flex flex-col justify-between overflow-visible"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Floating image */}
        {isHovered && (
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

        {/* BIG overlay text (hover-only, bottom-right) */}
        {overlayText && (
          <div
            aria-hidden
            className="
              pointer-events-none select-none
              absolute inset-0 z-10
              flex items-end justify-end
              pr-2 pb-1 sm:pr-4 sm:pb-2
              opacity-0 group-hover:opacity-20 transition-opacity duration-300
              overflow-hidden
            "
          >
            <span
              className="
                font-extrabold
                text-right
                whitespace-nowrap
                leading-none tracking-tight
                text-[clamp(3rem,12vw,10rem)]
              "
            >
              {overlayText}
            </span>
          </div>
        )}

        {/* Content (above overlay) */}
        <div className="relative z-20">
          <div
            className="w-12 h-12 bg-black group-hover:bg-white mb-6 transition-colors duration-300"
            style={iconStyle}
          />
          <h3 className="text-xl font-bold text-black group-hover:text-white mb-4 tracking-wider transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 group-hover:text-gray-200 leading-relaxed transition-colors duration-300">
            {description}
          </p>
        </div>

        <div className="h-px w-16 bg-black group-hover:bg-white mt-6 transition-colors duration-300 relative z-20" />
      </div>
    </Link>
  )
}
