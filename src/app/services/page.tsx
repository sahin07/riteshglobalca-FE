import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ServiceHero } from '@/components/ServiceHero'
import { ServiceGrid } from '@/components/ServiceGrid'
import { ServiceTestimonials } from '@/components/ServiceTestimonials'
import { ServiceFAQ } from '@/components/ServiceFAQ'
import { ServiceContact } from '@/components/ServiceContact'
import { FloatingChat } from '@/components/FloatingChat'
import { getServicesPage, getStrapiMedia } from '@/lib/strapi'

export const metadata = {
  title: 'Services | Ritesh Arora & Associates',
  description: 'Expert CA services including Incorporation, GST, Tax Advisory, and Audits.'
}

export default async function ServicesPage() {
  const pageData = await getServicesPage();
  return (
    <>
      <main className="bg-slate-50 min-h-screen flex flex-col">
        <ServiceHero
          title={pageData?.heroTitle}
          subtitle={pageData?.heroSubtitle}
          backgroundImage={getStrapiMedia(pageData?.heroBackgroundImage?.url)}
          primaryButtonText={pageData?.primaryButtonText}
          primaryButtonLink={pageData?.primaryButtonLink}
          secondaryButtonText={pageData?.secondaryButtonText}
          secondaryButtonLink={pageData?.secondaryButtonLink}
        />
        <ServiceGrid services={pageData?.services || []} />
        <ServiceTestimonials testimonials={pageData?.testimonials || []} />
        <ServiceFAQ faqs={pageData?.faqs || []} />
      </main>
    </>
  )
}

