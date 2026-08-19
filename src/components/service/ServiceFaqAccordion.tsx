'use client'

import { useState } from 'react'
import { SectionHeading } from './SectionHeading'

interface ServiceFaqAccordionProps {
  faqs: any[]
}

export function ServiceFaqAccordion({ faqs }: ServiceFaqAccordionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  if (!faqs || faqs.length === 0) return null

  return (
    <div className="mb-12">
      <SectionHeading title="Frequently Asked Questions" />
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx
          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all duration-200 ${isOpen ? 'border-[#0b293d] shadow-sm' : 'border-slate-200'}`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-5 py-4 text-left flex justify-between items-center gap-4"
              >
                <span className="text-[#0b293d] font-semibold text-[14px]">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                <div className="px-5 pb-4 text-slate-600 text-[13px] leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
