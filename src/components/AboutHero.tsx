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
    <section className="relative overflow-hidden flex items-center">
      <div className="absolute inset-0">
        {backgroundImageUrl && (
          <>
            <div className="absolute inset-0 overflow-hidden md:hidden">
              <img
                src={backgroundImageUrl}
                alt=""
                className="w-full h-full object-cover blur-xl opacity-40 scale-110"
                aria-hidden="true"
              />
            </div>
            <img
              src={backgroundImageUrl}
              alt={title}
              className="w-full h-full object-contain md:object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-slate-950/50 to-slate-950/40 sm:from-slate-950/40 sm:via-slate-950/20 sm:to-slate-950/10" />
          </>
        )}
      </div>

      <div className="relative container-prose py-12 sm:py-20 md:py-28 lg:py-32 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-tight sm:leading-snug">
            {title}
          </h1>
          <p className="mt-3 sm:mt-5 text-sm sm:text-base md:text-lg lg:text-xl text-white/95 leading-relaxed max-w-5xl">
            {description}
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 w-full sm:w-auto">
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
    </section>
  )
}
