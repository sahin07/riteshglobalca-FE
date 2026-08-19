import { Metadata } from 'next'
import { NewsletterHero } from '@/components/NewsletterHero'
import { NewsletterFeatures } from '@/components/NewsletterFeatures'
import { fetchNewsletterPageData } from '@/data/strapi'

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

export default async function NewsletterPage() {
  const cmsData = await fetchNewsletterPageData();

  if (!cmsData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-800">
        <p className="text-lg font-medium">Please set up and publish Newsletter content in Strapi.</p>
      </div>
    );
  }

  const heroProps = {
    title: cmsData.heroTitle,
    description: cmsData.heroDescription,
    placeholder: cmsData.emailPlaceholder,
    buttonText: cmsData.subscribeButtonText
  };

  const featuresProps = {
    featuresTitle: cmsData.featuresTitle,
    featuresDescription: cmsData.featuresDescription,
    features: cmsData.features ? cmsData.features.map((f: any) => ({
      icon: f.icon,
      title: f.title,
      description: f.description,
      linkText: f.linkText || undefined,
      linkUrl: f.linkUrl || undefined
    })) : [],
    privacyDisclaimer: cmsData.privacyDisclaimer
  };

  return (
    <main className="bg-[#f8f9fa] min-h-screen flex flex-col">
      <NewsletterHero {...heroProps} />
      <NewsletterFeatures {...featuresProps} />
    </main>
  );
}
