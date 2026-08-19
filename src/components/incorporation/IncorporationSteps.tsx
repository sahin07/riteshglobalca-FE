export function IncorporationSteps() {
    const steps = [
        {
            num: '1',
            title: 'Initial consultation & entity planning',
            desc: 'We understand your business objectives and advise on the appropriate incorporation structure.'
        },
        {
            num: '2',
            title: 'Document collection & verification',
            desc: 'Required identity, address, and business documents are collected and thoroughly verified.'
        },
        {
            num: '3',
            title: 'Name approval & registrar submission',
            desc: 'Proposed company names are submitted to the MCA for approval and reservation.'
        },
        {
            num: '4',
            title: 'DIN & DSC setup',
            desc: 'Directors’ DIN and DSC are processed to enable legally valid filings.'
        },
        {
            num: '5',
            title: 'Registration filing with MCA',
            desc: 'Incorporation forms along with MOA and AOA are filed with the Registrar of Companies.'
        },
        {
            num: '6',
            title: 'Certificate issuance & post-registration setup',
            desc: 'Upon approval, the Certificate of Incorporation is issued and post-registration steps are initiated.'
        }
    ]

    return (
        <section className="relative py-16 md:py-24 bg-[#0b293d] overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
                {/* Radial lines pattern (CSS representation) */}
                <div className="w-[200%] h-[200%] md:w-[150%] md:h-[150%] bg-[radial-gradient(circle_at_center,_transparent_0%,_#ffffff_100%)] opacity-20" style={{ backgroundImage: 'repeating-conic-gradient(from 0deg, transparent 0deg 10deg, rgba(255,255,255,0.1) 10deg 20deg)' }}></div>
            </div>

            <div className="relative container-prose px-4 md:px-8 mx-auto max-w-4xl">
                <h2 className="text-[28px] md:text-[36px] font-bold text-white mb-12 text-center">
                    Our Incorporation Process
                </h2>
                
                <div className="space-y-4">
                    {steps.map((step, idx) => (
                        <div key={idx} className="bg-white p-6 md:p-8 rounded-[8px] flex items-start gap-5 shadow-lg">
                            <div className="bg-[#f28e2b] text-white font-bold text-[16px] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                                {step.num}
                            </div>
                            <div>
                                <h3 className="text-[#0b293d] text-[18px] md:text-[20px] font-semibold mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-slate-600 text-[14px] md:text-[15px] font-light leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
