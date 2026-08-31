import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { TaxonomyLanding } from '@/components/service/TaxonomyLanding'
import { ServiceHeroSection } from '@/components/service/ServiceHeroSection'
import { ServiceOverviewSection } from '@/components/service/ServiceOverviewSection'
import { TableSection } from '@/components/service/TableSection'
import { FeatureGridSection } from '@/components/service/FeatureGridSection'
import { TabbedTableSection } from '@/components/service/TabbedTableSection'
import { ProcessSection } from '@/components/service/ProcessSection'
import { ContactCtaSection } from '@/components/service/ContactCtaSection'
import { RelatedBlogsSection } from '@/components/service/RelatedBlogsSection'
import { RichTextSection } from '@/components/service/RichTextSection'
import { TabbedRichTextSection } from '@/components/service/TabbedRichTextSection'
import { ServiceSidebar } from '@/components/service/ServiceSidebar'
import { SharedFAQ, SharedFaqItem } from '@/components/shared/SharedFAQ'
import {
  getMainModules,
  getServiceBySlug,
  getServiceCategories,
  getServiceSubcategories,
  getServices,
  getStrapiMedia,
  StrapiService,
} from '@/lib/strapi'
import { getSharedServicesSections } from '@/lib/sharedServicesSections'
import {
  categoryHref,
  categoriesForModule,
  findCategory,
  findModule,
  findServiceAncestors,
  findSubcategory,
  moduleHref,
  serviceHref,
  servicesForSubcategory,
  subcategoryHref,
  subcategoriesForCategory,
} from '@/lib/serviceHierarchy'

interface PageProps {
  params: { slug: string[] }
}

async function loadTree() {
  const [modules, categories, subcategories, services] = await Promise.all([
    getMainModules(),
    getServiceCategories(),
    getServiceSubcategories(),
    getServices(),
  ])
  return { modules, categories, subcategories, services }
}

async function resolvePath(segments: string[]) {
  const tree = await loadTree()
  const [a, b, c, d] = segments

  if (segments.length === 1) {
    const service = await getServiceBySlug(a)
    if (service) return { kind: 'service' as const, service, tree }
    const mainModule = findModule(tree.modules, a)
    if (mainModule) return { kind: 'module' as const, module: mainModule, tree }
    return null
  }

  if (segments.length === 2) {
    const mainModule = findModule(tree.modules, a)
    if (!mainModule) return null
    const category = findCategory(tree.categories, b, mainModule.id)
    if (!category) return null
    return { kind: 'category' as const, module: mainModule, category, tree }
  }

  if (segments.length === 3) {
    const mainModule = findModule(tree.modules, a)
    if (!mainModule) return null
    const category = findCategory(tree.categories, b, mainModule.id)
    if (!category) return null
    const subcategory = findSubcategory(tree.subcategories, c, category.id)
    if (!subcategory) return null
    return { kind: 'subcategory' as const, module: mainModule, category, subcategory, tree }
  }

  if (segments.length === 4) {
    const service = await getServiceBySlug(d)
    if (!service) return null
    return { kind: 'service' as const, service, tree }
  }

  return null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await resolvePath(params.slug)
  if (!resolved) {
    return { title: 'Service Not Found | Ritesh Arora & Associates' }
  }
  if (resolved.kind === 'service') {
    const seo = resolved.service.seo || {}
    return {
      title: seo.metaTitle || resolved.service.title,
      description: seo.metaDescription || resolved.service.heroSubtitle,
    }
  }
  if (resolved.kind === 'module') {
    return {
      title: resolved.module.title,
      description: resolved.module.intro || `Explore ${resolved.module.title} services.`,
    }
  }
  if (resolved.kind === 'category') {
    return {
      title: resolved.category.title,
      description: resolved.category.intro || `Explore ${resolved.category.title}.`,
    }
  }
  return {
    title: resolved.subcategory.title,
    description: resolved.subcategory.intro || `Explore ${resolved.subcategory.title}.`,
  }
}

