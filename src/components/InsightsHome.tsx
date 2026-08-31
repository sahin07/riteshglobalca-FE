import Link from 'next/link'

export interface InsightItem {
  title: string
  category: string
  date?: string
  excerpt: string
  imageSrc: string
  href: string
}

export interface InsightsHomeProps {
  title?: string
  subTitle?: string
  updates?: InsightItem[]
}

export function InsightsHome({
  title,
  subTitle,
  updates
}: InsightsHomeProps) {

  const items = updates && updates

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-[#f8f9fa]">
      <div className="container-prose max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-brand-dark tracking-wide">{title}</h2>
          <p className='mt-2 text-slate-700 text-[15px]'>{subTitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
          {items?.map((post, idx) => (
            <div key={idx} className="flex flex-col group">
              {/* Image */}
              <Link href={post.href} className="block w-full aspect-[4/5] relative overflow-hidden rounded-[24px] mb-6 shadow-sm">
                <img
                  src={post.imageSrc}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>

              {/* Content */}
              <div className="flex flex-col px-1">
                <Link href={post.href}>
                  <h3 className="text-[22px] font-semibold text-brand-dark mb-4 leading-snug hover:text-brand-orange transition-colors">
                    {post.title}
                  </h3>
                </Link>

                <div className="space-y-4 mt-1">
                  <p className="text-slate-700 text-[15px]">
                    {post.category}
                  </p>
                  {post.date && (
                    <p className="text-slate-500 text-[14.5px]">
                      {post.date}
                    </p>
                  )}
                  <p className="text-slate-500 text-[14.5px] leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
