export interface TestimonialItem {
  quote: string
  author: string
  role?: string
  rating?: number
  authorImage?: string
}

export interface TestimonialsProps {
  items?: TestimonialItem[]
}

export function Testimonials({ items }: TestimonialsProps) {
  const testimonialList = items && items.length > 0 ? items : []

  return (
    <div className="relative overflow-hidden w-full">
      {/* Gradient Masks for smooth fade out at edges - White based */}
      <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

      <div className="flex gap-6 w-max animate-marquee pause-on-hover py-4">
        {[...testimonialList, ...testimonialList, ...testimonialList].map((t, idx) => {
          const initials = t.author ? t.author.split(' ').map(n => n[0]).join('') : 'C'
          const ratingStars = t.rating || 5

          return (
            <div key={`${t.author}-${idx}`} className="w-[300px] md:w-[400px] flex-shrink-0 rounded-xl border border-slate-100 bg-white p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="flex text-brand-orange mb-4">
                {[...Array(ratingStars)].map((_, i) => (
                  <svg key={i} width="18" height="18" viewBox="0 0 24 24">
                    <path d="M12 17.27l5.18 3.04-1.64-5.81L20 10.9l-6-.52L12 5l-2 5.38-6 .52 4.46 3.6-1.64 5.81z" fill="currentColor" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed text-base italic">“{t.quote}”</p>
              <div className="mt-6 flex items-center gap-3">
                {t.authorImage ? (
                  <img src={t.authorImage} alt={t.author} className="w-10 h-10 rounded-full object-cover bg-slate-100 flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs flex-shrink-0">
                    {initials}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-slate-900">{t.author}</div>
                  {t.role && <div className="text-xs text-slate-500">{t.role}</div>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
