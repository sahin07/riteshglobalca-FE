'use client'

import Link from 'next/link'

interface SiblingService {
  title: string
  href: string
}

interface ServiceSidebarProps {
  relatedServices: SiblingService[]
}

export function ServiceSidebar({ relatedServices }: ServiceSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Related Services Card */}
      {relatedServices.length > 0 && (
        <div className="bg-[#f8f9fa] rounded-2xl p-6">
          <h3 className="text-[20px] font-bold text-[#0b293d] mb-5">Related Services</h3>
          <div className="space-y-2.5">
            {relatedServices.map((svc, idx) => (
              <Link
                key={idx}
                href={svc.href}
                className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-slate-100 hover:border-[#F19020] hover:shadow-sm transition-all group"
              >
                <span className="text-[14px] text-slate-700 group-hover:text-[#0b293d] font-medium">{svc.title}</span>
                <svg className="w-4 h-4 text-slate-400 group-hover:text-[#F19020] flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Get Started CTA Card */}
      <div className="bg-[#0f2e2a] rounded-2xl p-6 text-white relative overflow-hidden">
        {/* Decorative burst */}
        <div className="absolute top-0 right-0 w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full text-white/10">
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="100"
                y1="0"
                x2={100 - 60 * Math.cos((i * 15 * Math.PI) / 180)}
                y2={60 * Math.sin((i * 15 * Math.PI) / 180)}
                stroke="currentColor"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>

        {/* CTA image */}
        <div className="mb-5">
          <img src="/images/service-details.png" alt="Get Started" className="w-32 h-auto object-contain" />
        </div>

        <h3 className="text-[20px] font-bold mb-1">Get Started Today</h3>
        <p className="text-white/60 text-[14px] mb-5 italic">Let&apos;s Build Something Great Together.</p>

        <ul className="space-y-3 mb-6">
          <li className="flex items-center gap-2.5 text-[13px] text-white/90">
            <span className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </span>
            Average response rate 1 hour
          </li>
          <li className="flex items-center gap-2.5 text-[13px] text-white/90">
            <span className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </span>
            Proven track of results
          </li>
          <li className="flex items-center gap-2.5 text-[13px] text-white/90">
            <span className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </span>
            Dedicated and honest team
          </li>
        </ul>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-400 text-[#0f2e2a] font-bold text-[14px] rounded-full hover:bg-green-300 transition-colors"
        >
          Get Appointment
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </Link>
      </div>
    </aside>
  )
}
