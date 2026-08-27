import { ServiceHero } from '@/components/ServiceHero'
import { ServicesCardsGrid } from '@/components/shared/ServicesCardsGrid'
import { SharedTestimonials } from '@/components/shared/SharedTestimonials'
import { SharedFAQ } from '@/components/shared/SharedFAQ'
import { getMainModules, getServicesPage, getStrapiMedia } from '@/lib/strapi'
import { getSharedServicesSections } from '@/lib/sharedServicesSections'
import { moduleHref } from '@/lib/serviceHierarchy'

export const metadata = {
  title: 'Services | Ritesh Arora & Associates',
  description: 'Expert CA services including Incorporation, GST, Tax Advisory, and Audits.',
}

export default async function ServicesPage() {
  const [pageData, modules, shared] = await Promise.all([
    getServicesPage(),
    getMainModules(),
    getSharedServicesSections(),
  ])

  const moduleCards = modules.map((mod) => ({
    title: mod.title,
    description:
      mod.intro ||
      mod.description ||
      `Explore ${mod.title} services and compliance support.`,
    href: moduleHref(mod.slug),
  }))

  const fallbackCards = [
    {
      title: 'India Practice',
      description: 'GST, direct tax, MCA compliances, audits, and end-to-end India business support.',
      href: '/services/india-practice',
    },
    {
      title: 'International Practice',
      description: 'Cross-border tax, transfer pricing, global setup, and international advisory.',
      href: '/services/international-practice',
    },
  ]

  const cards = moduleCards.length > 0 ? moduleCards : fallbackCards

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <ServiceHero
        title={pageData?.heroTitle || 'Our Professional CA Services'}
        subtitle={
          pageData?.heroSubtitle ||
          'Expert guidance delivered with accuracy, transparency, and long-term value.'
        }
        backgroundImage={getStrapiMedia(pageData?.heroBackgroundImage?.url)}
        primaryButtonText={pageData?.primaryButtonText || 'Book free consultation'}
        primaryButtonLink={pageData?.primaryButtonLink || '/contact'}
        secondaryButtonText={pageData?.secondaryButtonText || 'Download Brochure'}
        secondaryButtonLink={pageData?.secondaryButtonLink || '/contact'}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Services' }]}
      />

      <ServicesCardsGrid
        title="Our Core Services"
        subtitle="Choose a practice area to explore our full service catalogue."
        items={cards}
      />

      <SharedTestimonials items={shared.testimonials} />
      <SharedFAQ items={shared.faqs} />
    </main>
  )
}
