import { Metadata } from 'next'
import Link from 'next/link'
import { ServiceHero } from '@/components/ServiceHero'

export const metadata: Metadata = {
  title: 'Insights | Ritesh Arora & Associates',
  description:
    'Expert insights on GST, taxation, compliance, startups, and business advisory from Ritesh Arora & Associates.',
}

const DEMO_INSIGHTS = [
  {
    title: 'GST Registration Essentials for Growing Businesses',
    category: 'GST & Indirect Tax',
    date: 'Aug 12, 2026',
    excerpt:
      'A practical guide to GST eligibility, documentation, and common filing mistakes that delay registration approvals.',
    imageSrc: '/images/blog/gst_registration_form.png',
    href: '/insights',
  },
  {
    title: 'How Startups Can Stay Compliant from Day One',
    category: 'Startup Advisory',
    date: 'Aug 5, 2026',
    excerpt:
      'From DPIIT recognition to ROC filings — the compliance checklist every founder should set up in the first 90 days.',
    imageSrc: '/images/blog/startup_scale.png',
    href: '/insights',
  },
  {
    title: 'Retail Expansion: Tax Planning Before You Scale',
    category: 'Business Advisory',
    date: 'Jul 28, 2026',
    excerpt:
      'Key tax and structuring decisions retail brands should review before opening new locations or entering new states.',
    imageSrc: '/images/blog/retail_success.png',
    href: '/insights',
  },
  {
    title: 'GST Compliance Calendar: Monthly Priorities That Matter',
    category: 'GST & Indirect Tax',
    date: 'Jul 18, 2026',
    excerpt:
      'Return deadlines, ITC reconciliations, and notice-response habits that keep businesses penalty-free through the year.',
    imageSrc: '/images/blog/gst_compliance_banner.png',
    href: '/insights',
  },
  {
    title: 'Understanding Input Tax Credit in Complex Supply Chains',
    category: 'GST Guide',
    date: 'Jul 9, 2026',
    excerpt:
      'How manufacturers and distributors can reduce ITC mismatches and strengthen documentation for audits.',
    imageSrc: '/images/blog/gst_guide.png',
    href: '/insights',
  },
  {
    title: 'MCA Event-Based Filings Every Director Should Track',
    category: 'Corporate Compliance',
    date: 'Jun 30, 2026',
    excerpt:
      'Director changes, capital restructuring, and registered office updates — timelines and forms you cannot miss.',
    imageSrc: '/images/blog/hero_bg.png',
    href: '/insights',
  },
]

export default function InsightsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <ServiceHero
        title="Insights & Success Stories"
        subtitle="Explore expert advice, real-world case studies, and actionable strategies to drive growth and innovation in your business."
        primaryButtonText="Book free consultation"
        primaryButtonLink="/contact"
        secondaryButtonText="Explore Services"
        secondaryButtonLink="/services"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Insights' }]}
      />

      <section className="py-16 md:py-24 bg-[#f8f9fa] flex-grow">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="mb-12 md:mb-16 max-w-2xl">
            <p className="text-[13px] font-semibold tracking-[0.14em] uppercase text-[#F19020] mb-3">
              Knowledge Hub
            </p>
            <h2 className="text-[28px] md:text-[36px] font-bold text-[#0b293d] leading-tight">
              Latest Insights & Updates
            </h2>
            <p className="mt-3 text-[15px] md:text-[16px] text-slate-600 leading-relaxed">
              Practical guidance on taxation, compliance, and business growth — curated for founders, CFOs, and growing enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {DEMO_INSIGHTS.map((post) => (
              <article key={post.title} className="group flex flex-col h-full">
                <Link
                  href={post.href}
                  className="block w-full aspect-[4/5] relative overflow-hidden rounded-[24px] mb-6 shadow-sm"
                >
                  <img
                    src={post.imageSrc}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>

                <div className="flex flex-col px-1 flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[12px] font-semibold uppercase tracking-wide text-[#F19020]">
                      {post.category}
                    </span>
                    <span className="text-[12px] text-slate-400">{post.date}</span>
                  </div>

                  <h3 className="text-[20px] md:text-[22px] font-bold text-[#0b293d] leading-snug mb-3 group-hover:text-[#F19020] transition-colors">
                    <Link href={post.href}>{post.title}</Link>
                  </h3>

                  <p className="text-[14.5px] text-slate-600 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
</main>
  )
}
