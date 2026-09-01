import { Metadata } from 'next'
import { ArticlePdfGrid } from '@/components/articles/ArticlePdfGrid'
import { ServiceHero } from '@/components/ServiceHero'
import { getArticlesPageContent, getPdfArticles } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Articles | Ritesh Arora & Associates',
  description:
    'GST case law compendiums and publications from Ritesh Arora & Associates — preview and download PDFs.',
}

export default function ArticlesPage() {
  const { hero, section } = getArticlesPageContent()
  const items = getPdfArticles()

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <ServiceHero
        title={hero.title}
        subtitle={hero.subtitle}
        primaryButtonText="Book free consultation"
        primaryButtonLink="/contact"
        secondaryButtonText="Explore Services"
        secondaryButtonLink="/services"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Articles' }]}
      />

      <section className="flex-grow bg-[#f8f9fa] py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <div className="mb-12 max-w-2xl md:mb-16">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F19020]">
              {section.eyebrow}
            </p>
            <h2 className="text-[28px] font-bold leading-tight text-[#0b293d] md:text-[36px]">
              {section.title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-600 md:text-[16px]">
              {section.description}
            </p>
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
              <p className="text-lg font-semibold text-[#0b293d]">No PDF articles yet</p>
              <p className="mt-2 text-sm text-slate-500">
                Add PDF files to <code className="text-[#F19020]">public/pdfs/</code>, then run{' '}
                <code className="text-[#F19020]">python scripts/generate_pdf_previews.py</code>.
              </p>
            </div>
          ) : (
            <ArticlePdfGrid items={items} />
          )}
        </div>
      </section>
    </main>
  )
}
