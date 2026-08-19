import { Button } from './Button'
import Link from 'next/link'

interface ServiceHeroProps {
    title?: string;
    subtitle?: string;
    backgroundImage?: string | null;
    primaryButtonText?: string;
    primaryButtonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
}

export function ServiceHero({
    title,
    subtitle,
    backgroundImage,
    primaryButtonText,
    primaryButtonLink,
    secondaryButtonText,
    secondaryButtonLink
}: ServiceHeroProps) {
    return (
        <section className="relative overflow-hidden min-h-[380px] sm:min-h-[480px] md:min-h-[560px] flex items-center bg-[#173e56]">
            {/* Background Image */}
            <div className="absolute inset-0">
                {backgroundImage && (
                    <>
                        <div className="absolute inset-0 overflow-hidden md:hidden">
                            <img
                                src={backgroundImage}
                                alt=""
                                className="w-full h-full object-cover blur-xl opacity-40 scale-110"
                                aria-hidden="true"
                            />
                        </div>
                        <img
                            src={backgroundImage}
                            alt="Service background"
                            className="w-full h-full object-contain md:object-cover object-center opacity-70 mix-blend-overlay"
                        />
                    </>
                )}
            </div>

            <div className="relative py-12 sm:py-20 md:py-28 px-4 sm:px-6 md:px-8 w-full">
                <div className="max-w-2xl">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3 sm:mb-4 leading-tight">
                        {title}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 mb-6 sm:mb-8 leading-relaxed font-normal whitespace-pre-line">
                        {subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 w-full sm:w-auto">
                        <Link href={primaryButtonLink || ""} className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-[#f28e2b] hover:bg-[#e07b1a] text-white font-medium rounded-[6px] text-sm sm:text-base transition-colors shadow-sm">
                                {primaryButtonText}
                            </button>
                        </Link>
                        <Link href={secondaryButtonLink || ""} className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-transparent hover:bg-white/10 text-white font-medium rounded-[6px] text-sm sm:text-base transition-colors border border-white">
                                {secondaryButtonText}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

