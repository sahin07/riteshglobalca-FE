import Link from 'next/link'
import { Button } from '@/components/Button'

export function IncorporationHero() {
    return (
        <section className="relative overflow-hidden h-[450px] md:h-[500px] flex items-center bg-[#0b293d]">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img 
                    src="/images/pricing/pricing-hero.png" 
                    alt="Company Incorporation" 
                    className="w-full h-full object-cover object-center mix-blend-overlay opacity-80"
                />
            </div>

            <div className="relative container-prose px-4 md:px-8">
                <div className="max-w-2xl">
                    <h1 className="text-[36px] md:text-[48px] lg:text-[56px] font-bold tracking-tight text-white mb-4 leading-tight">
                        Company Incorporation
                    </h1>
                    <p className="text-[16px] md:text-[20px] text-white/95 leading-relaxed font-normal">
                        Complete support to register your company in India with confidence and compliance.
                    </p>
                </div>
            </div>
        </section>
    )
}
