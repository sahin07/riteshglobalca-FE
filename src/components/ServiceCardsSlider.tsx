'use client'

import { useEffect, useState } from 'react'
import { ServiceCard } from '@/components/ServiceCard'

export type CoreServiceItem = {
  title: string
  description: string
  href?: string
  image?: string
}

export function ServiceCardsSlider({ services = [] }: { services?: CoreServiceItem[] }) {
  const items = services || []
  const [startIndex, setStartIndex] = useState(0)
  const [visibleItems, setVisibleItems] = useState(3)
  const [isPaused, setIsPaused] = useState(false)

  const canSlide = items.length > visibleItems
  const maxIndex = Math.max(0, items.length - visibleItems)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setVisibleItems(3)
      else if (window.innerWidth >= 768) setVisibleItems(2)
      else setVisibleItems(1)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setStartIndex((prev) => Math.min(prev, maxIndex))
  }, [maxIndex])

  useEffect(() => {
    if (!canSlide || isPaused) return
    const timer = setInterval(() => {
      setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 4500)
    return () => clearInterval(timer)
  }, [canSlide, maxIndex, isPaused])

  const slideNext = () => {
    if (!canSlide) return
    setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const slidePrev = () => {
    if (!canSlide) return
    setStartIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  if (items.length === 0) return null

  return (
    <div
      className="relative w-full px-8 sm:px-10 md:px-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${startIndex * (100 / visibleItems)}%)`,
          }}
        >
          {items.map((service, index) => (
            <div
              key={`${service.title}-${index}`}
              className="flex h-auto shrink-0 px-3 sm:px-4"
              style={{ width: `${100 / visibleItems}%` }}
            >
              <div className="w-full">
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  href={service.href}
                  image={service.image}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {canSlide && (
        <>
          <button
            type="button"
            onClick={slidePrev}
            className="absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:bg-slate-50 sm:h-11 sm:w-11"
            aria-label="Previous services"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={slideNext}
            className="absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:bg-slate-50 sm:h-11 sm:w-11"
            aria-label="Next services"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}
