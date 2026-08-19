import Link from 'next/link'
interface ServiceSubservicesProps {
  subServices?: any[]
}

export function ServiceSubservices({ subServices }: ServiceSubservicesProps) {
  if (!subServices || subServices.length === 0) return null

  return (
    <section className="bg-white py-16 md:py-24 border-b border-slate-100">
      <div className="container-prose px-4 md:px-8 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-[28px] md:text-[36px] font-bold text-[#0b293d] mb-4">Our Expertise</h2>
          <p className="text-slate-600 text-[15px] md:text-[16px]">Comprehensive solutions tailored to your specific business requirements.</p>
        </div>

        <div className="space-y-12 md:space-y-16">
          {subServices.map((sub, idx) => (
            <div key={sub.id || idx} className="bg-[#f8f9fa] rounded-[16px] p-8 md:p-10 shadow-sm border border-slate-200">
              <h3 className="text-[22px] md:text-[26px] font-semibold text-[#0b293d] mb-8 pb-4 border-b border-slate-300">
                {sub.title}
              </h3>
              
              {sub.childServices && sub.childServices.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sub.childServices.map((child: any, cIdx: number) => (
                    <Link href={`/services/${child.slug}`} key={child.id || cIdx} className="group block h-full">
                      <div className="bg-white h-full p-6 rounded-[12px] border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#f28e2b]">
                        <div className="flex items-start justify-between">
                          <h4 className="text-[16px] md:text-[18px] font-medium text-slate-800 group-hover:text-[#f28e2b] transition-colors">
                            {child.title}
                          </h4>
                          <span className="text-[#f28e2b] opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0">
                            →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">More details coming soon...</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
