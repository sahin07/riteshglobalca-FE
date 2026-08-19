export interface ContactHeroProps {
  title: string
  description: string
}

export function ContactHero({ title, description }: ContactHeroProps) {
    return (
         <section className="relative overflow-hidden min-h-[350px] md:min-h-[400px] flex items-center bg-[#0b293d]">
            <div className="absolute inset-0">
                <img 
                    src="/images/pricing/pricing-hero.png" 
                    alt="Pricing Background" 
                    className="w-full h-full object-cover object-center"
                />
            </div>

            <div className="relative z-10 container-prose px-4 md:px-8 w-full text-left">
                <div className="max-w-3xl">
                    <h1 className="text-[36px] md:text-[48px] lg:text-[56px] font-bold tracking-tight text-white mb-4">
                        {title}
                    </h1>
                    <p className="text-[16px] md:text-[20px] text-white/95 max-w-xl leading-relaxed font-normal whitespace-pre-line">
                        {description}
                    </p>
                </div>
            </div>
         </section>
    )
}
