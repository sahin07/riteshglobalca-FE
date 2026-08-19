import { Metadata } from 'next'
import { PricingHero } from '@/components/PricingHero'
import { PricingCards } from '@/components/PricingCards'
import { ServicePricing } from '@/components/ServicePricing'
import { ComparisonTable } from '@/components/ComparisonTable'
import { FAQ } from '@/components/FAQ'
import { ReadyToStart } from '@/components/ReadyToStart'
import { fetchPricingPageData } from '@/data/strapi'

// Dynamically generate SEO Metadata using the CMS SEO fields
export async function generateMetadata(): Promise<Metadata> {
  const cmsData = await fetchPricingPageData();
  const seo = cmsData?.seo;

  if (!seo) {
    return {
      title: 'Pricing | Ritesh Arora & Associates',
      description: 'Transparent pricing for GST, Income Tax, and Compliance services.'
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

export default async function PricingPage() {
  const cmsData = await fetchPricingPageData();

  if (!cmsData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-800">
        <p className="text-lg font-medium">Please set up and publish Pricing content in Strapi.</p>
      </div>
    );
  }

  // Direct mapping of props without any mock copy fallbacks in || condition
  const heroProps = {
    title: cmsData.heroTitle,
    description: cmsData.heroDescription
  };

  const cardsProps = {
    title: cmsData.packagesTitle,
    plans: cmsData.packages ? cmsData.packages.map((pkg: any) => ({
      name: pkg.name,
      price: pkg.price,
      billingPeriod: pkg.billingPeriod,
      badge: pkg.badge,
      ctaText: pkg.ctaText,
      ctaLink: pkg.ctaLink,
      features: pkg.features ? pkg.features.map((f: any) => f.text) : []
    })) : []
  };

  const servicePricingProps = {
    servicesTitle: cmsData.servicesTitle,
    services: cmsData.services ? cmsData.services.map((s: any) => ({
      name: s.name,
      priceInfo: s.priceInfo,
      icon: s.icon
    })) : [],
    addonsTitle: cmsData.addonsTitle,
    addons: cmsData.addons ? cmsData.addons.map((a: any) => ({
      name: a.name,
      description: a.description,
      icon: a.icon
    })) : []
  };

  const comparisonProps = {
    title: cmsData.comparisonTitle,
    features: cmsData.comparisonFeatures ? cmsData.comparisonFeatures.map((f: any) => ({
      featureName: f.featureName,
      basicValue: f.basicValue,
      standardValue: f.standardValue,
      premiumValue: f.premiumValue
    })) : []
  };

  const faqProps = {
    title: cmsData.faqsTitle,
    faqs: cmsData.faqs ? cmsData.faqs.map((f: any) => ({
      question: f.question,
      answer: f.answer
    })) : []
  };

  const readyProps = {
    title: cmsData.ctaTitle,
    subtitle: cmsData.ctaSubtitle,
    buttonText: cmsData.ctaButtonText,
    buttonLink: cmsData.ctaButtonLink
  };

  return (
    <>
      <main className="bg-slate-50 min-h-screen flex flex-col">
        <PricingHero {...heroProps} />
        <PricingCards {...cardsProps} />
        <ServicePricing {...servicePricingProps} />
        <ComparisonTable {...comparisonProps} />
        <FAQ {...faqProps} />
        <ReadyToStart {...readyProps} />
      </main>
    </>
  );
}
