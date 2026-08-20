import Link from 'next/link'
import { getStrapiMedia } from '@/lib/strapi'

interface ServiceHeroSectionProps {
  service: any
  crumbs?: { label: string; href?: string }[]
}

function completeSentences(text: string): string {
  const cleaned = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  if (!cleaned) return ''
  if (/[.!?]["']?$/.test(cleaned)) return cleaned
  const idx = Math.max(cleaned.lastIndexOf('.'), cleaned.lastIndexOf('?'), cleaned.lastIndexOf('!'))
  if (idx >= 20) return cleaned.slice(0, idx + 1).trim()
  return cleaned
}

export function ServiceHeroSection({ service, crumbs }: ServiceHeroSectionProps) {
  const bgUrl = service.image?.url && getStrapiMedia(service.image.url)
  const heroCopy = completeSentences(service.heroSubtitle || '')

  return (
    <section className="relative overflow-hidden min-h-[320px] md:min-h-[380px] flex items-center">
      {/* Background image layer */}
      <div className="absolute inset-0">
        {bgUrl ? (
          <img
            src={bgUrl}
            alt={service.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#081e2e] via-[#0b293d] to-[#0d3148]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b293d]/95 via-[#0b293d]/65 to-[#0b293d]/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(241,144,32,0.12)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.06)_0%,_transparent_50%)]" />
      </div>

      <div className="relative w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-20 md:py-24">
        {/* Breadcrumbs */}
        {crumbs && crumbs.length > 0 && (
          <nav className="flex flex-wrap items-center gap-1.5 text-[12px] uppercase tracking-wider text-white/60 mb-5">
            {crumbs.map((crumb, i) => (
              <span key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-white/30">/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white transition-colors">{crumb.label}</Link>
                ) : (
                  <span className="text-white/90">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1 className="text-[32px] md:text-[44px] lg:text-[52px] font-bold text-white leading-[1.1] tracking-tight mb-4 font-serif">
          {service.heroTitle || service.title}
        </h1>
        {heroCopy && (
          <p className="text-[15px] md:text-[17px] text-white/80 leading-relaxed max-w-2xl">
            {heroCopy}
          </p>
        )}
      </div>
    </section>
  )
}
