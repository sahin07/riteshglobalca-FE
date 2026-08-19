import Link from 'next/link'

type Crumb = { label: string; href?: string }
type ChildLink = { title: string; href: string; description?: string }

export function TaxonomyLanding({
  eyebrow,
  title,
  intro,
  description,
  crumbs,
  children,
}: {
  eyebrow?: string
  title: string
  intro?: string | null
  description?: string | null
  crumbs: Crumb[]
  children: ChildLink[]
}) {
  return (
    <main className="min-h-screen bg-[#f8f9fa]">
      <section className="relative overflow-hidden min-h-[280px] md:min-h-[340px] flex items-center bg-[#0b293d]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b293d] via-[#0b293d]/90 to-[#003B49]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(242,142,43,0.18)_0%,_transparent_50%)]" />
        <div className="relative container-prose px-4 md:px-8 mx-auto max-w-6xl w-full py-16">
          <nav className="flex flex-wrap gap-2 text-[12px] uppercase tracking-wider text-slate-300 mb-6">
            {crumbs.map((crumb, i) => (
              <span key={`${crumb.label}-${i}`} className="flex items-center gap-2">
                {i > 0 && <span className="text-slate-500">/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white">{crumb.label}</Link>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
          {eyebrow && (
            <p className="text-[#F19020] text-[12px] font-bold tracking-[0.16em] uppercase mb-3">{eyebrow}</p>
          )}
          <h1 className="text-[32px] md:text-[44px] font-bold text-white leading-tight max-w-3xl">{title}</h1>
          {intro && (
            <p className="mt-4 text-[16px] md:text-[18px] text-slate-200 font-light max-w-2xl leading-relaxed">{intro}</p>
          )}
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          {description && (
            <div className="max-w-3xl text-[15px] text-slate-600 leading-relaxed mb-12 whitespace-pre-line">
              {description}
            </div>
          )}
          {children.length === 0 ? (
            <p className="text-slate-500">Content for this level will be added soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="group bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#F19020]/40 transition-all"
                >
                  <h2 className="text-[17px] font-semibold text-[#0b293d] group-hover:text-[#F19020] transition-colors">
                    {child.title}
                  </h2>
                  {child.description && (
                    <p className="mt-2 text-[13px] text-slate-500 line-clamp-3">{child.description}</p>
                  )}
                  <span className="mt-4 inline-flex text-[13px] font-medium text-[#F19020]">View →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
