'use client'

import { useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

export type SharedFaqItem = {
  question: string
  answer: string
}

interface SharedFAQProps {
  eyebrow?: string
  title?: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  items?: SharedFaqItem[]
}

export function SharedFAQ({
  eyebrow = 'ANSWER QUESTION',
  title = 'Our general frequently asked questions',
  description = 'Find quick answers to common questions about our services, timelines, and engagement process.',
  ctaLabel = 'VIEW ALL QUESTIONS',
  ctaHref = '/faq',
  items,
}: SharedFAQProps) {
  const faqs = items || []
  const [openIdx, setOpenIdx] = useState(0)

  if (faqs.length === 0) return null

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-4 md:grid-cols-2 md:gap-14 lg:items-start lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-[#F19020]" />
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#F19020]">{eyebrow}</span>
          </div>
          <h2 className="mb-4 text-[28px] font-bold leading-tight text-[#0b293d] md:text-[34px]">{title}</h2>
          <p className="mb-8 max-w-md text-[15px] leading-relaxed text-slate-600">{description}</p>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-full bg-[#F19020] px-6 py-3 text-[12px] font-bold uppercase tracking-wider text-white transition hover:bg-[#d87f1c]"
          >
            {ctaLabel}
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const open = openIdx === idx
            return (
              <div key={idx} className="overflow-hidden rounded-2xl">
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? -1 : idx)}
                  className={clsx(
                    'flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors',
                    open ? 'rounded-t-2xl bg-[#F19020] text-white' : 'rounded-2xl bg-[#0b293d] text-white'
                  )}
                >
                  <span className="text-[15px] font-semibold md:text-[16px]">{faq.question}</span>
                  <svg
                    className={clsx('h-5 w-5 shrink-0 transition-transform', open && 'rotate-180')}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={clsx(
                    'overflow-hidden bg-[#f8f9fa] transition-all duration-300',
                    open ? 'max-h-64 rounded-b-2xl opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <p className="px-5 py-4 text-[14px] leading-relaxed text-slate-600">{faq.answer}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
