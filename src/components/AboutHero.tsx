import { Button } from './Button'
import Link from 'next/link'

export interface AboutHeroProps {
  title: string
  description: string
  backgroundImageUrl?: string
  primaryButtonText?: string
  primaryButtonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
}

export function AboutHero({
  title,
  description,
  backgroundImageUrl,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink
}: AboutHeroProps) {
  return (
    // Locked to banner asset ratio 1920×800 so the image fits without crop
    <section className="relative header-overlap w-full min-h-[420px] sm:min-h-[460px] md:min-h-0 md:aspect-[1920/800] overflow-hidden bg-[#0b293d]">
      {backgroundImageUrl && (
        <>
          <img
            src={backgroundImageUrl}
            alt={title}
            className="absolute inset-0 h-[108%] w-full object-cover object-center translate-y-[3%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/40 to-slate-950/20" />
        </>
      )}

      <div className="absolute inset-0 z-10 flex items-center">
        <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 pt-16 sm:pt-20 md:pt-24 text-left">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight sm:leading-snug">
              {title}
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-white/95 leading-relaxed max-w-2xl">
              {description}
            </p>
            <div className="mt-5 sm:mt-7 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 w-full sm:w-auto justify-start">
              {primaryButtonText && primaryButtonLink && (
                <Link href={primaryButtonLink} className="w-full sm:w-auto">
                  <Button variant="primary" className="w-full sm:w-auto bg-[#f28e2b] hover:bg-[#e07b1a] text-white px-6 py-2.5 sm:py-3 rounded-[8px] text-sm sm:text-base font-medium border-none shadow-sm transition-colors">
                    {primaryButtonText}
                  </Button>
                </Link>
              )}
              {secondaryButtonText && secondaryButtonLink && (
                <Link href={secondaryButtonLink} className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto border border-white text-white hover:bg-white hover:text-slate-900 px-6 py-2.5 sm:py-3 rounded-[8px] text-sm sm:text-base font-medium transition-colors bg-transparent">
                    {secondaryButtonText}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
