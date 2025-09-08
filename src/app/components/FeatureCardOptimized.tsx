'use client'

import Link from 'next/link'
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

export default function FeatureCardOptimized({
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

  return (
    <Link href={href} className="group relative block">
      <div 
        className="relative border-2 border-black p-8 hover:bg-black hover:text-white transition-all duration-300 min-h-[280px] flex flex-col justify-between overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Desktop: Floating image outside the box - only on hover */}
        {isHovered && (
          <div
            className="fixed w-[90vh] h-[90vh] z-40 pointer-events-none opacity-30 transition-opacity duration-300"
            style={{ 
              top: `calc(5vh + ${offsetY})`,
              left: enterFrom === 'left' ? 'calc(10vw - 45vh)' : 'calc(90vw - 45vh)'
            }}
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-contain"
              sizes="90vh"
              priority={false}
              loading="lazy"
              style={{ backgroundColor: 'transparent' }}
            />
          </div>
        )}

        {/* BIG overlay text - desktop hover only */}
        {overlayText && (
          <div
            aria-hidden
            className="
              pointer-events-none select-none
              absolute inset-0 z-10
              flex items-end justify-end
              pr-2 pb-1 sm:pr-4 sm:pb-2
              overflow-hidden
              opacity-0 group-hover:opacity-100
              transition-opacity duration-300
            "
          >
            <span
              className="
                font-extrabold
                text-right
                whitespace-nowrap
                leading-none tracking-tight
                text-[clamp(1.5rem,6vw,4rem)]
              "
            >
              {overlayText}
            </span>
          </div>
        )}

        {/* Content */}
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
