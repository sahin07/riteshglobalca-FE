import { Metadata } from 'next'
import { NewsletterHero } from '@/components/NewsletterHero'
import { SharedTestimonials } from '@/components/shared/SharedTestimonials'
import { fetchNewsletterPageData } from '@/data/strapi'
import { getGoogleReviewsData } from '@/lib/googleReviews'
import { ArticlePdfGrid } from '@/components/articles/ArticlePdfGrid'
import { getArticlesPageContent, getPdfArticles } from '@/lib/articles'

// Dynamically generate SEO Metadata using the CMS SEO fields
export async function generateMetadata(): Promise<Metadata> {
  const cmsData = await fetchNewsletterPageData();
  const seo = cmsData?.seo;

  if (!seo) {
    return {
      title: 'Newsletter | Ritesh Arora & Associates',
      description: 'Subscribe to stay informed about GST changes, tax deadlines, and compliance alerts.'
    };
  }

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonicalURL || undefined
    },
    robots: seo.metaRobots || undefined
  };
}

function NewsletterPdfSection() {
  const { section } = getArticlesPageContent();
  const items = getPdfArticles();
  if (items.length === 0) return null;

  return (
    <section className="bg-white py-16 md:py-24">
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
        <ArticlePdfGrid items={items} leadSource="Newsletter PDF Download" />
      </div>
    </section>
  );
}

export default async function NewsletterPage() {
  const [cmsData, googleReviews] = await Promise.all([fetchNewsletterPageData(), getGoogleReviewsData()]);

  if (!cmsData) {
    return (
      <main className="bg-[#f8f9fa] min-h-screen flex flex-col">
        <NewsletterPdfSection />
        <SharedTestimonials
          badge="Google Reviews"
          logoSrc="/images/google-reviews-logo.png"
          items={googleReviews.items}
          googleSummary={googleReviews.summary}
        />
      </main>
    );
  }

  const heroProps = {
    title: cmsData.heroTitle,
    description: cmsData.heroDescription,
    placeholder: cmsData.emailPlaceholder,
    buttonText: cmsData.subscribeButtonText
  };

  return (
    <main className="bg-[#f8f9fa] min-h-screen flex flex-col">
      <NewsletterHero {...heroProps} />
      <NewsletterPdfSection />
      <SharedTestimonials
        badge="Google Reviews"
        logoSrc="/images/google-reviews-logo.png"
        items={googleReviews.items}
        googleSummary={googleReviews.summary}
      />
    </main>
  );
}
