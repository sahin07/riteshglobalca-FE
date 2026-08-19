import Link from 'next/link'
import clsx from 'clsx'
import { StrapiFooter } from '@/lib/strapi'

export function Footer({ className, footer }: { className?: string, footer?: StrapiFooter | null }) {
  const brandName = footer?.brandName || 'Ritesh Arora & Associates';
  const description = footer?.description || 'We support founders, professionals, and businesses with reliable tax filing, GST, company registration, and ongoing compliance services.';
  const facebookUrl = footer?.facebookUrl || '#';
  const instagramUrl = footer?.instagramUrl || '#';
  const twitterUrl = footer?.twitterUrl || '#';
  console.log('footer?.resourcesLinks===', footer
  )
  return (
    <footer className={clsx('bg-[#0b293d] py-16', className)}>
      <div className="container-prose px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">

          {/* Brand & Description */}
          <div className="md:col-span-4 lg:col-span-4">
            <h3 className="text-white text-[20px] md:text-[22px] font-medium mb-3">
              {brandName}
            </h3>
            <p className="text-slate-300 italic font-light text-[14px] leading-relaxed max-w-[340px] mb-6">
              {description}
            </p>
            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a href={facebookUrl} aria-label="Facebook" className="w-[30px] h-[30px] flex items-center justify-center rounded-[6px] bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors">
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
              </a>
              {/* Instagram */}
              <a href={instagramUrl} aria-label="Instagram" className="w-[30px] h-[30px] flex items-center justify-center rounded-[6px] bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              {/* X / Twitter */}
              <a href={twitterUrl} aria-label="X (Twitter)" className="w-[30px] h-[30px] flex items-center justify-center rounded-[6px] bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 lg:col-span-2 lg:pl-6">
            <h4 className="text-white font-medium text-[15px] mb-5">Quick Links</h4>
            <ul className="space-y-3.5">
              {(footer?.quickLinks && footer.quickLinks.length > 0) ? (
                footer.quickLinks.map(link => (
                  <li key={link.id}><Link className="text-[14px] text-slate-300 hover:text-white transition-colors font-light" href={link.url}>{link.label}</Link></li>
                ))
              ) : (
                <>
                  <li><Link className="text-[14px] text-slate-300 hover:text-white transition-colors font-light" href="/">Home</Link></li>
                  <li><Link className="text-[14px] text-slate-300 hover:text-white transition-colors font-light" href="/about">About</Link></li>
                  <li><Link className="text-[14px] text-slate-300 hover:text-white transition-colors font-light" href="/services">Services</Link></li>
                  <li><Link className="text-[14px] text-slate-300 hover:text-white transition-colors font-light" href="/pricing">Pricing</Link></li>
                  <li><Link className="text-[14px] text-slate-300 hover:text-white transition-colors font-light" href="/contact">Contact</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-3 lg:col-span-3 lg:pl-6">
            <h4 className="text-white font-medium text-[15px] mb-5">Resources</h4>
            <ul className="space-y-3.5">
              {(footer?.resourcesLinks && footer.resourcesLinks.length > 0) ? (
                footer.resourcesLinks.map(link => (
                  <li key={link.id}><Link className="text-[14px] text-slate-300 hover:text-white transition-colors font-light" href={link.url}>{link.label}</Link></li>
                ))
              ) : (
                <>
                  <li><Link className="text-[14px] text-slate-300 hover:text-white transition-colors font-light" href="/">Home</Link></li>
                  <li><Link className="text-[14px] text-slate-300 hover:text-white transition-colors font-light" href="/about">About</Link></li>
                  <li><Link className="text-[14px] text-slate-300 hover:text-white transition-colors font-light" href="/services">Services</Link></li>
                  <li><Link className="text-[14px] text-slate-300 hover:text-white transition-colors font-light" href="/pricing">Pricing</Link></li>
                  <li><Link className="text-[14px] text-slate-300 hover:text-white transition-colors font-light" href="/contact">Contact</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="text-white font-medium text-[15px] mb-5">Services</h4>
            <ul className="space-y-3.5">
              {(footer?.servicesLinks && footer.servicesLinks.length > 0) ? (
                footer.servicesLinks.map(link => (
                  <li key={link.id}><Link className="text-[14px] text-slate-300 hover:text-white transition-colors font-light" href={link.url}>{link.label}</Link></li>
                ))
              ) : (
                <>
                  <li><Link className="text-[14px] text-slate-300 hover:text-white transition-colors font-light" href="/services">Company Incorporation</Link></li>
                  <li><Link className="text-[14px] text-slate-300 hover:text-white transition-colors font-light" href="/services">GST Registration & Filing</Link></li>
                  <li><Link className="text-[14px] text-slate-300 hover:text-white transition-colors font-light" href="/services">Income Tax Advisory</Link></li>
                  <li><Link className="text-[14px] text-slate-300 hover:text-white transition-colors font-light" href="/services">Accounting & Bookkeeping</Link></li>
                  <li><Link className="text-[14px] text-slate-300 hover:text-white transition-colors font-light" href="/services">Audit & Assurance</Link></li>
                  <li><Link className="text-[14px] text-slate-300 hover:text-white transition-colors font-light" href="/services">Business Compliance Management</Link></li>
                </>
              )}
            </ul>
          </div>

        </div>
      </div>
    </footer>
  )
}
