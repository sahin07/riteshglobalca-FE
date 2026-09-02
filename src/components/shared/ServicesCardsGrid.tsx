import Link from 'next/link'
import { plainTextFromHtml } from '@/lib/serviceContent'

export type ServiceCardItem = {
  title: string
  description?: string | null
  href: string
}

const icons = [
  // document search
  <svg key="i0" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>,
  // handshake / partners
  <svg key="i1" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>,
  // calculator / tax
  <svg key="i2" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m-6 4h6m-6 4h.01M9 19h.01M15 15h.01M15 19h.01M5 5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
  </svg>,
  // community
  <svg key="i3" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
  </svg>,
  // wallet / finance
  <svg key="i4" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>,
  // shield
  <svg key="i5" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>,
]

interface ServicesCardsGridProps {
  title?: string
  subtitle?: string
  items: ServiceCardItem[]
}

export function ServicesCardsGrid({
  title = 'Our Core Services',
  subtitle = 'Expert CA services to support individuals, startups, and enterprises.',
  items,
}: ServicesCardsGridProps) {
  if (!items.length) return null

  return (
    <section className="bg-[#f8f9fa] py-16 md:py-20">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
        {(title || subtitle) && (
          <div className="mb-12 text-center md:mb-14">
            {title && (
              <h2 className="mb-3 text-[28px] font-bold text-[#0b293d] md:text-[36px]">{title}</h2>
            )}
            {subtitle && (
              <p className="mx-auto max-w-2xl text-[15px] text-slate-600 md:text-[16px]">{subtitle}</p>
            )}
          </div>
        )}

        <div
          className={`grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 ${
            items.length === 1
              ? 'mx-auto max-w-md lg:grid-cols-1'
              : items.length === 2
                ? 'mx-auto max-w-3xl lg:grid-cols-2'
                : 'lg:grid-cols-3'
          }`}
        >
          {items.map((item, idx) => (
            <div
              key={item.href}
              className="flex flex-col items-center rounded-[28px] bg-[#eef1f4] px-7 py-10 text-center transition-shadow hover:shadow-md"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center text-[#F19020]">
                {icons[idx % icons.length]}
              </div>
              <h3 className="mb-3 text-[18px] font-bold leading-snug text-[#0b293d] md:text-[20px]">
                {item.title}
              </h3>
              {item.description && (
                <p className="mb-8 line-clamp-4 flex-1 text-[14px] leading-relaxed text-slate-500">
                  {plainTextFromHtml(item.description)}
                </p>
              )}
              <Link
                href={item.href}
                className="mt-auto inline-flex items-center justify-center rounded-full bg-[#0b293d] px-7 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#F19020]"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
