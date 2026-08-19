export function IncorporationOverview() {
    return (
        <section className="bg-[#f8f9fa] pt-16 pb-0 md:pt-24 md:pb-0 flex flex-col">
            <div className="container-prose px-4 md:px-8 mx-auto max-w-6xl bg-white p-8 md:p-12 mb-12 shadow-sm rounded-sm">
                {/* Intro Text */}
                <div className="text-slate-700 leading-relaxed text-[15px] md:text-[16px] space-y-6">
                    <p>
                        <span className="font-bold text-[#0b293d]">Starting a business in India</span> involves more than just an idea and a name. Choosing the right legal structure and completing the incorporation process correctly are critical steps that determine how your business will operate, comply with regulations, and grow in the long term. Company incorporation establishes your business as a legally recognized entity under Indian law, giving it a separate identity distinct from its owners.
                    </p>
                    <p>
                        The incorporation process includes selecting the appropriate entity type, preparing statutory documents, obtaining government approvals, and completing mandatory registrations with the Ministry of Corporate Affairs (MCA). Any error or delay during this stage can lead to compliance issues, operational hurdles, or future legal complications. This is why professional guidance is essential from the very beginning.
                    </p>
                    <p>
                        At Ritesh Arora & Associates, we provide end-to-end support for company incorporation, ensuring that every legal and regulatory requirement is addressed accurately. From advisory on entity selection to final registration and post-incorporation formalities, we help you start your business on a strong, compliant foundation — allowing you to focus on building and scaling your venture with confidence.
                    </p>
                </div>
            </div>

            {/* Why Section */}
            <div className="bg-[#0b293d] py-16 md:py-20 w-full">
                <div className="container-prose px-4 md:px-8 mx-auto max-w-6xl">
                    <h2 className="text-[28px] md:text-[36px] font-bold text-white mb-12 text-center tracking-wide">
                        Why Company Incorporation is Important
                    </h2>
                    <div className="grid md:grid-cols-2 gap-10 md:gap-x-16 md:gap-y-12">
                        {/* Item 1 */}
                        <div className="flex gap-4">
                            <div className="text-[#f28e2b] flex-shrink-0 mt-1">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            </div>
                            <div>
                                <h3 className="text-white text-[18px] md:text-[22px] font-medium mb-2 leading-tight">
                                    Ensures legal recognition and limited liability
                                </h3>
                                <p className="text-slate-300 font-light text-[14px] leading-relaxed">
                                    Incorporation gives your business a separate legal identity, protecting personal assets from business liabilities.
                                </p>
                            </div>
                        </div>
                        {/* Item 2 */}
                        <div className="flex gap-4">
                            <div className="text-[#f28e2b] flex-shrink-0 mt-1">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            </div>
                            <div>
                                <h3 className="text-white text-[18px] md:text-[22px] font-medium mb-2 leading-tight">
                                    Builds trust with banks, clients, and partners
                                </h3>
                                <p className="text-slate-300 font-light text-[14px] leading-relaxed">
                                    A registered company appears more credible to financial institutions, vendors, investors, and customers.
                                </p>
                            </div>
                        </div>
                        {/* Item 3 */}
                        <div className="flex gap-4">
                            <div className="text-[#f28e2b] flex-shrink-0 mt-1">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            </div>
                            <div>
                                <h3 className="text-white text-[18px] md:text-[22px] font-medium mb-2 leading-tight">
                                    Enables seamless access to funding
                                </h3>
                                <p className="text-slate-300 font-light text-[14px] leading-relaxed">
                                    Investors and lenders typically prefer incorporated entities for equity funding, loans, and credit facilities.
                                </p>
                            </div>
                        </div>
                        {/* Item 4 */}
                        <div className="flex gap-4">
                            <div className="text-[#f28e2b] flex-shrink-0 mt-1">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            </div>
                            <div>
                                <h3 className="text-white text-[18px] md:text-[22px] font-medium mb-2 leading-tight">
                                    Reduces litigation and compliance risks
                                </h3>
                                <p className="text-slate-300 font-light text-[14px] leading-relaxed">
                                    Proper incorporation minimizes future disputes, penalties, and regulatory non-compliance issues.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
