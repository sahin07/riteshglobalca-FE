export interface PricingPackageItem {
  name: string
  price: string | number
  billingPeriod: string
  badge?: string
  ctaText: string
  ctaLink?: string
  features: string[]
}

export interface PricingCardsProps {
  title: string
  plans: PricingPackageItem[]
}

export function PricingCards({ title, plans }: PricingCardsProps) {
    return (
        <section className="py-16 md:py-24 bg-[#f8f9fa]">
            <div className="container-prose max-w-6xl mx-auto px-4">
                <h2 className="text-[32px] md:text-[36px] font-bold text-brand-dark mb-12 text-center">
                    {title}
                </h2>

                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {plans.map((plan, index) => (
                        <div key={index} className="bg-white rounded-[5px] p-4 shadow-sm border border-slate-200 flex flex-col hover:shadow-lg transition-shadow duration-300">
                            
                            {/* Header row: Name + Badge */}
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-[18px] font-medium text-slate-500">{plan.name}</h3>
                                {plan.badge && (
                                    <span className="px-3 py-1 bg-[#ffecd1] text-[#f28e2b] text-[13px] font-medium rounded-full">
                                        {plan.badge}
                                    </span>
                                )}
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline mb-6">
                                <span className="text-[40px] md:text-[44px] font-bold text-brand-dark leading-none">
                                    ${plan.price}
                                </span>
                                <span className="ml-2 text-[16px] text-brand-dark font-medium">
                                    {plan.billingPeriod}
                                </span>
                            </div>

                            {/* Button */}
                            <button className="w-full py-3 px-4 bg-[#eef1f5] hover:bg-[#e2e8f0] text-brand-dark font-medium rounded-[8px] transition-colors mb-8">
                                {plan.ctaText}
                            </button>

                            {/* Features */}
                            <ul className="space-y-2 flex-1">
                                {plan.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-start text-slate-500 text-[15px]">
                                        <svg className="w-5 h-5 text-slate-600 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
