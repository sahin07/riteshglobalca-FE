import Link from 'next/link'
import { ServicesCardsGrid, ServiceCardItem } from '@/components/shared/ServicesCardsGrid'
import { SharedTestimonials, SharedTestimonialItem } from '@/components/shared/SharedTestimonials'
import { SharedNewsletter } from '@/components/shared/SharedNewsletter'
import { SharedFAQ, SharedFaqItem } from '@/components/shared/SharedFAQ'
import type { SharedNewsletterData } from '@/lib/sharedServicesSections'

type Crumb = { label: string; href?: string }

export function TaxonomyLanding({
  eyebrow,
  title,
  intro,
  description,
  crumbs,
  links,
  gridTitle,
  gridSubtitle,
  testimonials = [],
  faqs = [],
  newsletter,
}: {
  eyebrow?: string
  title: string
  intro?: string | null
  description?: string | null
  crumbs: Crumb[]
  links: ServiceCardItem[]
  gridTitle?: string
  gridSubtitle?: string
  testimonials?: SharedTestimonialItem[]
  faqs?: SharedFaqItem[]
  newsletter?: SharedNewsletterData
}) {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative flex min-h-[280px] items-center overflow-hidden bg-[#0b293d] md:min-h-[340px]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b293d] via-[#0b293d]/90 to-[#003B49]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(241,144,32,0.18)_0%,_transparent_50%)]" />
        <div className="relative mx-auto w-full max-w-[1400px] px-4 py-16 lg:px-8">
          <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-[12px] capitalize tracking-wide text-white/60">
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
          {eyebrow && (
            <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-[#F19020]">{eyebrow}</p>
          )}
          <h1 className="max-w-3xl text-[32px] font-bold leading-tight text-white md:text-[44px]">{title}</h1>
          {intro && (
            <p className="mt-4 max-w-2xl text-[16px] font-light leading-relaxed text-slate-200 md:text-[18px]">
              {intro}
            </p>
          )}
        </div>
      </section>

      {description && (
        <section className="bg-[#f8f9fa] pt-10">
          <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
            <p className="max-w-3xl whitespace-pre-line text-[15px] leading-relaxed text-slate-600">
              {description}
            </p>
          </div>
        </section>
      )}

      <ServicesCardsGrid
        title={gridTitle || 'Explore Services'}
        subtitle={gridSubtitle || 'Select a service area to continue.'}
        items={links}
      />

      <SharedTestimonials items={testimonials} />
      <SharedFAQ items={faqs} />
      <SharedNewsletter
        title={newsletter?.title}
        description={newsletter?.description}
        placeholder={newsletter?.placeholder}
        buttonText={newsletter?.buttonText}
      />
    </main>
  )
}
