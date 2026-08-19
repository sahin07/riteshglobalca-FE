'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { NewsletterCTA } from '@/components/NewsletterCTA'
import { cleanMarkdown } from '@/lib/markdown'
import { getBlogPostBySlug, getBlogPosts, getStrapiMedia } from '@/lib/strapi'

export default function BlogPostDetailPage({ params }: { params: any }) {
  const [commentsList, setCommentsList] = useState<any[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [commentText, setCommentText] = useState('')
  const [post, setPost] = useState<any>(null)

  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])

  useEffect(() => {
    if (params.slug) {
      getBlogPostBySlug(params.slug).then(data => {
        setPost(data)
        if (data) {
          setCommentsList(data.comments || [])
        }
        setLoading(false)
      })
      getBlogPosts().then(posts => {
        setRelatedPosts(posts.filter(p => p.slug !== params.slug).slice(0, 2))
      })
    }
  }, [params.slug])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white text-slate-800">Loading...</div>
  }

  if (!params.slug || !post) {
    return (
      <div className="min-h-screen bg-white text-slate-800 flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold text-[#003B49] mb-4">Post Not Found</h1>
        <p className="text-slate-500 mb-6">The article you are looking for does not exist or has been moved.</p>
        <Link href="/blog" className="px-6 py-2.5 bg-[#F19020] text-white font-semibold rounded-[8px] hover:bg-[#D87F1C] transition-colors shadow-sm">
          Back to Blog
        </Link>
      </div>
    )
  }

  // Color mappings for tag pills
  const tagColors: Record<string, string> = {
    'GST': 'bg-[#FFF3E6] text-[#F19020]',
    'Income tax': 'bg-indigo-50 text-indigo-600',
    'Filing': 'bg-blue-50 text-blue-600',
    'Compliance': 'bg-purple-50 text-purple-600',
    'Small Business': 'bg-emerald-50 text-emerald-600'
  }

  // Form submit handler for comments
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !commentText.trim()) return

    const newComment = {
      id: Date.now(),
      author: name,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      content: commentText
    }

    setCommentsList([newComment, ...commentsList])
    setName('')
    setEmail('')
    setCommentText('')
  }

  const heroImage = getStrapiMedia(post.coverImage?.url) || undefined

  // Extract table of contents directly from the markdown content string headings (## Heading)
  const headingMatches = post?.content?.match(/^##\s+(.*)$/gm) || []
  const tableOfContents = headingMatches.map((heading: string) => {
    const text = heading.replace(/^##\s+/, '')
    return {
      id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label: text,
      level: 2
    }
  })

  // Create tags array
  const tagsList = post.tags?.map((t: any) => t.name) || []

  return (
    <div className="bg-white min-h-screen text-slate-800">
      {/* 1. Large Top Hero Banner */}
      <section className="relative w-full h-[320px] sm:h-[400px] md:h-[480px] lg:h-[540px] overflow-hidden">
        <img
          src={heroImage}
          alt={post.title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 pb-8 md:pb-12 z-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-white tracking-tight leading-tight max-w-4xl font-sans">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* 2. Main Article Body Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Left Content Column */}
            <article className="col-span-1 lg:col-span-8 flex flex-col">
              <div className="prose max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    p: ({ children }) => (
                      <p className="text-slate-600 text-[16px] leading-relaxed mb-6 font-light">
                        {children}
                      </p>
                    ),
                    h2: ({ children }) => {
                      const headingId = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') || ''
                      return (
                        <h2 id={headingId} className="text-xl md:text-2xl font-bold text-[#003B49] tracking-tight mt-10 mb-4 font-sans scroll-mt-24">
                          {children}
                        </h2>
                      )
                    },
                    h3: ({ children }) => {
                      const headingId = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') || ''
                      return (
                        <h3 id={headingId} className="text-lg md:text-xl font-bold text-[#003B49] tracking-tight mt-8 mb-3 font-sans scroll-mt-24">
                          {children}
                        </h3>
                      )
                    },
                    ul: ({ children }) => (
                      <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6 font-light text-[15px]">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-6 text-slate-600 space-y-2 mb-6 font-light text-[15px]">
                        {children}
                      </ol>
                    ),
                    blockquote: ({ children }) => (
                      <div className="flex gap-4 p-5 my-6 rounded-[8px] border-l-[4px] bg-slate-50 text-[15px] leading-relaxed border-[#003B49] text-slate-700">
                        <div className="flex-shrink-0 mt-0.5">
                          <svg className="w-5 h-5 text-[#003B49]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="font-light">{children}</div>
                      </div>
                    )
                  }}
                >
                  {cleanMarkdown(post.content)}
                </ReactMarkdown>
              </div>

              {/* Tags block */}
              {tagsList.length > 0 && (
                <div className="flex flex-wrap items-center gap-2.5 mt-10 pt-8 border-t border-slate-100">
                  <span className="text-[14px] font-semibold text-slate-500 mr-2">Tags:</span>
                  {tagsList.map((tag: string) => (
                    <span
                      key={tag}
                      className={`px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${tagColors[tag] || 'bg-slate-100 text-slate-600'
                        }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share block */}
              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-100">
                <span className="text-[14px] font-semibold text-slate-500">Share:</span>
                <div className="flex items-center gap-3">
                  <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center bg-[#25D366]/10 text-[#25D366] hover:scale-105 transition-transform" aria-label="Share on WhatsApp">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.852.002-2.63-1.023-5.101-2.887-6.967a9.8 9.8 0 00-6.977-2.87c-5.439 0-9.865 4.42-9.87 9.853-.002 1.758.463 3.473 1.346 5.006l-.994 3.633 3.693-.969zm11.722-6.843c-.303-.152-1.794-.885-2.072-.986-.279-.101-.482-.152-.684.152-.202.303-.781.986-.957 1.189-.176.202-.353.228-.656.076-1.24-.622-2.128-1.087-2.986-2.55-.23-.396.23-.367.659-1.22.076-.152.038-.285-.019-.387-.057-.102-.482-1.16-.66-1.597-.173-.418-.348-.362-.482-.369h-.411c-.152 0-.399.057-.608.285-.21.228-.798.78-.798 1.902 0 1.121.817 2.204.931 2.356.114.152 1.61 2.458 3.901 3.447.545.235 1.023.393 1.374.502.548.174 1.047.15 1.44.09.438-.067 1.794-.734 2.047-1.443.254-.71.254-1.317.177-1.443-.077-.126-.279-.228-.582-.38z" />
                    </svg>
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center bg-[#0077B5]/10 text-[#0077B5] hover:scale-105 transition-transform" aria-label="Share on LinkedIn">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1DA1F2]/10 text-[#1DA1F2] hover:scale-105 transition-transform" aria-label="Share on Twitter">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1877F2]/10 text-[#1877F2] hover:scale-105 transition-transform" aria-label="Share on Facebook">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Comments Section */}
              <section className="mt-14 pt-10 border-t border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Comments</h3>
                <p className="text-[13px] text-slate-400 font-medium mb-8">
                  {commentsList.length} Comments
                </p>

                {/* Leave Comment Form */}
                <div className="bg-slate-50 rounded-[16px] p-6 md:p-8 mb-10">
                  <h4 className="text-[16px] font-semibold text-slate-800 mb-6">Leave a comment</h4>
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Name *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full h-11 px-4 rounded-[8px] border border-slate-200 bg-white text-slate-800 text-[14px] focus:outline-none focus:border-[#F19020] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Email *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-11 px-4 rounded-[8px] border border-slate-200 bg-white text-slate-800 text-[14px] focus:outline-none focus:border-[#F19020] transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Comment *</label>
                      <textarea
                        required
                        rows={5}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full p-4 rounded-[8px] border border-slate-200 bg-white text-slate-800 text-[14px] focus:outline-none focus:border-[#F19020] transition-colors resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 h-[42px] bg-[#F19020] hover:bg-[#D87F1C] text-white font-semibold rounded-[8px] text-[14px] shadow-sm transition-colors focus:outline-none"
                    >
                      Leave Comment
                    </button>
                  </form>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {commentsList.map((comment: any) => {
                    const initials = comment.author?.split(' ').map((n: string) => n[0]).join('') || ''
                    return (
                      <div key={comment.id} className="flex gap-4 p-5 rounded-[12px] bg-white border border-slate-100 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-[#003B49]/10 text-[#003B49] flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {initials}
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                            <span className="font-semibold text-slate-800 text-[15px]">{comment.author}</span>
                            <span className="text-xs text-slate-400 font-medium">{comment.date}</span>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed font-light">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            </article>

            {/* Right Sticky Sidebar Column */}
            <aside className="col-span-1 lg:col-span-4">
              <div className="sticky top-32 border border-slate-200/80 rounded-[16px] p-6 bg-white shadow-sm">
                <h4 className="text-[17px] font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 font-sans">
                  On this page
                </h4>
                <nav className="space-y-3">
                  {tableOfContents.map((item: any) => (
                    <div key={item.id} className="space-y-2">
                      <a
                        href={`#${item.id}`}
                        className="block text-[14px] font-medium text-slate-600 hover:text-[#F19020] transition-colors"
                      >
                        {item.label}
                      </a>
                    </div>
                  ))}
                </nav>
              </div>
            </aside>

          </div>
        </div>
      </section>

      {/* 3. Related Articles Section */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-[#f8f9fa] border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-sans">
                Related Articles
              </h2>
              <Link href="/blog" className="text-sm font-semibold text-[#F19020] hover:text-[#D87F1C] transition-colors flex items-center gap-1">
                View All <span className="text-[16px]">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              {relatedPosts.map((r, i) => {
                const rImage = getStrapiMedia(r.coverImage?.url) || '/images/blog/blog_hero_1.jpg'
                return (
                  <article key={r.slug + '-' + i} className="group flex flex-col h-full bg-white rounded-[24px] overflow-hidden border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="w-full aspect-[16/10] relative overflow-hidden">
                      <img
                        src={rImage}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <span className="text-xs font-semibold text-[#F19020] uppercase tracking-wide mb-2 block">
                        {r.category?.name || 'Uncategorized'}
                      </span>
                      <h3 className="text-lg font-bold text-slate-800 leading-snug mb-3 group-hover:text-[#F19020] transition-colors line-clamp-2">
                        <Link href={`/blog/${r.slug}`}>
                          {r.title}
                        </Link>
                      </h3>
                      <span className="text-[11px] text-slate-400 font-medium mb-3 block">
                        {r.date ? new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      </span>
                      <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-3 font-light">
                        {r.excerpt}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. Newsletter Signup Component */}
      <NewsletterCTA />
    </div>
  )
}