function ServiceDetail({
  service,
  crumbs,
  siblingServices = [],
  sharedFaqs = [],
}: {
  service: StrapiService
  crumbs?: { label: string; href?: string }[]
  siblingServices?: { title: string; href: string }[]
  sharedFaqs?: SharedFaqItem[]
}) {
  const blocks = service.contentBlocks || []
  const serviceFaqs: SharedFaqItem[] = (service.faqs || [])
    .map((f: any) => ({
      question: f.question || '',
      answer: f.answer || '',
    }))
    .filter((f: SharedFaqItem) => f.question && f.answer)
  const faqItems = serviceFaqs.length > 0 ? serviceFaqs : sharedFaqs

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <ServiceHeroSection service={service} crumbs={crumbs} />

      {/* 2-column layout: content + sidebar */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 xl:gap-14">

          {/* Main content */}
          <div className="min-w-0">
            {/* Service banner image */}
            <div className="rounded-2xl overflow-hidden mb-10">
              {service.image?.url ? (
                <img
                  src={getStrapiMedia(service.image.url) || service.image.url}
                  alt={service.title}
                  className="w-full h-[300px] md:h-[380px] object-cover rounded-2xl"
                />
              ) : (
                <div className="w-full h-[300px] md:h-[380px] bg-slate-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <ServiceOverviewSection service={service} />
            {(() => {
              const lastFeatureIdx = blocks.reduce(
                (acc: number, b: any, i: number) => (b.__component === 'service.feature-grid' ? i : acc),
                -1
              )
              const lastRichTextIdx = blocks.reduce(
                (acc: number, b: any, i: number) => (b.__component === 'service.rich-text-section' ? i : acc),
                -1
              )
              return blocks.map((block: any, idx: number) => {
              const componentType = block.__component
              const featureGridCount = blocks.slice(0, idx).filter((b: any) => b.__component === 'service.feature-grid').length
              const isClosingRichText =
                componentType === 'service.rich-text-section' &&
                (lastFeatureIdx === -1 ? idx === lastRichTextIdx : idx > lastFeatureIdx)
              switch (componentType) {
                case 'service.table-section':
                  return <TableSection key={idx} block={block} />
                case 'service.feature-grid':
                  return <FeatureGridSection key={idx} block={block} gridIndex={featureGridCount} />
                case 'service.tabbed-table-section':
                  return <TabbedTableSection key={idx} block={block} />
                case 'service.process-section':
                  return <ProcessSection key={idx} block={block} />
                case 'service.contact-cta':
                  return null
                case 'service.rich-text-section':
                  return <RichTextSection key={idx} block={block} variant={isClosingRichText ? 'closing' : 'default'} />
                case 'service.tabbed-rich-text':
                  return <TabbedRichTextSection key={idx} block={block} />
                default:
                  return null
              }
            })
            })()}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <ServiceSidebar relatedServices={siblingServices} />
            </div>
          </div>

        </div>
      </div>

      <SharedFAQ items={faqItems} />
      <RelatedBlogsSection blogs={service.relatedBlogs} />
    </main>
  )
}

export default async function ServiceHierarchyPage({ params }: PageProps) {
  const [resolved, shared] = await Promise.all([
    resolvePath(params.slug),
    getSharedServicesSections(),
  ])
  if (!resolved) notFound()

  if (resolved.kind === 'service') {
    const ancestors = findServiceAncestors(resolved.service, resolved.tree)
    if (params.slug.length === 1 && ancestors) {
      redirect(serviceHref(resolved.service.slug, {
        moduleSlug: ancestors.module.slug,
        categorySlug: ancestors.category.slug,
        subcategorySlug: ancestors.subcategory.slug,
      }))
    }
    const crumbs = ancestors
      ? [
          { label: 'Services', href: '/services' },
          { label: ancestors.module.title, href: moduleHref(ancestors.module.slug) },
          { label: ancestors.category.title, href: categoryHref(ancestors.module.slug, ancestors.category.slug) },
          { label: ancestors.subcategory.title, href: subcategoryHref(ancestors.module.slug, ancestors.category.slug, ancestors.subcategory.slug) },
          { label: resolved.service.title },
        ]
      : [{ label: 'Services', href: '/services' }, { label: resolved.service.title }]
    const siblingServices = ancestors
      ? servicesForSubcategory(
          resolved.tree.services,
          ancestors.subcategory.id,
          ancestors.subcategory.slug
        )
          .filter((s) => s.id !== resolved.service.id)
          .slice(0, 8)
          .map((s) => ({
            title: s.title,
            href: serviceHref(s.slug, {
              moduleSlug: ancestors.module.slug,
              categorySlug: ancestors.category.slug,
              subcategorySlug: ancestors.subcategory.slug,
            }),
          }))
      : []
    return (
      <ServiceDetail
        service={resolved.service}
        crumbs={crumbs}
        siblingServices={siblingServices}
        sharedFaqs={shared.faqs}
      />
    )
  }

  if (resolved.kind === 'module') {
    const cats = categoriesForModule(resolved.tree.categories, resolved.module.id)
    return (
      <TaxonomyLanding
        eyebrow="Practice area"
        title={resolved.module.title}
        intro={resolved.module.intro}
        description={resolved.module.description}
        crumbs={[{ label: 'Services', href: '/services' }, { label: resolved.module.title }]}
        links={cats.map((cat) => ({
          title: cat.title,
          href: categoryHref(resolved.module.slug, cat.slug),
          description: cat.intro || cat.description || `Explore ${cat.title} services.`,
        }))}
        gridTitle={`${resolved.module.title} Categories`}
        gridSubtitle="Select a category to view related service groups."
        testimonials={shared.testimonials}
        faqs={shared.faqs}
      />
    )
  }

  if (resolved.kind === 'category') {
    const subs = subcategoriesForCategory(resolved.tree.subcategories, resolved.category.id)
    return (
      <TaxonomyLanding
        eyebrow="Service family"
        title={resolved.category.title}
        intro={resolved.category.intro}
        description={resolved.category.description}
        crumbs={[
          { label: 'Services', href: '/services' },
          { label: resolved.module.title, href: moduleHref(resolved.module.slug) },
          { label: resolved.category.title },
        ]}
        links={subs.map((sub) => ({
          title: sub.title,
          href: subcategoryHref(resolved.module.slug, resolved.category.slug, sub.slug),
          description: sub.intro || sub.description || `Explore ${sub.title}.`,
        }))}
        gridTitle={`${resolved.category.title} Groups`}
        gridSubtitle="Select a service group to continue."
        testimonials={shared.testimonials}
        faqs={shared.faqs}
      />
    )
  }

  const pages = servicesForSubcategory(resolved.tree.services, resolved.subcategory.id)
  return (
    <TaxonomyLanding
      eyebrow="Service group"
      title={resolved.subcategory.title}
      intro={resolved.subcategory.intro}
      description={resolved.subcategory.description}
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: resolved.module.title, href: moduleHref(resolved.module.slug) },
        { label: resolved.category.title, href: categoryHref(resolved.module.slug, resolved.category.slug) },
        { label: resolved.subcategory.title },
      ]}
      links={pages.map((srv) => ({
        title: srv.title,
        href: serviceHref(srv.slug, {
          moduleSlug: resolved.module.slug,
          categorySlug: resolved.category.slug,
          subcategorySlug: resolved.subcategory.slug,
        }),
        description: srv.heroSubtitle || srv.introDescription || srv.shortDescription,
      }))}
      gridTitle={`${resolved.subcategory.title} Services`}
      gridSubtitle="Select a service to view full details."
      testimonials={shared.testimonials}
      faqs={shared.faqs}
    />
  )
}
