import Image from 'next/image'
import Link from 'next/link'
import { Button } from './Button'

export interface HeroProps {
  title?: string
  description?: string
  primaryButtonText?: string
  primaryButtonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  backgroundImage?: string
}

export function Hero({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  backgroundImage
}: HeroProps) {
  return (
    <section className="relative overflow-hidden flex items-center">
      {/* Background Image */}
      {backgroundImage && (
        <>
          {/* Ambient blurred backdrop for small screens */}
          <div className="absolute inset-0 overflow-hidden w-[100%] h-[100%] sm:hidden">
            <Image
              src={backgroundImage}
              alt=""
              fill
              sizes="100vw"
              className="object-cover blur-xl opacity-40 scale-110"
              aria-hidden="true"
            />
          </div>
          {/* Main Background Image: contained on mobile to show all partners, cover on desktop */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={backgroundImage}
              alt={title || "Hero Background"}
              fill
              sizes="100vw"
              className="object-cover object-[70%_center] sm:object-[65%_center]"
              priority
            />
          </div>
          {/* Soft left gradient — image already has left vignette for text */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent sm:from-slate-950/75 sm:via-slate-950/35 sm:to-transparent" />
        </>
      )}

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-12 sm:py-20 md:py-28 lg:py-32 text-left">
        <div className="max-w-2xl mr-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-tight sm:leading-snug md:leading-tight text-left">
            {title}
          </h1>
          <p className="mt-3 sm:mt-5 text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed font-normal max-w-2xl text-left">
            {description}
          </p>
          <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 w-full sm:w-auto justify-start">
            {primaryButtonText && primaryButtonLink && (
              <Link href={primaryButtonLink} className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto bg-brand-orange hover:bg-orange-600 text-white font-bold px-6 sm:px-8 py-3 text-sm sm:text-base shadow-md">
                  {primaryButtonText}
                </Button>
              </Link>
            )}
            {secondaryButtonText && secondaryButtonLink && (
              <Link href={secondaryButtonLink} className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-brand-dark font-semibold px-6 sm:px-8 py-3 text-sm sm:text-base">
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
