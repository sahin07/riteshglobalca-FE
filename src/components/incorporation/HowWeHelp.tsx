export function HowWeHelp() {
    const services = [
        {
            title: "Entity selection advisory",
            desc: "We assess your business model (Pvt Ltd / LLP / OPC), ownership structure, and growth plans to recommend the most suitable legal entity."
        },
        {
            title: "Name approval & reservation",
            desc: "We conduct name availability checks and handle MCA name reservation to avoid rejections or delays."
        },
        {
            title: "MOA & AOA drafting",
            desc: "We draft legally compliant Memorandum and Articles of Association tailored to your business activities."
        },
        {
            title: "DSC & DIN assistance",
            desc: "We facilitate Digital Signature Certificates and Director Identification Numbers for all proposed directors."
        },
        {
            title: "MCA filing for certificate of incorporation",
            desc: "All incorporation forms are prepared, reviewed, and filed accurately with the Ministry of Corporate Affairs."
        },
        {
            title: "PAN, TAN & GST inception support",
            desc: "Post-incorporation, we assist with mandatory registrations required to commence operations smoothly."
        }
    ]

    return (
        <section className="bg-[#f8f9fa] py-16 md:py-24">
            <div className="container-prose px-4 md:px-8 mx-auto max-w-6xl">
                <h2 className="text-[28px] md:text-[36px] font-bold text-[#0b293d] mb-12 text-center">
                    How We Help
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    {services.map((s, idx) => (
                        <div key={idx} className="bg-white p-8 md:p-10 rounded-[8px] shadow-sm flex gap-4 hover:shadow-md transition-shadow h-full border border-slate-100">
                            <div className="text-white bg-[#f28e2b] rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            </div>
                            <div>
                                <h3 className="text-[#0b293d] text-[18px] md:text-[20px] font-medium mb-3 leading-tight">
                                    {s.title}
                                </h3>
                                <p className="text-slate-600 font-light text-[14px] md:text-[15px] leading-relaxed">
                                    {s.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
