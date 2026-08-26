import {
  getBlogSubscribe,
  getServicesPage,
  getStrapiMedia,
  StrapiFaq,
  StrapiTestimonial,
} from '@/lib/strapi'
import type { SharedTestimonialItem } from '@/components/shared/SharedTestimonials'
import type { SharedFaqItem } from '@/components/shared/SharedFAQ'

export type SharedNewsletterData = {
  title?: string
  description?: string
  placeholder?: string
  buttonText?: string
}

export type SharedServicesSections = {
  testimonials: SharedTestimonialItem[]
  faqs: SharedFaqItem[]
  newsletter: SharedNewsletterData
}

function mapTestimonials(items?: StrapiTestimonial[] | null): SharedTestimonialItem[] {
  if (!items?.length) return []
  return items.map((t) => ({
    quote: t.content,
    author: t.authorName,
    role: t.authorTitle || '',
    rating: t.rating || 5,
    avatarUrl: getStrapiMedia((t as any).authorImage?.url) || null,
  }))
}

function mapFaqs(items?: StrapiFaq[] | null): SharedFaqItem[] {
  if (!items?.length) return []
  return items.map((f) => ({
    question: f.question,
    answer: f.answer,
  }))
}

export async function getSharedServicesSections(): Promise<SharedServicesSections> {
  const [pageData, subscribe] = await Promise.all([getServicesPage(), getBlogSubscribe()])

  return {
    testimonials: mapTestimonials(pageData?.testimonials),
    faqs: mapFaqs(pageData?.faqs),
    newsletter: {
      title: subscribe?.subscribeTitle || undefined,
      description: subscribe?.subscribeDisclaimer || undefined,
      placeholder: subscribe?.subscribePlaceholder || undefined,
      buttonText: subscribe?.subscribeButtonText || undefined,
    },
  }
}
