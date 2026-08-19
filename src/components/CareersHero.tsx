import { StrapiCareerPage, getStrapiMedia } from '@/lib/strapi'

interface CareersHeroProps {
    data?: StrapiCareerPage | null;
}

export function CareersHero({ data }: CareersHeroProps) {
    const title = data?.heroTitle || "Careers at Ritesh Arora & Associates";
    const description = data?.heroDescription || "Join our growing team of finance, audit, and compliance professionals.";
    const bgUrl = data?.heroImage?.url ? getStrapiMedia(data.heroImage.url) : "/images/careers/careers-hero.png";

    return (
        <section className="relative overflow-hidden min-h-[350px] md:min-h-[450px] flex items-center bg-[#0b293d]">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img 
                    src={bgUrl || ''} 
                    alt={title} 
                    className="w-full h-full object-cover object-center mix-blend-overlay opacity-30"
                />
            </div>

            <div className="container-prose relative z-10 px-4 md:px-8 w-full text-left">
                <div className="max-w-2xl text-left w-full">
                    <h1 className="text-[36px] md:text-[48px] lg:text-[56px] font-bold tracking-tight text-white mb-4">
                        {title}
                    </h1>
                    <p className="text-[16px] md:text-[20px] text-white/95 max-w-xl leading-relaxed font-normal">
                        {description}
                    </p>
                </div>
            </div>
        </section>
    )
}
