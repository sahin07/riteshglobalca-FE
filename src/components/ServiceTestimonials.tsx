import { StrapiTestimonial } from '@/lib/strapi'

interface ServiceTestimonialsProps {
    testimonials?: StrapiTestimonial[];
}

export function ServiceTestimonials({ testimonials: fetchedTestimonials }: ServiceTestimonialsProps) {
    const staticTestimonials = [
        {
            quote: "“Their team has been handling our GST filings and monthly compliance for over two years now. Everything is extremely organized, accurate, and always filed on time. It's a huge relief knowing our business is in safe, expert hands.”",
            author: "Rohit Malhotra",
            role: "Co-Founder - CloudSync Innovations"
        },
        {
            quote: "“From registering our company to setting up our entire compliance framework, they guided us at every step with complete clarity. Their CA advisory helped us avoid several early-stage mistakes. Highly recommended for startups.”",
            author: "Aishwarya Verma",
            role: "Co-Founder - CloudSync Innovations"
        },
        {
            quote: "“I've been filing my income tax with them for three years, and the experience has always been smooth and stress-free. They proactively planned my taxes and helped me save significantly within legal limits.”",
            author: "Aditya Singh",
            role: "Senior Software Engineer"
        }
    ]

    const testimonials = fetchedTestimonials && fetchedTestimonials.length > 0
        && fetchedTestimonials.map(t => ({
            quote: t.content,
            author: t.authorName,
            role: t.authorTitle || ''
        }))

    if (!testimonials) {
        return null;
    }

    return (
        <section className="py-16 md:py-24 bg-[#f8f9fa]">
            <div className="container-prose text-center mb-16 max-w-6xl mx-auto px-4">
                <h2 className="text-[28px] md:text-[36px] font-bold text-[#0b293d] mb-4">Client Testimonials</h2>
                <p className="text-slate-600 text-[15px] md:text-[16px]">Real experiences from clients who rely on us for tax, compliance, and financial advisory.</p>
            </div>

            <div className="container-prose grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
                {testimonials.map((t, idx) => (
                    <div key={idx} className="bg-white p-8 md:p-10 rounded-[12px] shadow-sm hover:shadow-md transition-shadow text-left flex flex-col h-full border border-slate-100">
                        <div className="flex text-[#e6a210] mb-6 gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27l5.18 3.04-1.64-5.81L20 10.9l-6-.52L12 5l-2 5.38-6 .52 4.46 3.6-1.64 5.81z" /></svg>
                            ))}
                        </div>
                        <blockquote className="text-slate-500 italic flex-grow mb-8 font-light text-[14px] leading-relaxed">
                            {t.quote}
                        </blockquote>
                        <div className="mt-auto pt-2">
                            <div className="font-medium text-[#0b293d] text-[16px]">{t.author}</div>
                            <div className="text-[13px] text-slate-400 font-light mt-1">{t.role}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
