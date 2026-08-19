import { getBlogPosts, getStrapiMedia } from '@/lib/strapi'
import { InsightsHero } from '@/components/InsightsHero'
import { NewsletterCTA } from '@/components/NewsletterCTA'
import Link from 'next/link'

export const metadata = {
  title: 'Blog | Ritesh Arora & Associates',
  description: 'Expert advice, real-world case studies, and actionable strategies.'
}

export default async function InsightsPage() {
  const allPosts = await getBlogPosts()

  const defaultImages = [
    '/images/blog/blog_hero_1.jpg',
    '/images/blog/blog_hero_2.jpg',
    '/images/blog/blog_hero_3.jpg',
    '/images/blog/blog_hero_4.jpg',
    '/images/blog/blog_hero_5.jpg'
  ]

  // We can still repeat posts if we want to fill up the grid, or just use what's fetched.
  // Using the fetched posts directly.
  const postsGrid = allPosts
  console.log("postsGrid-->", postsGrid)
  return (
    <main className="bg-white min-h-screen flex flex-col">
      <InsightsHero />

      <section className="py-20 md:py-28 bg-white flex-grow">
        <div className="container-prose">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {postsGrid.map((p, index) => {
              let cardImage = getStrapiMedia(p.coverImage?.url)
              console.log("cardImage--->", cardImage)
              if (!cardImage) {
                cardImage = defaultImages[index % defaultImages.length]
              }

              return (
                <article key={p.slug + '-' + index} className="group flex flex-col h-full bg-white transition-all duration-300">
                  {/* Aspect-ratio fully rounded card image */}
                  <div className="w-full aspect-[4/5] relative overflow-hidden rounded-[24px] mb-6 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <Link href={`/blog/${p.slug}`}>
                      <img
                        src={cardImage}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out cursor-pointer"
                      />
                    </Link>
                  </div>

                  {/* Card Content - aligned directly below image */}
                  <div className="flex-grow flex flex-col">
                    <h3 className="text-xl md:text-[22px] font-bold text-slate-800 tracking-tight leading-snug mb-3 hover:text-[#F19020] transition-colors">
                      <Link href={`/blog/${p.slug}`} className="focus:outline-none">
                        {p.title}
                      </Link>
                    </h3>

                    <div className="flex flex-col gap-1 mb-4">
                      <span className="text-sm font-semibold text-slate-500 tracking-wide">
                        {p.category?.name || 'Uncategorized'}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {p.date ? new Date(p.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : ''}
                      </span>
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed font-light line-clamp-3">
                      {p.excerpt}
                    </p>
                  </div>
                </article>
              )
            })}

            {postsGrid.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                No blog posts found. Check back later!
              </div>
            )}
          </div>
        </div>
      </section>

      <NewsletterCTA />
    </main>
  )
}
