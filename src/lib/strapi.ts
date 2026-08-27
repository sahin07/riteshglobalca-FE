import qs from 'qs';
import {
  isHiddenCategorySlug,
  isHiddenServiceSlug,
  isHiddenSubcategorySlug,
} from './hideDocs123'
import {
  isEmptyContentServiceSlug,
  isEmptyContentSubcategorySlug,
} from './emptyContent'

function shouldHideService(slug?: string | null) {
  return isHiddenServiceSlug(slug) || isEmptyContentServiceSlug(slug)
}

function shouldHideSubcategory(slug?: string | null) {
  return isHiddenSubcategorySlug(slug) || isEmptyContentSubcategorySlug(slug)
};

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';

async function fetchAllPages(pathWithQuery: string, init: RequestInit = { next: { revalidate: 60 } }): Promise<any[]> {
  const pageSize = 100;
  let page = 1;
  const all: any[] = [];
  const joiner = pathWithQuery.includes('?') ? '&' : '?';

  while (true) {
    const res = await fetch(
      `${STRAPI_URL}${pathWithQuery}${joiner}pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      init
    );
    if (!res.ok) {
      console.error('Failed to fetch', pathWithQuery, res.status, res.statusText);
      break;
    }
    const json = await res.json();
    all.push(...(json.data || []));
    const pageCount = json?.meta?.pagination?.pageCount || 1;
    if (page >= pageCount) break;
    page += 1;
  }

  return all;
}
export interface StrapiBlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: any[];
  coverImage?: {
    url: string;
  } | null;
  category?: {
    name: string;
    slug: string;
  } | null;
  tags?: any[];
  comments?: any[];
}

export async function getBlogPosts(): Promise<StrapiBlogPost[]> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/blog-posts?populate=*`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error('Failed to fetch blog posts from Strapi:', res.status, res.statusText);
      return [];
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<StrapiBlogPost | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/blog-posts?filters[slug][$eq]=${slug}&populate=*`, {
      next: { revalidate: 60 },
    });
    console.log('res==>', res)
    if (!res.ok) {
      console.error(`Failed to fetch blog post by slug (${slug}):`, res.status, res.statusText);
      return null;
    }

    const json = await res.json();
    const data = json.data;

    if (data && data.length > 0) {
      return data[0];
    }

    return null;
  } catch (error) {
    console.error(`Error fetching blog post by slug (${slug}):`, error);
    return null;
  }
}

// Utility to get the full URL for Strapi media
export function getStrapiMedia(url?: string | null) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}

export interface StrapiBlogSubscribe {
  id: number;
  documentId: string;
  subscribeTitle: string;
  subscribePlaceholder: string;
  subscribeButtonText: string;
  subscribeDisclaimer: string;
  privacyPolicyLinkText?: string;
  privacyPolicyLinkUrl?: string;
}

export async function getBlogSubscribe(): Promise<StrapiBlogSubscribe | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/blog-subscribe?populate=*`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error('Failed to fetch blog-subscribe from Strapi:', res.status, res.statusText);
      return null;
    }

    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Error fetching blog-subscribe:', error);
    return null;
  }
}

export interface StrapiServiceSubcategory {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  menuLabel?: string;
  intro?: string;
  description?: string;
  category?: { id: number; documentId?: string; title?: string; slug?: string } | null;
  services?: StrapiService[];
}

export interface StrapiServiceCategory {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  menuLabel?: string;
  intro?: string;
  description?: string;
  mainModule?: { id: number; documentId?: string; title?: string; slug?: string } | null;
  subcategories?: StrapiServiceSubcategory[];
}

export interface StrapiMainModule {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  menuLabel?: string;
  intro?: string;
  description?: string;
  categories?: StrapiServiceCategory[];
}

export interface StrapiService {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  heroTitle?: string;
  heroSubtitle?: string;
  shortDescription?: string;
  introDescription?: string;
  introQuote?: string;
  subcategory?: {
    id: number;
    documentId?: string;
    title?: string;
    slug?: string;
    category?: {
      id: number;
      documentId?: string;
      title?: string;
      slug?: string;
      mainModule?: { id: number; documentId?: string; title?: string; slug?: string } | null;
    } | null;
  } | null;
  image?: {
    url: string;
  } | null;
  contentBlocks?: any[];
  faqs?: any[];
  relatedBlogs?: any[];
  seo?: any;
}

