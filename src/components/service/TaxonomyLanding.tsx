import Link from 'next/link'
import { plainTextFromHtml } from '@/lib/serviceContent'
import { ServicesCardsGrid, ServiceCardItem } from '@/components/shared/ServicesCardsGrid'
import { SharedTestimonials, SharedTestimonialItem } from '@/components/shared/SharedTestimonials'
import { SharedFAQ, SharedFaqItem } from '@/components/shared/SharedFAQ'
import type { GoogleReviewsSummary } from '@/components/shared/GoogleReviewsBadge'

type Crumb = { label: string; href?: string }

type DescriptionBlock = { titleHtml: string; bodyHtml: string }

function splitDescription(html: string): { blocks: DescriptionBlock[]; restHtml: string } {
  const blocks: DescriptionBlock[] = []
  const pattern = /<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>\s*((?:<p[^>]*>[\s\S]*?<\/p>\s*)+)/gi
  const restHtml = html
    .replace(pattern, (_, titleHtml: string, bodyHtml: string) => {
      blocks.push({ titleHtml: titleHtml.trim(), bodyHtml: bodyHtml.trim() })
      return ''
    })
    .trim()
  return { blocks, restHtml }
}

function DescriptionSection({ description }: { description: string }) {
  if (!/<[a-z][\s\S]*>/i.test(description)) {
    return (
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <p className="max-w-3xl whitespace-pre-line text-[15px] leading-relaxed text-slate-600 md:text-[16px]">
            {plainTextFromHtml(description)}
          </p>
        </div>
      </section>
    )
  }

  const { blocks, restHtml } = splitDescription(description)
  const columns =
    blocks.length > 1 && blocks.length % 3 === 0
      ? 'md:grid-cols-2 xl:grid-cols-3'
      : blocks.length > 1
        ? 'md:grid-cols-2'
        : 'max-w-3xl'

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
        {blocks.length > 0 && (
          <div className={`grid grid-cols-1 gap-6 ${columns}`}>
            {blocks.map((block, i) => (
              <article
                key={i}
                className="group relative flex gap-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#F19020]/40 hover:shadow-lg md:p-8"
              >
                <span className="absolute inset-y-0 left-0 w-1 bg-[#F19020]" aria-hidden="true" />
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F19020]/10 text-[#F19020] transition-colors group-hover:bg-[#F19020] group-hover:text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 12l2 2 4-4" />
                    <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <h3
                    className="mb-2 text-[18px] font-bold leading-snug text-[#0b293d] md:text-[20px]"
                    dangerouslySetInnerHTML={{ __html: block.titleHtml }}
                  />
                  <div
                    className="space-y-3 text-[15px] leading-relaxed text-slate-600"
                    dangerouslySetInnerHTML={{ __html: block.bodyHtml }}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
        {restHtml && (
          <div
            className={`strapi-html max-w-4xl ${blocks.length > 0 ? 'mt-10' : ''}`}
            dangerouslySetInnerHTML={{ __html: restHtml }}
          />
        )}
      </div>
    </section>
  )
}

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
  googleSummary,
  faqs = [],
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
  googleSummary?: GoogleReviewsSummary | null
  faqs?: SharedFaqItem[]
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
              {plainTextFromHtml(intro)}
            </p>
          )}
        </div>
      </section>

      {description && <DescriptionSection description={description} />}

      <ServicesCardsGrid
        title={gridTitle || 'Explore Services'}
        subtitle={gridSubtitle || 'Select a service area to continue.'}
        items={links}
      />

      <SharedTestimonials
        badge="Google Reviews"
        logoSrc="/images/google-reviews-logo.png"
        items={testimonials}
        googleSummary={googleSummary}
      />
      <SharedFAQ items={faqs} />
</main>
  )
}
