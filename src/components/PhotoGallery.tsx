'use client'

import { useState, useEffect } from 'react'

export interface GalleryImage {
  url: string
  caption?: string
}

export interface PhotoGalleryProps {
  images?: GalleryImage[]
  title?: string
  subtitle?: string
}

export function PhotoGallery({ images, title, subtitle }: PhotoGalleryProps) {
  const galleryItems = images && images.length > 0 ? images : []
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [startIndex, setStartIndex] = useState(0)
  const [visibleItems, setVisibleItems] = useState(3)
  const [isPaused, setIsPaused] = useState(false)

  const canSlide = galleryItems.length > visibleItems
  const maxIndex = Math.max(0, galleryItems.length - visibleItems)

  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % galleryItems.length : null))
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + galleryItems.length) % galleryItems.length : null
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, galleryItems.length])

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

  // Keep index in range when breakpoint changes
  useEffect(() => {
    setStartIndex((prev) => Math.min(prev, maxIndex))
  }, [maxIndex])

  // Auto-advance one slide at a time
  useEffect(() => {
    if (!canSlide || isPaused || lightboxIndex !== null) return

    const timer = setInterval(() => {
      setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 4000)

    return () => clearInterval(timer)
  }, [canSlide, maxIndex, isPaused, lightboxIndex])

  const slideNext = () => {
    if (!canSlide) return
    setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const slidePrev = () => {
    if (!canSlide) return
    setStartIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const nextLightbox = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % galleryItems.length : null))
  }

  const prevLightbox = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + galleryItems.length) % galleryItems.length : null
    )
  }

  if (galleryItems.length === 0) return null

  return (
    <section className="overflow-hidden bg-slate-50 py-12 sm:py-16">
      <div className="relative mx-auto w-full max-w-screen-2xl px-4 md:px-8 lg:px-12">
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark md:text-4xl">{title}</h2>
          {subtitle && (
            <p className="mx-auto mt-3 max-w-2xl font-light leading-relaxed text-slate-600">
              {subtitle}
            </p>
          )}
        </div>

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
              {galleryItems.map((item, idx) => (
                <div
                  key={idx}
                  className="shrink-0 px-2 sm:px-3"
                  style={{ width: `${100 / visibleItems}%` }}
                >
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className="group relative aspect-[5/4] w-full cursor-pointer overflow-hidden rounded-xl border border-slate-200/50 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <img
                      src={item.url}
                      alt={item.caption || `Trusted logo ${idx + 1}`}
                      className="h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Prev / Next — one slide at a time */}
          {canSlide && (
            <>
              <button
                type="button"
                onClick={slidePrev}
                className="absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:bg-slate-50 sm:h-11 sm:w-11"
                aria-label="Previous"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={slideNext}
                className="absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:bg-slate-50 sm:h-11 sm:w-11"
                aria-label="Next"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 z-50 cursor-pointer rounded-full bg-white/10 p-2.5 text-white transition-all hover:rotate-90 hover:bg-white/20"
            aria-label="Close Lightbox"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            type="button"
            onClick={prevLightbox}
            className="absolute left-4 top-1/2 z-50 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 active:scale-95"
            aria-label="Previous Image"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={nextLightbox}
            className="absolute right-4 top-1/2 z-50 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 active:scale-95"
            aria-label="Next Image"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div
            className="relative flex max-h-[80vh] max-w-5xl items-center justify-center select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryItems[lightboxIndex].url}
              alt={galleryItems[lightboxIndex].caption || 'Expanded View'}
              className="h-full w-full rounded-lg border border-white/5 object-contain shadow-2xl"
            />
          </div>

          <div className="mt-6 select-none text-center" onClick={(e) => e.stopPropagation()}>
            <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              {lightboxIndex + 1} of {galleryItems.length}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
