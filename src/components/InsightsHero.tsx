export function InsightsHero() {
    return (
        <section className="relative overflow-hidden bg-slate-950 py-24 md:py-32 lg:py-40 flex items-center">
            {/* High-quality generated background image */}
            <div className="absolute inset-0">
                <img 
                    src="/images/blog/hero_bg.png" 
                    alt="Insights Hero Background" 
                    className="w-full h-full object-cover object-center"
                />
                {/* Subtle dark overlay for premium readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
            </div>

            <div className="relative w-full container-prose z-10">
                <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 font-sans">
                        Insights & Success Stories
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed font-sans font-light">
                        Explore expert advice, real-world case studies, and actionable strategies to drive growth and innovation in your business.
                    </p>
                </div>
            </div>
        </section>
    )
}
