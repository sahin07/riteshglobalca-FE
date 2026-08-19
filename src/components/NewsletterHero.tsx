'use client'

export interface NewsletterHeroProps {
  title: string
  description: string
  placeholder: string
  buttonText: string
}

export function NewsletterHero({ title, description, placeholder, buttonText }: NewsletterHeroProps) {
    return (
        <section className="bg-[#f8f9fa] pt-24 pb-16 md:pt-32 md:pb-24 text-center px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-[32px] md:text-[46px] lg:text-[52px] font-bold text-[#0b293d] leading-tight mb-6 whitespace-pre-line">
                    {title}
                </h1>
                <p className="text-[16px] md:text-[20px] text-slate-700 max-w-3xl mx-auto mb-12 font-medium whitespace-pre-line">
                    {description}
                </p>

                <form className="flex flex-col sm:flex-row items-center justify-center max-w-2xl mx-auto gap-4" onSubmit={(e) => e.preventDefault()}>
                    <input 
                        type="email" 
                        placeholder={placeholder} 
                        className="w-full sm:w-[400px] px-6 py-3.5 rounded-[6px] border border-slate-200 outline-none focus:border-[#f28e2b] text-[15px] shadow-sm"
                        required
                    />
                    <button 
                        type="submit" 
                        className="w-full sm:w-auto px-10 py-3.5 bg-[#f28e2b] hover:bg-[#e07b1a] text-white font-medium rounded-[6px] transition-colors shadow-sm whitespace-nowrap"
                    >
                        {buttonText}
                    </button>
                </form>
            </div>
        </section>
    )
}
