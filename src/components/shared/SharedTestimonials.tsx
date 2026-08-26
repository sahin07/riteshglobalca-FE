'use client'

import { useMemo, useState } from 'react'

export type SharedTestimonialItem = {
  quote: string
  author: string
  role?: string
  rating?: number
  avatarUrl?: string | null
}

interface SharedTestimonialsProps {
  badge?: string
  title?: string
  subtitle?: string
  items?: SharedTestimonialItem[]
}

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5 text-[#F19020]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`h-4 w-4 ${i < count ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 17.27l5.18 3.04-1.64-5.81L20 10.9l-6-.52L12 5l-2 5.38-6 .52 4.46 3.6-1.64 5.81z" />
        </svg>
      ))}
    </div>
  )
}

function Avatar({ name, url }: { name: string; url?: string | null }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (url) {
    return <img src={url} alt={name} className="h-16 w-16 rounded-full object-cover ring-4 ring-white shadow-md" />
  }

  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0b293d] text-sm font-bold text-white ring-4 ring-white shadow-md">
      {initials}
    </div>
  )
}

export function SharedTestimonials({
  badge = 'TESTIMONIAL',
  title = 'Trusted by Founders and Growing Businesses',
  subtitle,
  items,
}: SharedTestimonialsProps) {
  const list = items || []
  const [start, setStart] = useState(0)
  const visibleCount = 3

  const visible = useMemo(() => {
    if (list.length === 0) return []
    if (list.length <= visibleCount) return list
    return Array.from({ length: visibleCount }).map((_, i) => list[(start + i) % list.length])
  }, [list, start])

  const prev = () => setStart((s) => (s - 1 + list.length) % list.length)
  const next = () => setStart((s) => (s + 1) % list.length)

  if (list.length === 0) return null

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex rounded-md bg-[#0b293d] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            {badge}
          </span>
          <h2 className="mx-auto max-w-3xl text-[28px] font-bold leading-tight text-[#0b293d] md:text-[36px]">
            {title}
          </h2>
          {subtitle && <p className="mx-auto mt-3 max-w-2xl text-[15px] text-slate-600">{subtitle}</p>}
        </div>

        <div className="relative">
          {list.length > visibleCount && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonials"
                className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-slate-200 bg-[#f8f9fa] text-[#0b293d] transition hover:bg-[#0b293d] hover:text-white lg:flex"
              >
                ←
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next testimonials"
                className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-slate-200 bg-[#f8f9fa] text-[#0b293d] transition hover:bg-[#0b293d] hover:text-white lg:flex"
              >
                →
              </button>
            </>
          )}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((item, idx) => (
              <article
                key={`${item.author}-${idx}`}
                className="relative mt-8 flex flex-col rounded-2xl border border-slate-100 bg-white px-6 pb-6 pt-12 shadow-sm"
              >
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                  <Avatar name={item.author} url={item.avatarUrl} />
                </div>
                <p className="mb-6 flex-1 text-[14px] leading-relaxed text-slate-600">{item.quote}</p>
                <div className="flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
                  <div>
                    <div className="text-[15px] font-bold text-[#0b293d]">{item.author}</div>
                    {item.role && <div className="text-[13px] text-slate-500">{item.role}</div>}
                  </div>
                  <Stars count={item.rating || 5} />
                </div>
                <div className="absolute inset-x-8 bottom-0 h-[3px] rounded-full bg-[#0b293d]/80" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
