import Link from 'next/link'
import clsx from 'clsx'
import { StrapiFooter } from '@/lib/strapi'
import { HIDE_BLOGS, isBlogNavLink } from '@/lib/hideBlogs'

function filterFooterLinks(links?: { id: number; label: string; url: string }[]) {
  if (!links) return links
  if (!HIDE_BLOGS) return links
  return links.filter(l => !isBlogNavLink(l.label, l.url))
}

export function Footer({ className, footer }: { className?: string, footer?: StrapiFooter | null }) {
  const brandName = footer?.brandName || 'Ritesh Arora & Associates';
  const description = footer?.description || 'We support founders, professionals, and businesses with reliable tax filing, GST, company registration, and ongoing compliance services.';
  const socialOrDefault = (value: string | undefined, fallback: string) =>
    value && value !== '#' ? value : fallback
  const facebookUrl = socialOrDefault(footer?.facebookUrl, 'https://www.facebook.com/@RiteshAroraAssociates/')
  const instagramUrl = socialOrDefault(footer?.instagramUrl, 'https://www.instagram.com/ritesharoraassociates')
  const twitterUrl = socialOrDefault(footer?.twitterUrl, 'https://x.com/riteshglobalca')
  const youtubeUrl = socialOrDefault(footer?.youtubeUrl, 'https://youtube.com/@gstupskilling')
  const threadsUrl = socialOrDefault(footer?.threadsUrl, 'https://www.threads.com/@ritesharoraassociates')
  const socialLinkClass =
    'w-[30px] h-[30px] flex items-center justify-center rounded-[6px] bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors'
  const quickLinks = filterFooterLinks(footer?.quickLinks)
  const resourcesLinks = filterFooterLinks(footer?.resourcesLinks)
  const servicesLinks = filterFooterLinks(footer?.servicesLinks)
  return (
    <footer className={clsx('relative overflow-hidden bg-[#0b293d] py-10 sm:py-12 md:py-16', className)}>
      {/* Same gradient used on Insights / home navy sections */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b293d] via-[#0b293d]/90 to-[#003B49]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(241,144,32,0.18)_0%,_transparent_50%)]" />
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">

          {/* Brand & Description */}
          <div className="md:col-span-4 lg:col-span-4 text-center md:text-left">
            <Link href="/" className="inline-block mb-5">
              <img
                src="/images/Asset%2017@4x.png"
                alt={brandName}
                className="h-16 md:h-20 w-auto max-w-[220px] object-contain mx-auto md:mx-0"
              />
            </Link>
            <p className="text-slate-300 italic font-light text-[14px] leading-relaxed max-w-[340px] mb-6 mx-auto md:mx-0">
              {description}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={socialLinkClass}>
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
              </a>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={socialLinkClass}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className={socialLinkClass}>
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href={threadsUrl} target="_blank" rel="noopener noreferrer" aria-label="Threads" className={socialLinkClass}>
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.223-8.184-3.574C2.35 18.24 1.5 15.092 1.5 11.25 1.5 5.04 5.76.75 12 .75c5.76 0 10.5 3.84 10.5 9.75 0 4.41-2.64 7.5-6.75 8.25-.18.03-.36-.09-.39-.27-.03-.15.06-.3.21-.36 1.95-.75 3.18-2.55 3.18-5.04 0-4.05-3.06-6.75-7.5-6.75-5.04 0-8.25 3.45-8.25 8.85 0 3.3.99 5.85 2.94 7.59 1.74 1.56 4.14 2.37 7.14 2.4.18 0 .33.15.33.33v.45c0 .18-.15.33-.33.33h-.007zM12 7.5c3.3 0 5.25 1.95 5.25 5.25 0 2.85-1.65 4.65-4.05 4.95-.15.03-.3-.09-.33-.24-.03-.15.06-.3.21-.36 1.2-.45 1.92-1.65 1.92-3.3 0-2.4-1.5-3.9-4.05-3.9-3.15 0-5.25 2.25-5.25 5.7 0 2.55.75 4.5 2.25 5.85 1.35 1.2 3.3 1.8 5.7 1.8.15 0 .3.15.3.3v.45c0 .15-.15.3-.3.3-2.85 0-5.1-.75-6.75-2.25C5.1 18.6 4.2 16.2 4.2 13.2c0-4.05 2.7-6.9 7.05-6.9.24 0 .45.15.45.45s-.21.45-.45.45c-3.6 0-5.7 2.4-5.7 5.85 0 2.7.75 4.8 2.1 6.15 1.2 1.2 3 1.8 5.25 1.8 2.7 0 4.65-.9 5.7-2.55.9-1.35 1.35-3.15 1.35-5.25 0-4.05-2.4-6.75-6.3-6.75-.24 0-.45-.15-.45-.45S11.76 7.5 12 7.5z"/></svg>
              </a>
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={socialLinkClass}>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 lg:col-span-2 lg:pl-6 text-center md:text-left">
            <h4 className="text-white font-medium text-[15px] mb-5">Quick Links</h4>
            <ul className="space-y-3.5">
              {(quickLinks && quickLinks.length > 0) ? (
                quickLinks.map(link => (
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
          <div className="md:col-span-3 lg:col-span-3 lg:pl-6 text-center md:text-left">
            <h4 className="text-white font-medium text-[15px] mb-5">Resources</h4>
            <ul className="space-y-3.5">
              {(resourcesLinks && resourcesLinks.length > 0) ? (
                resourcesLinks.map(link => (
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
          <div className="md:col-span-3 lg:col-span-3 text-center md:text-left">
            <h4 className="text-white font-medium text-[15px] mb-5">Services</h4>
            <ul className="space-y-3.5">
              {(servicesLinks && servicesLinks.length > 0) ? (
                servicesLinks.map(link => (
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

        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-[13px] text-slate-400 font-light">
            {`© ${new Date().getFullYear()} ${brandName}. All rights reserved.`}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-5 gap-y-2 text-[13px] text-slate-400 font-light">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/insights" className="hover:text-white transition-colors">Insights</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
