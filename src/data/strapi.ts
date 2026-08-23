export function getStrapiUrl(path: string = '') {
  if (!path) return '';
  // If it's already a full URL, return it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  // Remove trailing slash from base and leading slash from path
  const sanitizedBase = baseUrl?.replace(/\/$/, '');
  const sanitizedPath = path.replace(/^\//, '');
  return `${sanitizedBase}/${sanitizedPath}`;
}

export async function fetchHomepageData() {
  const apiUrl = getStrapiUrl('api/home-page');
  console.log('apiUrl--->', apiUrl)
  const populateQuery = [
    'heroImage',
    'services',
    'services.image',
    'stats',
    'trustedByLogos',
    'aboutRightPoints',
    'insights',
    'insights.image',
    'testimonials',
    'testimonials.authorImage',
    'seo'
  ].map((field, idx) => `populate[${idx}]=${field}`).join('&');

  try {
    const response = await fetch(`${apiUrl}?${populateQuery}`, {
      next: { revalidate: 60 } // Next.js 13+ Incremental Static Regeneration (ISR)
    });

    if (!response.ok) {
      console.error('Failed to fetch homepage data from Strapi:', response.statusText);
      return null;
    }

    const json = await response.json();
    return json?.data || null;
  } catch (error) {
    console.error('Error fetching homepage data from Strapi:', error);
    return null;
  }
}

export async function fetchAboutPageData() {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  const populateQuery = [
    'heroBackgroundImage',
    'storyImage',
    'missionVisionCards',
    'missionVisionCards.iconImage',
    'milestones',
    'teamMembers',
    'teamMembers.image',
    'seo',
    'seo.metaImage'
  ].map((field, idx) => `populate[${idx}]=${field}`).join('&');

  try {
    const response = await fetch(`${baseUrl}/api/about?${populateQuery}`, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      console.error('Failed to fetch about page data from Strapi:', response.statusText);
      return null;
    }

    const json = await response.json();
    return json?.data || null;
  } catch (error) {
    console.error('Error fetching about page data from Strapi:', error);
    return null;
  }
}

export async function fetchPricingPageData() {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  const populateQuery = [
    'packages',
    'packages.features',
    'services',
    'addons',
    'comparisonFeatures',
    'faqs',
    'seo',
    'seo.metaImage'
  ].map((field, idx) => `populate[${idx}]=${field}`).join('&');

  try {
    const response = await fetch(`${baseUrl}/api/pricing?${populateQuery}`, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      console.error('Failed to fetch pricing page data from Strapi:', response.statusText);
      return null;
    }

    const json = await response.json();
    return json?.data || null;
  } catch (error) {
    console.error('Error fetching pricing page data from Strapi:', error);
    return null;
  }
}

export async function fetchNewsletterPageData() {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  const populateQuery = [
    'features',
    'seo',
    'seo.metaImage'
  ].map((field, idx) => `populate[${idx}]=${field}`).join('&');

  try {
    const response = await fetch(`${baseUrl}/api/newsletter?${populateQuery}`, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      console.error('Failed to fetch newsletter page data from Strapi:', response.statusText);
      return null;
    }

    const json = await response.json();
    return json?.data || null;
  } catch (error) {
    console.error('Error fetching newsletter page data from Strapi:', error);
    return null;
  }
}

export async function fetchContactPageData() {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  const populateQuery = [
    'seo',
    'seo.metaImage'
  ].map((field, idx) => `populate[${idx}]=${field}`).join('&');

  try {
    const response = await fetch(`${baseUrl}/api/contact?${populateQuery}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('Failed to fetch contact page data from Strapi:', response.statusText);
      return null;
    }

    const json = await response.json();
    return json?.data || null;
  } catch (error) {
    console.error('Error fetching contact page data from Strapi:', error);
    return null;
  }
}
