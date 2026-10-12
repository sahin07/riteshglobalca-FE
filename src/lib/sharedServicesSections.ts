import { getBlogSubscribe, getServicesPage, StrapiFaq } from '@/lib/strapi'
import { getGoogleReviewsData } from '@/lib/googleReviews'
import type { SharedTestimonialItem } from '@/components/shared/SharedTestimonials'
import type { SharedFaqItem } from '@/components/shared/SharedFAQ'
import type { GoogleReviewsSummary } from '@/components/shared/GoogleReviewsBadge'

export type SharedNewsletterData = {
  title?: string
  description?: string
  placeholder?: string
  buttonText?: string
}

export type SharedServicesSections = {
  testimonials: SharedTestimonialItem[]
  googleSummary: GoogleReviewsSummary | null
  faqs: SharedFaqItem[]
  newsletter: SharedNewsletterData
}

function mapFaqs(items?: StrapiFaq[] | null): SharedFaqItem[] {
  if (!items?.length) return []
  return items.map((f) => ({
    question: f.question,
    answer: f.answer,
  }))
}

export async function getSharedServicesSections(): Promise<SharedServicesSections> {
  const [pageData, subscribe, googleReviews] = await Promise.all([
    getServicesPage(),
    getBlogSubscribe(),
    getGoogleReviewsData(),
  ])

  return {
    testimonials: googleReviews.items,
    googleSummary: googleReviews.summary,
    faqs: mapFaqs(pageData?.faqs),
    newsletter: {
      title: subscribe?.subscribeTitle || undefined,
      description: subscribe?.subscribeDisclaimer || undefined,
      placeholder: subscribe?.subscribePlaceholder || undefined,
      buttonText: subscribe?.subscribeButtonText || undefined,
    },
  }
}
