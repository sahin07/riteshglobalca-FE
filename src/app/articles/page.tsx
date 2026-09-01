import { Metadata } from 'next'
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
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {items.map((article) => (
                <article
                  key={article.id}
                  className="flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
                    <img
                      src={article.previewSrc}
                      alt={`${article.title} preview`}
                      className="h-full w-full object-cover object-top"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
                  </div>

                  <div className="flex flex-grow flex-col p-5 md:p-6">
                    <h3 className="mb-5 flex-grow text-[18px] font-bold leading-snug text-[#0b293d] md:text-[20px]">
                      {article.title}
                    </h3>

                    <a
                      href={article.pdfUrl}
                      download={article.fileName}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b293d] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#F19020]"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M12 3v12m0 0l4-4m-4 4l-4-4M5 21h14"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Download PDF
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
