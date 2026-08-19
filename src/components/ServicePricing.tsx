export interface PricingService {
  name: string
  priceInfo: string
  icon: string
}

export interface PricingAddon {
  name: string
  description: string
  icon?: string
}

export interface ServicePricingProps {
  servicesTitle: string
  services: PricingService[]
  addonsTitle: string
  addons: PricingAddon[]
}

const serviceIconPaths: Record<string, string> = {
  gst: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  company: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  'income-tax': 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  accounting: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  audit: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  management: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
}

const addonIconPaths: Record<string, string> = {
  'arrow-up': 'M5 10l7-7 7 7M12 3v18',
  'chart-bar': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm9-1v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z',
  scale: 'M3 6l3 1M3 6l3-1m-3 1v12m0 0l3 1m-3-1l3-1m12-10l3 1m-3-1l3-1m-3 1v12m0 0l3 1m-3-1l3-1M12 3v18'
}

const defaultServicePath = 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5'
const defaultAddonPath = 'M12 6v6m0 0v6m0-6h6m-6 0H6'

export function ServicePricing({ servicesTitle, services, addonsTitle, addons }: ServicePricingProps) {
    return (
        <div className="bg-[#f8f9fa] pb-16 md:pb-24">
            {/* Service-Specific Pricing */}
            <section className="container-prose max-w-6xl mx-auto px-4 mb-20 md:mb-28 mt-4">
                <h2 className="text-[28px] md:text-[36px] font-bold text-brand-dark mb-10 text-center">
                    {servicesTitle}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {services.map((s) => {
                        const path = serviceIconPaths[s.icon?.toLowerCase()] || defaultServicePath
                        return (
                            <div key={s.name} className="bg-white p-5 rounded-[12px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                                <div className="w-6 h-6 text-brand-dark mb-4 shrink-0">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={path} />
                                    </svg>
                                </div>
                                <div className="font-medium text-brand-dark text-[15px] leading-snug mb-1">
                                    {s.name}
                                </div>
                                <div className="text-[13px] text-slate-500 mt-auto">
                                    {s.priceInfo}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Add-On Services */}
            <section className="container-prose max-w-6xl mx-auto px-4">
                <h2 className="text-[28px] md:text-[36px] font-bold text-brand-dark mb-10 text-center">
                    {addonsTitle}
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {addons.map((a) => {
                        const path = a.icon ? (addonIconPaths[a.icon?.toLowerCase()] || defaultAddonPath) : defaultAddonPath
                        return (
                            <div key={a.name} className="bg-white p-6 rounded-[12px] border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                                <div className="w-6 h-6 text-brand-dark mb-4 shrink-0">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={path} />
                                    </svg>
                                </div>
                                <h3 className="font-medium text-brand-dark text-[18px] md:text-[20px] mb-2">{a.name}</h3>
                                <p className="text-slate-500 text-[14px] leading-relaxed">{a.description}</p>
                            </div>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}
