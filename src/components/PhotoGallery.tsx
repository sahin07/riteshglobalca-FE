'use client'

import { useState, useEffect, useRef } from 'react'

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

  // Carousel states
  const [startIndex, setStartIndex] = useState(0)
  const [visibleItems, setVisibleItems] = useState(4)
  const [isPaused, setIsPaused] = useState(false)

  // Track max index we can slide to
  const maxIndex = Math.max(0, galleryItems.length - visibleItems)
  const isCarousel = galleryItems.length > 4

  // Handle keyboard events for Lightbox navigation
  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null)
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % galleryItems.length : null))
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + galleryItems.length) % galleryItems.length : null))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, galleryItems.length])

  // Track window resizing to dynamically update visible items count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleItems(4)
      } else if (window.innerWidth >= 768) {
        setVisibleItems(3)
      } else if (window.innerWidth >= 640) {
        setVisibleItems(2)
      } else {
        setVisibleItems(1)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-scroll (autoplay) functionality
  useEffect(() => {
    if (!isCarousel || isPaused) return

    const timer = setInterval(() => {
      setStartIndex((prev) => {
        const next = prev + 1
        return next > maxIndex ? 0 : next
      })
    }, 4000)

    return () => clearInterval(timer)
  }, [isCarousel, maxIndex, isPaused])

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % galleryItems.length)
    }
  }

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + galleryItems.length) % galleryItems.length)
    }
  }

  const slideNext = () => {
    setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const slidePrev = () => {
    setStartIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  return (
    <section className="py-16 bg-slate-50 overflow-hidden">
      <div className="container-prose mx-auto px-4 max-w-6xl relative">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto font-light leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {isCarousel ? (
          /* Carousel Viewport (more than 4 items) */
          <div
            className="relative w-full px-1 md:px-4"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Viewport wrapper */}
            <div className="w-full overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out -mx-3"
                style={{
                  transform: `translateX(-${startIndex * (100 / visibleItems)}%)`
                }}
              >
                {galleryItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-3 flex-shrink-0"
                    style={{ width: `${100 / visibleItems}%` }}
                  >
                    <div
                      onClick={() => setLightboxIndex(idx)}
                      className="group relative cursor-pointer overflow-hidden rounded-xl bg-slate-900 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 aspect-[4/3] border border-slate-200/50"
                    >
                      {/* Image */}
                      <img
                        src={item.url}
                        alt={item.caption}
                        className="w-full h-full object-contain select-none transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Gradient Overlay & Hover Caption */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
                        <span className="text-brand-orange text-xs mt-1 flex items-center gap-1 font-medium">
                          Click to expand
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 20v-4m0 4h4m-4 0l5-5m11 5h-4m4 0v-4m0 4l-5-5" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Left navigation arrow */}
            <button
              onClick={slidePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:translate-x-0 z-30 p-2.5 rounded-full bg-white shadow-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              aria-label="Previous Slide"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right navigation arrow */}
            <button
              onClick={slideNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-0 z-30 p-2.5 rounded-full bg-white shadow-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              aria-label="Next Slide"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : (
          /* Static Grid View (4 or fewer items) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className="group relative cursor-pointer overflow-hidden rounded-xl bg-slate-900 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 aspect-[4/3] border border-slate-200/50"
              >
                {/* Image */}
                <img
                  src={item.url}
                  alt={item.caption || `Gallery Image ${idx + 1}`}
                  className="w-full h-full object-contain select-none transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient Overlay & Hover Caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
                  <span className="text-white text-sm font-semibold tracking-wide">
                    {item.caption || `View Image`}
                  </span>
                  <span className="text-brand-orange text-xs mt-1 flex items-center gap-1 font-medium">
                    Click to expand
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 20v-4m0 4h4m-4 0l5-5m11 5h-4m4 0v-4m0 4l-5-5" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Premium Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm p-4 transition-opacity duration-300"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all transform hover:rotate-90 cursor-pointer"
            aria-label="Close Lightbox"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Left Arrow Button */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all transform active:scale-95 cursor-pointer"
            aria-label="Previous Image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all transform active:scale-95 cursor-pointer"
            aria-label="Next Image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Main Content Area */}
          <div
            className="relative max-w-5xl max-h-[80vh] flex items-center justify-center select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryItems[lightboxIndex].url}
              alt={galleryItems[lightboxIndex].caption || `Expanded View`}
              className="w-full h-full object-contain rounded-lg shadow-2xl border border-white/5"
            />
          </div>

          {/* Footer Text / Pagination */}
          <div className="mt-6 text-center select-none" onClick={(e) => e.stopPropagation()}>
            <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-semibold">
              {lightboxIndex + 1} of {galleryItems.length}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
