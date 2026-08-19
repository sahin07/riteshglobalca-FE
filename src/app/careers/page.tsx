import { CareersHero } from '@/components/CareersHero'
import { JobOpenings } from '@/components/JobOpenings'
import { ContactBanner } from '@/components/ContactBanner'
import { getCareerPageData, getJobs } from '@/lib/strapi'
import { Metadata } from 'next'
import SEO from '@/components/SEO'

export async function generateMetadata(): Promise<Metadata> {
  const careerData = await getCareerPageData()
  return {
    title: careerData?.seo?.metaTitle,
    description: careerData?.seo?.metaDescription,
  }
}

export default async function CareersPage() {
  const [careerData, jobs] = await Promise.all([
    getCareerPageData(),
    getJobs()
  ]);

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <SEO seo={careerData?.seo} />
      <CareersHero data={careerData} />
      <JobOpenings jobs={jobs} />
    </main>
  )
}
