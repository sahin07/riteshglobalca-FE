export function IncorporationClosure() {
    const steps = [
        {
            title: 'Voluntary Winding Up',
            desc: 'Members can voluntarily wind up the company if it is solvent and able to pay its debts. Requires a resolution by directors and shareholders.',
            icon: (
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            borderColor: 'border-green-500'
        },
        {
            title: 'Strike Off Mode',
            desc: 'Fast Track Exit (FTE) mode for defunct companies or those not carrying business for 2 years. The easiest way to close a dormant company.',
            icon: (
                <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            borderColor: 'border-amber-500'
        },
        {
            title: 'Selling the Company',
            desc: 'Transferring ownership by selling 100% shares to new management. This preserves the company age and brand value.',
            icon: (
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            ),
            borderColor: 'border-blue-500'
        },
        {
            title: 'Bankruptcy / Insolvency',
            desc: 'If unable to pay debts, the company can file for bankruptcy under IBC (Insolvency Bankruptcy Code) to liquidate assets.',
            icon: (
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
            ),
            borderColor: 'border-red-500'
        }
    ]

    return (
        <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200">
            <div className="container-prose">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Understanding Business Closure Procedures
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Businesses may need to close for various reasons. In India, the process depends on the solvency and activity status of the company.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, idx) => (
                        <div key={idx} className={`bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-t-4 ${step.borderColor} group`}>
                            <div className="w-14 h-14 bg-slate-50 rounded-full grid place-items-center mb-6 group-hover:scale-110 transition-transform">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
