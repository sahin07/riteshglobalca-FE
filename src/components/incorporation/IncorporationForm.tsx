import { Button } from '@/components/Button'

export function IncorporationForm() {
    return (
        <section className="relative bg-slate-900 py-0 overflow-hidden">
            <div className="grid lg:grid-cols-2 h-full min-h-[500px]">
                {/* Left Content Image */}
                <div className="relative p-12 md:p-20 flex flex-col justify-center bg-zinc-900">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent" />
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Expand your Business - <br />
                            <span className="text-orange-400">Your Ambitions, our Target!</span>
                        </h2>
                        <p className="text-white/70 text-lg mb-8">
                            Get expert advice on company formation, compliance, and growth strategies suitable for your specific industry.
                        </p>
                        <ul className="space-y-4 text-white/80">
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-orange-400" /> Free Name Availability Check
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-orange-400" /> Draft MOA & AOA
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-orange-400" /> PAN & TAN Application
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Content Form */}
                <div className="bg-orange-500 p-12 md:p-20 flex flex-col justify-center">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md mx-auto w-full">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Get a Free Quote</h3>
                        <form className="space-y-4">
                            <input type="text" placeholder="Your Name" className="w-full h-12 rounded bg-slate-50 border border-slate-200 px-4 text-slate-900 focus:outline-none focus:border-orange-500 transition-colors" />
                            <input type="email" placeholder="Your Email" className="w-full h-12 rounded bg-slate-50 border border-slate-200 px-4 text-slate-900 focus:outline-none focus:border-orange-500 transition-colors" />
                            <input type="tel" placeholder="Phone Number" className="w-full h-12 rounded bg-slate-50 border border-slate-200 px-4 text-slate-900 focus:outline-none focus:border-orange-500 transition-colors" />
                            <textarea rows={3} placeholder="Brief Requirement" className="w-full rounded bg-slate-50 border border-slate-200 p-4 text-slate-900 focus:outline-none focus:border-orange-500 transition-colors resize-none" />
                            <Button variant="primary" className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800">
                                Request Callback
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
