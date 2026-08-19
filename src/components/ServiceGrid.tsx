import Link from 'next/link'
import { StrapiService, getStrapiMedia } from '@/lib/strapi'

interface ServiceGridProps {
    services?: StrapiService[];
}

export function ServiceGrid({ services: fetchedServices }: ServiceGridProps) {
    console.log('fetchedServices-->', fetchedServices)
    const staticServices = [
        {
            title: 'Company Incorporation',
            desc: 'Register your business with complete documentation, compliance, and startup support.',
            image: '/images/services/Gemini_Generated_Image_f9dqq0f9dqq0f9dq 2 (1).png',
            href: '/services/company-incorporation'
        },
        {
            title: 'GST Registration & Filing',
            desc: 'End-to-end GST registration, timely filing, reconciliation, and expert dispute handling.',
            image: '/images/services/Gemini_Generated_Image_f9dqq0f9dqq0f9dq 2 (2).png',
            href: '/services/gst-registration-filing'
        },
        {
            title: 'Income Tax Advisory',
            desc: 'Professional tax planning, return filing, and year-round compliance management.',
            image: '/images/services/Gemini_Generated_Image_f9dqq0f9dqq0f9dq 2 (3).png',
            href: '/services/income-tax-advisory'
        },
        {
            title: 'Accounting & Bookkeeping',
            desc: 'Monthly bookkeeping, financial reporting, and accurate ledger management.',
            image: '/images/services/Gemini_Generated_Image_f9dqq0f9dqq0f9dq 2 (4).png',
            href: '/services/accounting-bookkeeping'
        },
        {
            title: 'Audit & Assurance',
            desc: 'Internal, statutory, and compliance audits with actionable insights and transparency.',
            image: '/images/services/Gemini_Generated_Image_f9dqq0f9dqq0f9dq 2.png',
            href: '/services/audit-assurance'
        },
        {
            title: 'Business Compliance Management',
            desc: 'End-to-end ROC, MCA, and statutory compliance management to keep your business legally protected.',
            image: '/images/services/Gemini_Generated_Image_f9dqq0f9dqq0f9dq 2 (1).png', // Re-used for now
            href: '/services/business-compliance-management'
        },
    ]

    const fallbackImages = [
        '/images/services/Gemini_Generated_Image_f9dqq0f9dqq0f9dq 2 (1).png',
        '/images/services/Gemini_Generated_Image_f9dqq0f9dqq0f9dq 2 (2).png',
        '/images/services/Gemini_Generated_Image_f9dqq0f9dqq0f9dq 2 (3).png',
        '/images/services/Gemini_Generated_Image_f9dqq0f9dqq0f9dq 2 (4).png',
        '/images/services/Gemini_Generated_Image_f9dqq0f9dqq0f9dq 2.png',
        '/images/services/Gemini_Generated_Image_f9dqq0f9dqq0f9dq 2 (1).png'
    ]

    const services = fetchedServices && fetchedServices.length > 0
        && fetchedServices.map((s, idx) => ({
            title: s.title,
            desc: s.heroSubtitle || s.shortDescription || '',
            image: getStrapiMedia(s?.image?.url) || undefined,
            href: `/services/${s.slug}`
        }))

    if (!services) {
        return null;
    }

    return (
        <section className="py-16 md:py-24 bg-[#f8f9fa]">
            <div className="container-prose px-4 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-[28px] md:text-[36px] font-bold text-[#0b293d] mb-4">Our Core Services</h2>
                    <p className="text-slate-600 text-[15px] md:text-[16px]">Expert CA services to support individuals, startups, and enterprises.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {services?.map((s, idx) => (
                        <div key={idx} className="group rounded-[8px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-[#0b293d] flex flex-col h-full">
                            {/* Image Area */}
                            <div className="h-[220px] w-full relative overflow-hidden bg-slate-200 shrink-0">
                                <img src={s.image} alt={s?.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>

                            <div className="p-6 md:p-8 flex-1 flex flex-col">
                                <h3 className="text-[18px] md:text-[20px] font-medium text-white mb-3">
                                    {s.title}
                                </h3>
                                <p className="text-slate-300 font-light text-[14px] leading-relaxed mb-8 flex-1">
                                    {s.desc}
                                </p>
                                <Link href={s.href || '#'} className="inline-flex items-center text-[#f28e2b] text-[14px] font-medium hover:text-[#e07b1a] transition-colors mt-auto">
                                    Learn More <span className="ml-1">→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
