import Link from 'next/link'
import { getStrapiMedia } from '@/lib/strapi'
import { HIDE_BLOGS } from '@/lib/hideBlogs'

interface RelatedBlogsSectionProps {
  blogs?: any[]
}

export function RelatedBlogsSection({ blogs }: RelatedBlogsSectionProps) {
  if (HIDE_BLOGS) return null
  if (!blogs || blogs.length === 0) return null

  return (
    <section className="py-14 md:py-20 bg-[#f8f9fa] border-t border-slate-100">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <h2 className="text-[28px] md:text-[36px] font-bold text-[#0b293d] mb-10 text-center font-serif">
          Related Blogs
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog: any, idx: number) => {
            const coverUrl = blog.coverImage?.url ? getStrapiMedia(blog.coverImage.url) : blog.image
            return (
              <article
                key={idx}
                className="flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-[200px] w-full overflow-hidden bg-slate-100 shrink-0">
                  {coverUrl && (
                    <img
                      src={coverUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  {blog.category?.name && (
                    <span className="text-[11px] uppercase text-[#F19020] font-bold tracking-wider mb-1.5">
                      {blog.category.name}
                    </span>
                  )}
                  {blog.publishedAt && (
                    <span className="text-[12px] text-slate-400 mb-2">
                      {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}
                    </span>
                  )}

                  <h3 className="text-[#0b293d] font-bold text-[16px] leading-snug mb-3">
                    <Link href={`/blog/${blog.slug || '#'}`} className="hover:text-[#F19020] transition-colors">
                      {blog.title}
                    </Link>
                  </h3>

                  {blog.excerpt && (
                    <p className="text-slate-500 text-[13px] leading-relaxed mb-4 flex-1">
                      {blog.excerpt}
                    </p>
                  )}

                  <Link
                    href={`/blog/${blog.slug || '#'}`}
                    className="inline-flex items-center text-[#F19020] text-[13px] font-semibold hover:underline mt-auto"
                  >
                    Read More <span className="ml-1">&#8594;</span>
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
