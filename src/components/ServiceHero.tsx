import Link from 'next/link'

type Crumb = { label: string; href?: string }

interface ServiceHeroProps {
  title?: string
  subtitle?: string
  backgroundImage?: string | null
  primaryButtonText?: string
  primaryButtonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  crumbs?: Crumb[]
}

export function ServiceHero({
  title,
  subtitle,
  backgroundImage,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  crumbs,
}: ServiceHeroProps) {
  return (
    <section className="relative flex min-h-[280px] items-center overflow-hidden bg-[#0b293d] sm:min-h-[320px] md:min-h-[360px]">
      <div className="absolute inset-0">
        {backgroundImage && (
          <>
            <div className="absolute inset-0 overflow-hidden md:hidden">
              <img
                src={backgroundImage}
                alt=""
                className="h-full w-full scale-110 object-cover opacity-40 blur-xl"
                aria-hidden="true"
              />
            </div>
            <img
              src={backgroundImage}
              alt="Service background"
              className="h-full w-full object-contain object-center opacity-70 mix-blend-overlay md:object-cover"
            />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b293d] via-[#0b293d]/85 to-[#003B49]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(241,144,32,0.16)_0%,_transparent_50%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-4 py-10 sm:py-14 md:py-16 lg:px-8">
        {crumbs && crumbs.length > 0 && (
          <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[12px] capitalize tracking-wide text-white/60">
            {crumbs.map((crumb, i) => (
              <span key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-white/35">/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="transition-colors hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/90">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="max-w-2xl">
          <h1 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-white sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mb-6 whitespace-pre-line text-sm font-normal leading-relaxed text-white/95 sm:mb-8 sm:text-base md:text-lg lg:text-xl">
            {subtitle}
          </p>
          <div className="flex w-full flex-col flex-wrap gap-3 sm:w-auto sm:flex-row sm:gap-4">
            {primaryButtonText && (
              <Link href={primaryButtonLink || '/contact'} className="w-full sm:w-auto">
                <button className="w-full rounded-[6px] bg-[#F19020] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#d87f1c] sm:w-auto sm:px-8 sm:py-3 sm:text-base">
                  {primaryButtonText}
                </button>
              </Link>
            )}
            {secondaryButtonText && (
              <Link href={secondaryButtonLink || '/contact'} className="w-full sm:w-auto">
                <button className="w-full rounded-[6px] border border-white bg-transparent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:w-auto sm:px-8 sm:py-3 sm:text-base">
                  {secondaryButtonText}
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
