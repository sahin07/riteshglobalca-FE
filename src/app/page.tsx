import { Metadata } from 'next'
import { Hero } from '@/components/Hero'
import { Section } from '@/components/Section'
import { ServiceCardsSlider } from '@/components/ServiceCardsSlider'
import { Stats } from '@/components/Stats'
import { Testimonials } from '@/components/Testimonials'
import { PhotoGallery } from '@/components/PhotoGallery'
import { AboutHome } from '@/components/AboutHome'
import { InsightsHome } from '@/components/InsightsHome'
import { ServiceContact } from '@/components/ServiceContact'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { fetchHomepageData, getStrapiUrl, fetchContactPageData } from '@/data/strapi'
import { resolveContactDetails } from '@/lib/contactDetails'
import { HIDE_BLOGS } from '@/lib/hideBlogs'

// Homepage SEO (source of truth for /)
const HOME_SEO = {
  title: 'Chartered Accountancy Firm in India | Ritesh Arora & Associates',
  description:
    'Ritesh Arora & Associates is a multidisciplinary Chartered Accountancy firm delivering comprehensive audit, taxation, GST, company incorporation, and business advisory services.',
  keywords: [
    'Chartered Accountant in India',
    'CA firm India',
    'GST registration and filing',
    'income tax advisory',
    'company incorporation',
    'audit and assurance',
    'corporate advisory services',
  ],
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      absolute: HOME_SEO.title,
    },
    description: HOME_SEO.description,
    keywords: HOME_SEO.keywords,
    alternates: {
      canonical: 'https://riteshglobalca.com',
    },
    openGraph: {
      title: HOME_SEO.title,
      description: HOME_SEO.description,
      url: 'https://riteshglobalca.com',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: HOME_SEO.title,
      description: HOME_SEO.description,
    },
  }
}

export default async function Page() {
  const cmsData = await fetchHomepageData();
  const contactCmsData = await fetchContactPageData();
  const contactDetails = resolveContactDetails(contactCmsData);

  // 1. Map Hero component properties
  const heroProps = {
    title: 'Built for Growth. Backed by Integrity.',
    description:
      'Your trusted multidisciplinary partner for audit, taxation, and corporate advisory. We provide Comprehensive CA services, from compliance to strategic advisory, tailored for businesses and professionals.',
    primaryButtonText: cmsData?.heroPrimaryButtonText,
    primaryButtonLink: cmsData?.heroPrimaryButtonLink,
    secondaryButtonText: cmsData?.heroSecondaryButtonText,
    secondaryButtonLink: cmsData?.heroSecondaryButtonLink,
    backgroundImage: '/images/home-hero.jpg',
  };

  // 2. Map Services section and items
  const servicesTitle = cmsData?.servicesTitle;
  const servicesSubtitle = cmsData?.servicesSubtitle;

  const servicesData = cmsData?.services && cmsData.services.length > 0
    && cmsData.services.map((s: any) => ({
      title: s.title,
      description: s.description,
      href: s.linkUrl,
      image: s.image && getStrapiUrl(s.image.url)
    }))

  // 3. Map Stats counter data
  const statsData = cmsData?.stats && cmsData.stats.length > 0
    ? cmsData.stats.map((s: any) => ({
      label: s.label,
      number: s.number
    }))
    : undefined;

  // 4. Map Photo Gallery images from Strapi if available
  const trustedByTitle = cmsData?.trustedByTitle || 'Our Work. Our Presence. Our Journey.';
  const trustedBySubtitle =
    cmsData?.trustedBySubtitle ||
    'A glimpse into our professional engagements, knowledge initiatives, client interactions and milestones.';
  const galleryImagesData = cmsData?.trustedByLogos && cmsData.trustedByLogos.length > 0
    ? cmsData.trustedByLogos.map((l: any) => ({
      caption: l.alternativeText || l.name || undefined,
      url: getStrapiUrl(l.url)
    }))
    : undefined;

  // 5. Map About Section details
  const aboutProps = cmsData ? {
    sectionTitle: cmsData.aboutSectionTitle,
    leftTitle: cmsData.aboutLeftTitle,
    leftDescription: cmsData.aboutLeftDescription,
    leftButtonText: cmsData.aboutLeftButtonText,
    leftButtonLink: cmsData.aboutLeftButtonLink,
    rightTitle: cmsData.aboutRightTitle,
    rightPoints: cmsData.aboutRightPoints
  } : undefined;

  // 6. Map Latest Insights & Updates
  const insightsTitle = cmsData?.insightsTitle;
  const insightsSubtitle = cmsData?.insightsSubtitle;

  const insightsData = cmsData?.insights && cmsData.insights.length > 0
    && cmsData.insights.map((ins: any) => ({
      title: ins.title,
      category: ins.categoryOrDate,
      excerpt: ins.description,
      imageSrc: ins.image && getStrapiUrl(ins.image.url),
      href: ins.linkUrl
    }))

  // 7. Map Client Testimonials
  const testimonialsData = cmsData?.testimonials && cmsData.testimonials.length > 0
    && cmsData.testimonials.map((t: any) => ({
      quote: t.text,
      author: t.authorName,
      role: t.authorRole,
      rating: t.rating,
      authorImage: t.authorImage ? getStrapiUrl(t.authorImage.url) : undefined
    }))

  // 8. Map Contact section title
  const contactTitle = cmsData?.contactTitle;

  return (
    <>
      <main className="bg-white">
        <Hero {...heroProps} />

        {/* Core Services Section */}
        <Section
          title={servicesTitle}
          subtitle={servicesSubtitle}
          className="bg-white py-12 sm:py-16 md:py-20"
        >
          <ServiceCardsSlider services={servicesData || []} />
          <div className="mt-12 flex justify-center">
            <Link href="/services">
              <Button variant="primary" className="bg-brand-orange hover:bg-orange-600 text-white font-bold px-10 h-12 shadow-md">
                View All Services
              </Button>
            </Link>
          </div>
        </Section>

        {/* Stats Strip - Full Width */}
        <Stats stats={statsData} />

        {/* Photo Gallery Section */}
        <PhotoGallery
          images={galleryImagesData}
          title={trustedByTitle}
          subtitle={trustedBySubtitle}
        />

        {/* About Section - Dark Blue */}
        <AboutHome {...aboutProps} />

        {/* Insights Section */}
        {!HIDE_BLOGS && (
          <InsightsHome title={insightsTitle} subTitle={insightsSubtitle} updates={insightsData} />
        )}

        {/* Testimonials Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-slate-50">
          <div className="container-prose text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-dark">
              {cmsData?.testimonialsTitle || "Client Testimonials"}
            </h2>
            <p className="text-slate-600 mt-3">
              {cmsData?.testimonialsSubtitle || "See what our partners have to say about our work."}
            </p>
          </div>
          <Testimonials items={testimonialsData} />
        </section>

        {/* Contact Form Section - Deep Blue */}
        <ServiceContact 
          title={contactTitle}
          officeAddressTitle={contactDetails.officeAddressTitle}
          officeAddress={contactDetails.officeAddress}
          contactDetailsTitle={contactDetails.contactDetailsTitle}
          email={contactDetails.email}
          phone={contactDetails.phone}
          officeHoursTitle={contactDetails.officeHoursTitle}
          officeHours={contactDetails.officeHours}
        />

      </main>
    </>
  );
}
