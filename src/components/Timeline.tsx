export function Timeline() {
  const items = [
    { year: '2018', title: 'Firm established', text: 'Founded with a vision to simplify compliance and advisory.' },
    { year: '2021', title: 'Reached 100+ corporate clients', text: 'Rapid growth in corporate services and audits.' },
    { year: '2024', title: 'Expanded to multiple cities', text: 'Now serving clients across 5 major metros.' },
    { year: '2025', title: 'Achieved 500+ successful compliance filings', text: 'Trusted by startups, SMEs, and enterprises.' },
  ]
  return (
    <div className="relative py-10">
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-slate-200" />
      <div className="space-y-12">
        {items.map((item, idx) => (
          <div key={item.year} className="grid md:grid-cols-2 gap-8 items-center">
            <div className={idx % 2 === 0 ? 'md:order-1 text-right' : 'md:order-2 text-left'}>
              <div className="inline-block rounded-xl bg-white p-6 shadow-md border border-slate-100 max-w-sm">
                <div className="text-sm font-bold text-primary">{item.year}</div>
                <div className="mt-1 text-lg font-bold text-slate-900">{item.title}</div>
                <div className="mt-2 text-slate-600">{item.text}</div>
              </div>
            </div>
            <div className={idx % 2 === 0 ? 'md:order-2 pl-4' : 'md:order-1 pr-4 text-right'}>
              {/* Dot on the line */}
              <div className="absolute left-[50%] -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-primary shadow-sm" style={{ marginTop: '-8px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