export interface StrapiTestimonial {
  id: number;
  documentId: string;
  authorName: string;
  authorTitle?: string;
  rating?: number;
  content: string;
}

export interface StrapiFaq {
  id: number;
  documentId: string;
  question: string;
  answer: string;
}

export interface StrapiServicesPage {
  id: number;
  documentId: string;
  heroTitle: string;
  heroSubtitle?: string;
  heroBackgroundImage?: {
    url: string;
  } | null;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  services?: StrapiService[];
  testimonials?: StrapiTestimonial[];
  faqs?: StrapiFaq[];
}

export async function getMainModules(): Promise<StrapiMainModule[]> {
  try {
    return await fetchAllPages('/api/main-modules');
  } catch (error) {
    console.error('Error fetching main modules:', error);
    return [];
  }
}

export async function getServiceCategories(): Promise<StrapiServiceCategory[]> {
  try {
    const rows = await fetchAllPages('/api/service-categories?populate[mainModule][fields][0]=title&populate[mainModule][fields][1]=slug');
    return rows.filter((row) => !isHiddenCategorySlug(row.slug));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getServiceSubcategories(): Promise<StrapiServiceSubcategory[]> {
  try {
    const rows = await fetchAllPages('/api/service-subcategories?populate[category][fields][0]=title&populate[category][fields][1]=slug');
    return rows.filter((row) => !shouldHideSubcategory(row.slug));
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
}

export async function getServices(): Promise<StrapiService[]> {
  try {
    // Nav only needs title/slug/subcategory — avoid populate=* across hundreds of pages.
    const rows = await fetchAllPages(
      '/api/services?fields[0]=title&fields[1]=slug&populate[subcategory][fields][0]=id&populate[subcategory][fields][1]=title&populate[subcategory][fields][2]=slug'
    );
    return rows.filter((row) => !shouldHideService(row.slug));
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export interface StrapiAboutPage {
  id: number;
  documentId: string;
  heroTitle: string;
  heroDescription: string;
  heroBackgroundImage?: { url: string } | null;
  heroPrimaryButtonText?: string;
  heroPrimaryButtonLink?: string;
  heroSecondaryButtonText?: string;
  heroSecondaryButtonLink?: string;
  storyTitle: string;
  storyContent: string;
  storyImage?: { url: string } | null;
  missionVisionTitle: string;
  missionVisionCards?: Array<{
    id: number;
    title: string;
    description: string;
    iconImage?: { url: string } | null;
  }>;
  journeyTitle: string;
  journeySubtitle: string;
  milestones?: Array<{
    id: number;
    year: string;
    title: string;
    description: string;
  }>;
  leadershipTitle: string;
  leadershipSubtitle: string;
  teamMembers?: Array<{
    id: number;
    name: string;
    role: string;
    image?: { url: string } | null;
    linkedInUrl?: string;
    twitterUrl?: string;
    biography?: string;
    keyExpertise?: string[];
  }>;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  seo?: any;
}

export async function getAboutPage(): Promise<StrapiAboutPage | null> {
  try {
    const query = qs.stringify({
      populate: {
        heroBackgroundImage: { populate: '*' },
        storyImage: { populate: '*' },
        missionVisionCards: {
          populate: {
            iconImage: { populate: '*' }
          }
        },
        milestones: { populate: '*' },
        teamMembers: {
          populate: {
            image: { populate: '*' }
          }
        },
        seo: { populate: '*' }
      }
    }, { encodeValuesOnly: true });

    const res = await fetch(`${STRAPI_URL}/api/about?${query}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error('Failed to fetch about page:', res.status, res.statusText);
      return null;
    }

    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Error fetching about page:', error);
    return null;
  }
}

export async function getServiceBySlug(slug: string): Promise<StrapiService | null> {
  if (shouldHideService(slug)) {
    return null;
  }
  try {
    const query = qs.stringify({
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        image: {
          populate: '*',
        },
        seo: {
          populate: '*',
        },
        faqs: {
          populate: '*',
        },
        subcategory: {
          populate: {
            category: {
              populate: {
                mainModule: {
                  fields: ['title', 'slug'],
                },
              },
            },
          },
        },
        relatedBlogs: {
          populate: '*',
        },
        contentBlocks: {
          on: {
            'service.process-section': {
              populate: {
                tabs: {
                  populate: {
                    steps: {
                      populate: '*'
                    },
                    tab_image: {
                      populate: '*'
                    }
                  }
                }
              }
            },
            'service.feature-grid': {
              populate: '*'
            },
            'service.rich-text-section': {
              populate: '*'
            },
            'service.tabbed-rich-text': {
              populate: '*'
            },
            'service.contact-cta': {
              populate: '*'
            },
            'service.table-section': {
              populate: {
                headers: { populate: '*' },
                rows: {
                  populate: {
                    cells: { populate: '*' }
                  }
                }
              }
            },
            'service.tabbed-table-section': {
              populate: {
                tabs: {
                  populate: {
                    headers: { populate: '*' },
                    rows: {
                      populate: {
                        cells: { populate: '*' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
      },
    }, {
      encodeValuesOnly: true,
    });

    const res = await fetch(`${STRAPI_URL}/api/services?${query}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error(`Failed to fetch service by slug (${slug}):`, res.status, res.statusText);
      return null;
    }

    const json = await res.json();
    const data = json.data;

    if (data && data.length > 0) {
      return data[0];
    }

    return null;
  } catch (error) {
    console.error(`Error fetching service by slug (${slug}):`, error);
    return null;
  }
}

export async function getServicesPage(): Promise<StrapiServicesPage | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/services-page?populate[heroBackgroundImage]=true&populate[services][populate]=*&populate[testimonials][populate]=*&populate[faqs]=*`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error('Failed to fetch services-page from Strapi:', res.status, res.statusText);
      return null;
    }

    const json = await res.json();
    const page = json.data || null;
    if (page?.services) {
      page.services = page.services.filter((row: { slug?: string }) => !shouldHideService(row.slug));
    }
    return page;
  } catch (error) {
    console.error('Error fetching services-page:', error);
    return null;
  }
}

export interface StrapiCareerPage {
  id: number;
  documentId: string;
  heroTitle: string;
  heroDescription?: string;
  heroImage?: {
    url: string;
  } | null;
  seo?: any;
}

export interface StrapiJob {
  id: number;
  documentId: string;
  title: string;
  department: string;
  location: string;
  experience: string;
  jobType: string;
  shortDescription?: string;
  description?: string;
  fullDescription?: string;
  responsibilities?: string;
  requirements?: string;
  publishedAt?: string;
  postedDate?: string;
}

export async function getCareerPageData(): Promise<StrapiCareerPage | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/career?populate=*`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Error fetching career page data:', error);
    return null;
  }
}

export async function getJobs(): Promise<StrapiJob[]> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/jobs?populate=*`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    console.log("json===========>>>", json)
    return json.data || [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export interface StrapiLink {
  id: number;
  label: string;
  url: string;
}

export interface StrapiFooter {
  id: number;
  documentId: string;
  brandName?: string;
  description?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  threadsUrl?: string;
  quickLinks?: StrapiLink[];
  servicesLinks?: StrapiLink[];
  resourcesLinks?: StrapiLink[];
}

export async function getFooter(): Promise<StrapiFooter | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/footer?populate[quickLinks]=*&populate[servicesLinks]=*&populate[resourcesLinks]=*`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Error fetching footer:', error);
    return null;
  }
}

export interface StrapiHeader {
  id: number;
  documentId: string;
  logo?: {
    url: string;
  } | null;
  navLinks?: StrapiLink[];
}

export async function getHeader(): Promise<StrapiHeader | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/header?populate[logo]=*&populate[navLinks]=*`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Error fetching header:', error);
    return null;
  }
}

