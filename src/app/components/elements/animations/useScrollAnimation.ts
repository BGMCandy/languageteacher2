'use client'

import { useEffect, useRef, useState } from 'react'

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  trackScrollPosition?: boolean
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true, trackScrollPosition = false } = options
  const [isVisible, setIsVisible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            setHasTriggered(true)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    // Track scroll position for smooth in/out animation
    if (trackScrollPosition) {
      const handleScroll = () => {
        if (!element) return
        
        const rect = element.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const elementHeight = rect.height
        
        // Calculate how much of the element is visible
        const visibleTop = Math.max(0, rect.top)
        const visibleBottom = Math.min(windowHeight, rect.bottom)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)
        
        // Calculate progress (0 = not visible, 1 = fully visible in center)
        const progress = visibleHeight / elementHeight
        
        // Create a bell curve effect - most visible when centered
        const centerProgress = Math.abs(rect.top + elementHeight / 2 - windowHeight / 2)
        const maxDistance = windowHeight / 2 + elementHeight / 2
        const bellCurve = Math.max(0, 1 - (centerProgress / maxDistance))
        
        setScrollProgress(bellCurve)
      }

      window.addEventListener('scroll', handleScroll)
      handleScroll() // Initial call

      return () => {
        observer.unobserve(element)
        window.removeEventListener('scroll', handleScroll)
      }
    }

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, triggerOnce, trackScrollPosition])

  return { 
    ref, 
    isVisible: triggerOnce ? (hasTriggered ? true : isVisible) : isVisible,
    scrollProgress 
  }
} 