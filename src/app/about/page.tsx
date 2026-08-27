import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAboutPage, getStrapiMedia } from '@/lib/strapi'

import { AboutHero } from '@/components/AboutHero'
import { OurStory } from '@/components/OurStory'
import { MissionVision } from '@/components/MissionVision'
import { OurJourney } from '@/components/OurJourney'
import { TeamGrid } from '@/components/TeamGrid'
import { ReadyToStart } from '@/components/ReadyToStart'

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage()
  if (!about) {
    return {
      title: 'About Us | Ritesh Arora & Associates',
      description: 'Learn more about Ritesh Arora & Associates.'
    }
  }

  const seo = about.seo || {}
  return {
    title: seo.metaTitle || about.heroTitle,
    description: seo.metaDescription || about.heroDescription,
    keywords: seo.keywords || '',
    robots: seo.metaRobots || 'index, follow',
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined
  }
}

export default async function AboutPage() {
  const about = await getAboutPage()

  if (!about) {
    notFound()
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <AboutHero
        title={about.heroTitle}
        description={about.heroDescription}
        backgroundImageUrl="/images/about-team.jpg"
        primaryButtonText={about.heroPrimaryButtonText}
        primaryButtonLink={about.heroPrimaryButtonLink}
        secondaryButtonText={about.heroSecondaryButtonText}
        secondaryButtonLink={about.heroSecondaryButtonLink}
      />

      {about.storyTitle && about.storyContent && (
        <OurStory
          title={about.storyTitle}
          content={about.storyContent}
          imageUrl="https://riteshglobalca.com/strapi/uploads/Whats_App_Image_2026_08_27_at_14_13_22_a6f3c813ad.jpeg"
        />
      )}

      {about.missionVisionTitle && about.missionVisionCards && about.missionVisionCards.length > 0 && (
        <MissionVision
          title={about.missionVisionTitle}
          cards={about.missionVisionCards.map(c => ({
            title: c.title,
            description: c.description,
            iconImage: c.iconImage?.url ? getStrapiMedia(c.iconImage.url) as string : undefined
          }))}
        />
      )}

      {about.journeyTitle && about.journeySubtitle && about.milestones && about.milestones.length > 0 && (
        <OurJourney
          title={about.journeyTitle}
          subtitle={about.journeySubtitle}
          milestones={about.milestones.map(m => ({
            id: m.id,
            yearTitle: m.year || m.title,
            description: m.description
          }))}
        />
      )}

      {about.leadershipTitle && about.teamMembers && about.teamMembers.length > 0 && (
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="container-prose">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{about.leadershipTitle}</h2>
              {about.leadershipSubtitle && <p className="text-slate-600 mt-4 max-w-2xl mx-auto leading-relaxed">{about.leadershipSubtitle}</p>}
            </div>
            <TeamGrid
              members={about.teamMembers.map(t => ({
                name: t.name,
                role: t.role,
                image: t.image?.url ? getStrapiMedia(t.image.url) as string : '',
                linkedInUrl: t.linkedInUrl,
                twitterUrl: t.twitterUrl,
                biography: t.biography,
                keyExpertise: t.keyExpertise
              }))}
            />
          </div>
        </section>
      )}

      {about.ctaTitle && about.ctaButtonText && about.ctaButtonLink && (
        <ReadyToStart
          title={about.ctaTitle}
          subtitle={about.ctaSubtitle}
          buttonText={about.ctaButtonText}
          buttonLink={about.ctaButtonLink}
        />
      )}
    </main>
  )
}
