import { Metadata } from 'next'
import { ContactHero } from '@/components/ContactHero'
import { ContactContent } from '@/components/ContactContent'
import { fetchContactPageData } from '@/data/strapi'

// Dynamically generate SEO Metadata using the CMS SEO fields
export async function generateMetadata(): Promise<Metadata> {
  const cmsData = await fetchContactPageData();
  const seo = cmsData?.seo;

  if (!seo) {
    return {
      title: 'Contact Us | Ritesh Arora & Associates',
      description: 'Get in touch for enquiries, service requests, or to book a consultation.'
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

export default async function ContactPage() {
  const cmsData = await fetchContactPageData();

  if (!cmsData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-800">
        <p className="text-lg font-medium">Please set up and publish Contact page content in Strapi.</p>
      </div>
    );
  }

  const heroProps = {
    title: cmsData.bannerTitle,
    description: cmsData.bannerSubtitle
  };

  const contentProps = {
    officeAddressTitle: cmsData.officeAddressTitle,
    officeAddress: cmsData.officeAddress,
    contactDetailsTitle: cmsData.contactDetailsTitle,
    email: cmsData.email,
    phone: cmsData.phone,
    officeHoursTitle: cmsData.officeHoursTitle,
    officeHours: cmsData.officeHours,
    formTitle: cmsData.formTitle,
    formDescription: cmsData.formDescription
  };

  return (
    <>
      <main className="bg-slate-50 min-h-screen flex flex-col">
        <ContactHero {...heroProps} />
        <ContactContent {...contentProps} />
      </main>
    </>
  );
}
