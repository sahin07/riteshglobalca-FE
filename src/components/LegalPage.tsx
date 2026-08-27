import Link from 'next/link'

type LegalSection = {
  title: string
  paragraphs?: string[]
  bullets?: string[]
}

export function LegalPage({
  title,
  subtitle,
  lastUpdated,
  sections,
}: {
  title: string
  subtitle: string
  lastUpdated: string
  sections: LegalSection[]
}) {
  return (
    <main className="bg-slate-50 min-h-screen flex flex-col">
      <section className="relative overflow-hidden min-h-[280px] md:min-h-[320px] flex items-center bg-[#0b293d]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative z-10 container-prose px-4 md:px-8 w-full mx-auto max-w-6xl text-left">
          <div className="max-w-3xl">
            <h1 className="text-[32px] md:text-[44px] lg:text-[52px] font-bold tracking-tight text-white mb-4">
              {title}
            </h1>
            <p className="text-[16px] md:text-[18px] text-slate-300 max-w-2xl leading-relaxed font-normal">
              {subtitle}
            </p>
            <p className="mt-4 text-[13px] text-slate-400">Last updated: {lastUpdated}</p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-[20px] md:text-[22px] font-semibold text-[#0b293d] mb-3">
                  {section.title}
                </h2>
                {section.paragraphs?.map((p) => (
                  <p key={p.slice(0, 40)} className="text-[15px] text-slate-600 leading-relaxed mb-3">
                    {p}
                  </p>
                ))}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="list-disc pl-5 space-y-2 text-[15px] text-slate-600 leading-relaxed">
                    {section.bullets.map((item) => (
                      <li key={item.slice(0, 40)}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <p className="mt-12 text-[14px] text-slate-500">
            Questions?{' '}
            <Link href="/contact" className="text-[#F19020] hover:underline">
              Contact us
            </Link>{' '}
            or email{' '}
            <a href="mailto:admin@riteshglobalca.com" className="text-[#F19020] hover:underline">
              admin@riteshglobalca.com
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  )
}
