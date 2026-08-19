export function RelatedBlogs() {
    const blogs = [
        { title: 'Companies Act 2013 guide for Small Businesses', date: 'Oct 12, 2025', imgColor: 'bg-blue-900' },
        { title: 'How to finance your small firm to endure volatility?', date: 'Sep 28, 2025', imgColor: 'bg-stone-800' },
        { title: 'Startups in India: A tech company\'s network strategy', date: 'Sep 15, 2025', imgColor: 'bg-slate-800' },
    ]

    return (
        <section className="py-16 bg-slate-50">
            <div className="container-prose">
                <div className="text-center mb-10">
                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Blog</span>
                    <h2 className="text-3xl font-bold text-slate-900 mt-4">The Latest Blogs</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {blogs.map((b, idx) => (
                        <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                            <div className={`h-48 ${b.imgColor} relative`}>
                                {/* Placeholder for Blog Image */}
                                <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                            </div>
                            <div className="p-6">
                                <div className="text-xs text-slate-400 mb-2">{b.date}</div>
                                <h3 className="font-bold text-slate-800 group-hover:text-orange-500 transition-colors line-clamp-2">
                                    {b.title}
                                </h3>
                                <div className="mt-4 text-sm text-blue-600 font-semibold group-hover:underline">Read Article &rarr;</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
