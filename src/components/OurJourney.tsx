'use client'

import { useEffect, useRef, useState } from 'react'

export interface Milestone {
  id: number
  yearTitle: string
  description: string
}

export interface OurJourneyProps {
  title: string
  subtitle: string
  milestones: Milestone[]
}

export function OurJourney({ title, subtitle, milestones }: OurJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      
      const { top, height } = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Calculate progress based on the middle of the viewport
      const start = top - windowHeight / 2
      const totalScrollable = height
      
      let progress = -start / totalScrollable
      progress = Math.max(0, Math.min(1, progress))
      
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initialize on mount
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="py-20 md:py-28 bg-[#fdfdfd] overflow-hidden">
      <div className="container-prose max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#1f3b55] tracking-wide mb-4">
            {title}
          </h2>
          <p className="text-slate-500 text-[15px] md:text-[16px] max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-5xl mx-auto py-10" ref={containerRef}>
          
          {/* Background Lines */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-[#1f3b55] -translate-x-1/2 rounded-full"></div>
          
          {/* Active Lines (Filling Animation) */}
          <div 
            className="absolute left-8 md:left-1/2 top-0 w-[2px] bg-[#f28e2b] -translate-x-1/2 origin-top transition-all duration-75 rounded-full z-0" 
            style={{ height: `${scrollProgress * 100}%` }}
          ></div>

          <div className="flex flex-col gap-12 md:gap-0">
            {milestones.map((m, index) => {
              const isEven = index % 2 === 0
              
              // Calculate when this card's dot should activate
              const activationPoint = index / (milestones.length - 1 || 1)
              const isActive = scrollProgress >= Math.max(0, activationPoint - 0.1)
              const isLast = index === milestones.length - 1

              return (
                <div key={m.id || index} className="relative flex items-center w-full md:h-56">
                  
                  {/* Center Dot */}
                  <div className={`absolute left-8 md:left-1/2 -translate-x-1/2 w-[22px] h-[22px] rounded-full bg-white border-[3px] flex items-center justify-center z-10 transition-colors duration-500 ${isActive ? 'border-[#f28e2b]' : 'border-[#1f3b55]'}`}>
                    {isLast ? (
                      <div className={`w-[12px] h-[12px] rounded-full flex items-center justify-center text-white transition-colors duration-500 ${isActive ? 'bg-[#f28e2b]' : 'bg-[#1f3b55]'}`}>
                        <svg className="w-[8px] h-[8px] fill-current" viewBox="0 0 24 24">
                          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.858 1.4-8.168-5.934-5.787 8.2-1.192z"/>
                        </svg>
                      </div>
                    ) : (
                      <div className={`w-[10px] h-[10px] rounded-full transition-colors duration-500 ${isActive ? 'bg-[#f28e2b]' : 'bg-[#1f3b55]'}`}></div>
                    )}
                  </div>

                  {/* Desktop Layout Wrapper: pushes content left or right */}
                  <div className={`w-full flex ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                    
                    {/* Card Component */}
                    <div className={`w-[calc(100%-4rem)] ml-16 md:ml-0 md:w-[45%] bg-[#0b293d] rounded-xl p-8 shadow-xl text-white transform transition-all duration-500 hover:-translate-y-1 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                      <h3 className="text-[18px] md:text-[20px] font-medium mb-3 text-white leading-snug">
                        {m.yearTitle}
                      </h3>
                      <p className="text-white/70 leading-relaxed text-[13.5px] md:text-[14.5px] font-light">
                        {m.description}
                      </p>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
      </div>
    </section>
  )
}
