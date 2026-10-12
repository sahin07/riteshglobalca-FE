import { cache } from 'react'
import { getGoogleReviews, getGoogleReviewsSetting, getStrapiMedia } from '@/lib/strapi'
import type { SharedTestimonialItem } from '@/components/shared/SharedTestimonials'
import type { GoogleReviewsSummary } from '@/components/shared/GoogleReviewsBadge'

export type GoogleReviewsData = {
  items: SharedTestimonialItem[]
  summary: GoogleReviewsSummary | null
}

function formatReviewDate(value?: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric', timeZone: 'UTC' })
}

export const getGoogleReviewsData = cache(async (): Promise<GoogleReviewsData> => {
  const [reviews, setting] = await Promise.all([getGoogleReviews(), getGoogleReviewsSetting()])
  const profileUrl = setting?.googleProfileUrl || null

  const items: SharedTestimonialItem[] = reviews.map((r) => ({
    quote: r.reviewText,
    author: r.reviewerName,
    role: formatReviewDate(r.reviewDate),
    rating: r.rating || 5,
    avatarUrl: getStrapiMedia(r.reviewerPhoto?.url) || null,
    source: 'google',
    href: r.reviewUrl || profileUrl,
  }))

  const averageRating = setting?.averageRating != null ? Number(setting.averageRating) : null

  return {
    items,
    summary: setting
      ? {
          profileUrl,
          averageRating: averageRating && !Number.isNaN(averageRating) ? averageRating : null,
          totalReviews: setting.totalReviews ?? null,
        }
      : null,
  }
})
