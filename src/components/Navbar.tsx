// 'use client'
// import Link from 'next/link'
// import { useState } from 'react'

// import { StrapiService, StrapiServiceCategory, StrapiMainModule, StrapiServiceSubcategory } from '@/lib/strapi'

// export function Navbar({ 
//   mainModules = [],
//   categories = [],
//   subcategories = [],
//   services = []
// }: { 
//   mainModules?: StrapiMainModule[],
//   categories?: StrapiServiceCategory[],
//   subcategories?: StrapiServiceSubcategory[],
//   services?: StrapiService[] 
// }) {
//   const [open, setOpen] = useState(false)
//   const [activeMainModuleId, setActiveMainModuleId] = useState<number | null>(null)
//   const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
//   const [activeSubcategoryId, setActiveSubcategoryId] = useState<number | null>(null)
//   const [activeServiceId, setActiveServiceId] = useState<number | null>(null)

//   // Fallback mock data if the Strapi database is empty (or blocked by 401 error)
//   const safeMainModules = mainModules.length > 0 ? mainModules : [{ id: 1, title: 'Mock Module' } as any];
//   const safeCategories = categories.length > 0 ? categories : [{ id: 1, mainModule: { id: 1 }, title: '1.2 Direct Tax Services' } as any];
//   const safeSubcategories = subcategories.length > 0 ? subcategories : [{ id: 1, category: { id: 1 }, title: '1.1.1 GST Services' } as any];
//   const safeServices = services.length > 0 ? services : [
//     { id: 1, subcategory: { id: 1 }, title: 'GST Registration & Filing', slug: 'gst-registration' } as any,
//     { id: 2, subcategory: { id: 1 }, title: 'Company Incorporation', slug: 'company-incorporation' } as any
//   ];

//   // 1. Resolve Active Main Module
//   const activeMainModule = safeMainModules.find(m => m.id === activeMainModuleId) || safeMainModules[0] || null;

//   // 2. Dynamically filter Categories that belong to the Active Main Module
//   const activeCategories = safeCategories.filter(c => c.mainModule?.id === activeMainModule?.id);
//   const activeCategory = activeCategories.find(c => c.id === activeCategoryId) || activeCategories[0] || null;

//   // 3. Dynamically filter Subcategories that belong to the Active Category
//   const activeSubcategories = safeSubcategories.filter(s => s.category?.id === activeCategory?.id);
//   const activeSubcategory = activeSubcategories.find(s => s.id === activeSubcategoryId) || activeSubcategories[0] || null;

//   // 4. Dynamically filter Services that belong to the Active Subcategory
//   const activeServices = safeServices.filter(s => s.subcategory?.id === activeSubcategory?.id);
//   const activeService = activeServices.find(s => s.id === activeServiceId) || activeServices[0] || null;

//   return (
//     <header className="fixed w-full top-0 z-50 bg-[#f8f9fa] border-b border-gray-200 shadow-sm">
//       <div className="max-w-[1400px] mx-auto py-3 flex items-center justify-between px-4 lg:px-8">

//         {/* Left: Logo */}
//         <div className="flex items-center">
//           <Link href="/" className="flex flex-col items-center">
//             <div className="text-brand-dark text-xl lg:text-[22px] font-serif leading-none tracking-wide flex items-center">
//               <span>RITESH</span>
//               <span className="relative flex items-center justify-center w-[20px] h-[24px] mx-[3px] -mt-[2px]">
//                 <svg viewBox="0 0 24 24" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
//                   <path d="M12 2 L3 22" stroke="#F19020" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
//                   <path d="M12 2 L21 22" stroke="#003B49" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//               </span>
//               <span>RORA &</span>
//             </div>
//             <div className="text-brand-dark text-xl lg:text-[22px] font-serif leading-none tracking-wide mt-1.5">
//               ASSOCIATES
//             </div>
//             <div className="w-full h-[1px] bg-[#F19020] mt-2 mb-1.5 opacity-60"></div>
//             <div className="text-[#F19020] text-[9px] lg:text-[10px] tracking-[0.15em] uppercase font-medium">
//               Chartered Accountants
//             </div>
//           </Link>
//         </div>

//         {/* Mobile menu button */}
//         <button
//           className="lg:hidden text-brand-dark p-2 hover:bg-gray-200 rounded-md transition-colors ml-auto"
//           onClick={() => setOpen(!open)}
//           aria-label="Toggle menu"
//         >
//           <svg width="24" height="24" viewBox="0 0 24 24">
//             <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
//           </svg>
//         </button>

//         {/* Middle: Search Bar (Desktop) */}
//         <div className="hidden lg:flex items-center flex-1 max-w-[400px] ml-12 xl:ml-20">
//           <div className="relative w-full">
//             <svg
//               width="18" height="18" viewBox="0 0 24 24"
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//             >
//               <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
//               <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
//             </svg>
//             <input
//               type="text"
//               placeholder="Pages..."
//               className="w-full h-[42px] pl-12 pr-4 bg-transparent border border-gray-400 rounded-full text-sm text-brand-dark placeholder-gray-400 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-shadow"
//             />
//           </div>
//         </div>

//         {/* Right: Nav Links (Desktop) */}
//         <nav className="hidden lg:flex items-center gap-5 xl:gap-8 ml-auto">
//           <Link href="/" className="text-slate-600 hover:text-brand-dark transition-colors text-[15px]">Home</Link>
//           <Link href="/about" className="text-slate-600 hover:text-brand-dark transition-colors text-[15px]">About</Link>

//           {/* Services Dropdown */}
//           <div className="relative group">
//             <Link href="/services" className="text-slate-600 group-hover:text-brand-dark transition-colors text-[15px] flex items-center gap-1 py-4">
//               Services
//               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:rotate-180"><path d="M6 9l6 6 6-6" /></svg>
//             </Link>

//             <div className="absolute left-1/2 -translate-x-1/2 top-full w-[1100px] max-w-[95vw] bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
//               <div className="flex h-[450px]">
//                 {/* Column 1: Main Modules */}
//                 <div className="w-1/4 bg-white border-r border-gray-100 flex flex-col pt-6">
//                   <div className="px-6 mb-4 text-[13px] font-bold text-gray-400 tracking-wider uppercase bg-gray-100 mx-4 py-2 rounded">
//                     MAIN MODULES
//                   </div>
//                   <div className="flex-1 overflow-y-auto pb-4">
//                     {safeMainModules.map((module, mIdx) => {
//                       const isActive = activeMainModule?.id === module.id;
//                       return (
//                         <div
//                           key={module.id || mIdx}
//                           onMouseEnter={() => {
//                             setActiveMainModuleId(module.id);
//                             setActiveCategoryId(null);
//                             setActiveSubcategoryId(null);
//                             setActiveServiceId(null);
//                           }}
//                           className={`mx-4 px-4 py-2.5 mb-1 cursor-pointer flex justify-between items-center rounded transition-colors duration-200 ${isActive ? 'bg-gray-800 text-white font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
//                         >
//                           <span className="text-[14px] truncate pr-2">{module.title}</span>
//                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`flex-shrink-0 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}><path d="M9 18l6-6-6-6" /></svg>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 </div>

//                 {/* Column 2: Categories */}
//                 <div className="w-1/4 bg-white border-r border-gray-100 flex flex-col pt-6">
//                   <div className="px-6 mb-4 text-[13px] font-bold text-gray-400 tracking-wider uppercase bg-gray-100 mx-4 py-2 rounded">
//                     CATEGORIES
//                   </div>
//                   <div className="flex-1 overflow-y-auto pb-4">
//                     {activeCategories.map((cat, cIdx) => {
//                       const isActive = activeCategory?.id === cat.id;
//                       return (
//                         <div
//                           key={cat.id || cIdx}
//                           onMouseEnter={() => {
//                             setActiveCategoryId(cat.id);
//                             setActiveSubcategoryId(null);
//                             setActiveServiceId(null);
//                           }}
//                           className={`mx-4 px-4 py-2.5 mb-1 cursor-pointer flex justify-between items-center rounded transition-colors duration-200 ${isActive ? 'bg-[#e53e3e] text-white font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
//                         >
//                           <span className="text-[14px] truncate pr-2">{cat.title}</span>
//                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`flex-shrink-0 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}><path d="M9 18l6-6-6-6" /></svg>
//                         </div>
//                       )
//                     })}
//                     {activeCategories.length === 0 && (
//                       <div className="px-8 text-gray-400 text-sm italic">No categories</div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Column 3: Subcategories */}
//                 <div className="w-1/4 bg-white border-r border-gray-100 flex flex-col pt-6">
//                   <div className="px-6 mb-4 text-[13px] font-bold text-gray-400 tracking-wider uppercase bg-gray-100 mx-4 py-2 rounded">
//                     SUBCATEGORIES
//                   </div>
//                   <div className="flex-1 overflow-y-auto pb-4">
//                     {activeSubcategories.map((sub, sIdx) => {
//                       const isActive = activeSubcategory?.id === sub.id;
//                       return (
//                         <div
//                           key={sub.id || sIdx}
//                           onMouseEnter={() => {
//                             setActiveSubcategoryId(sub.id);
//                             setActiveServiceId(null);
//                           }}
//                           className={`mx-4 px-4 py-2.5 mb-1 cursor-pointer flex justify-between items-center rounded transition-colors duration-200 ${isActive ? 'bg-[#e53e3e] text-white font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
//                         >
//                           <span className="text-[14px] truncate pr-2">{sub.title}</span>
//                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`flex-shrink-0 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}><path d="M9 18l6-6-6-6" /></svg>
//                         </div>
//                       )
//                     })}
//                     {activeSubcategories.length === 0 && (
//                       <div className="px-8 text-gray-400 text-sm italic">No subcategories</div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Column 4: Services */}
//                 <div className="w-1/4 bg-white flex flex-col pt-6">
//                   <div className="px-6 mb-4 text-[13px] font-bold text-gray-400 tracking-wider uppercase bg-gray-100 mx-4 py-2 rounded">
//                     SERVICES
//                   </div>
//                   <div className="flex-1 overflow-y-auto pb-4">
//                     {activeServices.map((srv, sIdx) => {
//                       const isActive = activeService?.id === srv.id;
//                       return (
//                         <div
//                           key={srv.id || sIdx}
//                           onMouseEnter={() => setActiveServiceId(srv.id)}
//                           className={`mx-4 px-4 py-2.5 mb-1 cursor-pointer flex justify-between items-center rounded transition-all duration-200 ${isActive ? 'bg-[#f28e2b] text-white font-medium border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]' : 'text-gray-700 hover:bg-gray-50'}`}
//                         >
//                           <Link href={`/services/${srv.slug}`} className="w-full text-[14px] truncate block">
//                             {srv.title}
//                           </Link>
//                         </div>
//                       )
//                     })}
//                     {activeServices.length === 0 && (
//                       <div className="px-8 text-gray-400 text-sm italic">No services</div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//       <Link href="/blog" className="text-slate-600 hover:text-brand-dark transition-colors text-[15px]">Blog</Link>
//           <Link href="/pricing" className="text-slate-600 hover:text-brand-dark transition-colors text-[15px]">Pricing</Link>
//           <Link href="/careers" className="text-slate-600 hover:text-brand-dark transition-colors text-[15px]">Careers</Link>
//           <Link href="/contact" className="text-slate-600 hover:text-brand-dark transition-colors text-[15px]">Contact</Link>
//         </nav>
//       </div>

//       {/* Mobile Menu */}
//       {open && (
//         <div className="lg:hidden bg-[#f8f9fa] border-t border-gray-200 py-4 px-4 flex flex-col gap-4 shadow-lg absolute w-full left-0">
//           <div className="relative w-full">
//             <svg
//               width="18" height="18" viewBox="0 0 24 24"
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
//             >
//               <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
//               <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
//             </svg>
//             <input
//               type="text"
//               placeholder="Pages..."
//               className="w-full h-10 pl-12 pr-4 bg-transparent border border-gray-400 rounded-full text-sm text-brand-dark placeholder-gray-400 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
//             />
//           </div>
//           <Link href="/" className="text-slate-600 hover:text-brand-dark transition-colors px-2 py-1 font-medium" onClick={() => setOpen(false)}>Home</Link>
//           <Link href="/about" className="text-slate-600 hover:text-brand-dark transition-colors px-2 py-1 font-medium" onClick={() => setOpen(false)}>About</Link>

//           <div className="flex flex-col">
//             <Link href="/services" className="text-slate-600 hover:text-brand-dark transition-colors px-2 py-1 font-medium" onClick={() => setOpen(false)}>Services</Link>
//             <div className="pl-4 flex flex-col gap-2 mt-2 border-l-2 border-gray-200 ml-3">
//               {displayServices.map((service, idx) => (
//                 <Link
//                   key={idx}
//                   href={service.href}
//                   className="text-slate-500 hover:text-[#F19020] transition-colors text-[14px] py-1"
//                   onClick={() => setOpen(false)}
//                 >
//                   {service.title}
//                 </Link>
//               ))}
//             </div>
//           </div>

//           <Link href="/blog" className="text-slate-600 hover:text-brand-dark transition-colors px-2 py-1 font-medium" onClick={() => setOpen(false)}>Blog</Link>
//           <Link href="/pricing" className="text-slate-600 hover:text-brand-dark transition-colors px-2 py-1 font-medium" onClick={() => setOpen(false)}>Pricing</Link>
//           <Link href="/careers" className="text-slate-600 hover:text-brand-dark transition-colors px-2 py-1 font-medium" onClick={() => setOpen(false)}>Careers</Link>
//           <Link href="/contact" className="text-slate-600 hover:text-brand-dark transition-colors px-2 py-1 font-medium" onClick={() => setOpen(false)}>Contact</Link>
//         </div>
//       )}
//     </header>
//   )
// }
'use client'
import Link from 'next/link'
import { useState } from 'react'

import { StrapiService, StrapiServiceCategory, StrapiMainModule, StrapiServiceSubcategory, StrapiBlogPost, StrapiHeader, getStrapiMedia } from '@/lib/strapi'
import { DesktopPracticeNav } from '@/components/PracticeMegaNav'
import { moduleHref, serviceHref } from '@/lib/serviceHierarchy'
import { HIDE_BLOGS, isBlogNavLink } from '@/lib/hideBlogs'

export function Navbar({
  mainModules = [],
  categories = [],
  subcategories = [],
  services = [],
  blogs = [],
  header = null
}: {
  mainModules?: StrapiMainModule[],
  categories?: StrapiServiceCategory[],
  subcategories?: StrapiServiceSubcategory[],
  services?: StrapiService[],
  blogs?: StrapiBlogPost[],
  header?: StrapiHeader | null
}) {
  const [open, setOpen] = useState(false)

  // ── Search State ──────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // ── Mobile accordion state ────────────────────────────────────────────────
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [mobileActiveModuleId, setMobileActiveModuleId] = useState<number | null>(null)
  const [mobileActiveCategoryId, setMobileActiveCategoryId] = useState<number | null>(null)
  const [mobileActiveSubcategoryId, setMobileActiveSubcategoryId] = useState<number | null>(null)

  const safeMainModules = mainModules
  const safeCategories = categories
  const safeSubcategories = subcategories
  const safeServices = services

  // ── Process header links to include FAQ ──────────────────────────────────
  const processedNavLinks = (() => {
    if (!header?.navLinks || header.navLinks.length === 0) return null
    let links = [...header.navLinks]
    if (HIDE_BLOGS) {
      links = links.filter(l => !isBlogNavLink(l.label, l.url))
    }
    const hasFaq = links.some(l => l.url === '/faq' || l.label.toLowerCase() === 'faq')
    if (!hasFaq) {
      const contactIdx = links.findIndex(l => l.label.toLowerCase() === 'contact')
      if (contactIdx !== -1) {
        links.splice(contactIdx, 0, { id: 999, label: 'FAQ', url: '/faq' })
      } else {
        links.push({ id: 999, label: 'FAQ', url: '/faq' })
      }
    }
    return links
  })()

  // ── Search Logic ──────────────────────────────────────────────────────────
  const filteredServices = searchQuery.trim() === '' ? [] : safeServices.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredBlogs =
    HIDE_BLOGS || searchQuery.trim() === ''
      ? []
      : blogs.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()))
  const hasSearchResults = filteredServices.length > 0 || filteredBlogs.length > 0

  const toggleMobileModule = (id: number) => {
    setMobileActiveModuleId(prev => prev === id ? null : id)
    setMobileActiveCategoryId(null)
    setMobileActiveSubcategoryId(null)
  }
  const toggleMobileCategory = (id: number) => {
    setMobileActiveCategoryId(prev => prev === id ? null : id)
    setMobileActiveSubcategoryId(null)
  }
  const toggleMobileSubcategory = (id: number) => {
    setMobileActiveSubcategoryId(prev => prev === id ? null : id)
  }

  return (
    <header className="fixed w-full top-0 z-[60] bg-[#ffffff] border-b border-gray-200 shadow-sm has-[.services-menu.is-open]:border-b-white has-[.services-menu.is-open]:shadow-none">
      <div className="relative max-w-[1400px] mx-auto py-3 flex items-center justify-between px-4 lg:px-8">

        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex flex-col items-center">
            {header?.logo?.url ? (
              <img src={getStrapiMedia(header.logo.url) || "/logo.png"} alt="Logo" className="h-20 w-auto" />
            ) : (
              <img src="/logo.png" alt="Logo" className="h-20 w-auto" />
            )}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-brand-dark p-2 hover:bg-gray-200 rounded-md transition-colors ml-auto"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          )}
        </button>

        {/* Desktop: Search */}
        <div className="hidden lg:flex items-center flex-1 max-w-[180px] xl:max-w-[300px] 2xl:max-w-[400px] ml-6 xl:ml-12 relative">
          <div className="relative w-full">
            <svg width="18" height="18" viewBox="0 0 24 24" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full h-[42px] pl-12 pr-4 bg-transparent border border-gray-400 rounded-full text-sm text-brand-dark placeholder-gray-400 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-shadow"
            />
          </div>

          {/* Desktop Search Results Dropdown */}
          {isSearchFocused && searchQuery.trim() !== '' && (
            <div
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-xl rounded-xl max-h-[400px] overflow-y-auto z-[60] p-2"
              onMouseDown={(e) => e.preventDefault()}
            >
              {filteredServices.length > 0 && (
                <div className="mb-3">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 tracking-wider uppercase">Services</div>
                  {filteredServices.map(srv => (
                    <Link
                      key={`srv-${srv.id}`}
                      href={`/services/${srv.slug}`}
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearchFocused(false);
                      }}
                      className="block px-3 py-2 text-[14px] text-gray-700 hover:bg-orange-50 hover:text-brand-orange rounded-md transition-colors"
                    >
                      {srv.title}
                    </Link>
                  ))}
                </div>
              )}
              {filteredBlogs.length > 0 && (
                <div className="mb-3">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 tracking-wider uppercase">Blogs</div>
                  {filteredBlogs.map(blog => (
                    <Link
                      key={`blog-${blog.id}`}
                      href={`/blog/${blog.slug}`}
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearchFocused(false);
                      }}
                      className="block px-3 py-2 text-[14px] text-gray-700 hover:bg-orange-50 hover:text-brand-orange rounded-md transition-colors"
                    >
                      {blog.title}
                    </Link>
                  ))}
                </div>
              )}
              {!hasSearchResults && (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">No results found</div>
              )}
            </div>
          )}
        </div>

        {/* Desktop: Nav links */}
        <nav className="hidden lg:flex items-center self-stretch gap-3 xl:gap-6 2xl:gap-8 ml-auto mr-6 xl:mr-12">
          {processedNavLinks && processedNavLinks.length > 0 ? (
            processedNavLinks.map((link, idx) => {
              if (link.label.toLowerCase() === 'services') {
                return (
                  <DesktopPracticeNav
                    key={`desk-nav-${idx}`}
                    modules={safeMainModules}
                    categories={safeCategories}
                    subcategories={safeSubcategories}
                    services={safeServices}
                  />
                )
              }
              return (
                <Link key={`desk-nav-${idx}`} href={link.url} className="text-slate-600 hover:text-brand-dark transition-colors text-[14px] xl:text-[15px]">
                  {link.label}
                </Link>
              )
            })
          ) : (
            <>
              <Link href="/" className="text-slate-600 hover:text-brand-dark transition-colors text-[14px] xl:text-[15px]">Home</Link>
              <Link href="/about" className="text-slate-600 hover:text-brand-dark transition-colors text-[14px] xl:text-[15px]">About</Link>
              <DesktopPracticeNav
                modules={safeMainModules}
                categories={safeCategories}
                subcategories={safeSubcategories}
                services={safeServices}
              />

              {!HIDE_BLOGS && (
                <Link href="/blog" className="text-slate-600 hover:text-brand-dark transition-colors text-[14px] xl:text-[15px]">Blog</Link>
              )}
              <Link href="/pricing" className="text-slate-600 hover:text-brand-dark transition-colors text-[14px] xl:text-[15px]">Pricing</Link>
              <Link href="/careers" className="text-slate-600 hover:text-brand-dark transition-colors text-[14px] xl:text-[15px]">Careers</Link>
              <Link href="/faq" className="text-slate-600 hover:text-brand-dark transition-colors text-[14px] xl:text-[15px]">FAQ</Link>
              <Link href="/contact" className="text-slate-600 hover:text-brand-dark transition-colors text-[14px] xl:text-[15px]">Contact</Link>
            </>
          )}
        </nav>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────────────────────── */}
      {open && (
        <div className="lg:hidden bg-[#f8f9fa] border-t border-gray-200 shadow-lg absolute w-full left-0 max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 flex flex-col gap-1">

            {/* Mobile search */}
            <div className="relative w-full mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-12 pr-4 bg-transparent border border-gray-400 rounded-full text-sm text-brand-dark placeholder-gray-400 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
              />
            </div>

            {/* Mobile Search Results */}
            {searchQuery.trim() !== '' && (
              <div className="mb-4 bg-white border border-gray-100 rounded-lg p-2 shadow-sm max-h-[300px] overflow-y-auto">
                {filteredServices.length > 0 && (
                  <div className="mb-2">
                    <div className="px-2 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Services</div>
                    {filteredServices.map(srv => (
                      <Link
                        key={`m-srv-${srv.id}`}
                        href={`/services/${srv.slug}`}
                        onClick={() => {
                          setOpen(false);
                          setSearchQuery('');
                        }}
                        className="block px-2 py-1.5 text-[14px] text-gray-700 hover:text-brand-orange"
                      >
                        {srv.title}
                      </Link>
                    ))}
                  </div>
                )}
                {filteredBlogs.length > 0 && (
                  <div className="mb-2">
                    <div className="px-2 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Blogs</div>
                    {filteredBlogs.map(blog => (
                      <Link
                        key={`m-blog-${blog.id}`}
                        href={`/blog/${blog.slug}`}
                        onClick={() => {
                          setOpen(false);
                          setSearchQuery('');
                        }}
                        className="block px-2 py-1.5 text-[14px] text-gray-700 hover:text-brand-orange"
                      >
                        {blog.title}
                      </Link>
                    ))}
                  </div>
                )}
                {!hasSearchResults && (
                  <div className="px-2 py-3 text-sm text-gray-500 text-center">No results found</div>
                )}
              </div>
            )}

            {processedNavLinks && processedNavLinks.length > 0 ? (
              processedNavLinks.map((link, idx) => {
                if (link.label.toLowerCase() === 'services') {
                  return (
                    <MobileServicesAccordion
                      key={`m-nav-${idx}`}
                      modules={safeMainModules}
                      categories={safeCategories}
                      subcategories={safeSubcategories}
                      services={safeServices}
                      servicesOpen={mobileServicesOpen}
                      onToggleServices={() => setMobileServicesOpen(prev => !prev)}
                      activeModuleId={mobileActiveModuleId}
                      activeCategoryId={mobileActiveCategoryId}
                      activeSubcategoryId={mobileActiveSubcategoryId}
                      onToggleModule={toggleMobileModule}
                      onToggleCategory={toggleMobileCategory}
                      onToggleSubcategory={toggleMobileSubcategory}
                      onClose={() => setOpen(false)}
                    />
                  )
                }
                return (
                  <MobileNavLink key={`m-nav-${idx}`} href={link.url} label={link.label} onClick={() => setOpen(false)} />
                )
              })
            ) : (
              <>
                <MobileNavLink href="/" label="Home" onClick={() => setOpen(false)} />
                <MobileNavLink href="/about" label="About" onClick={() => setOpen(false)} />
                <MobileServicesAccordion
                  modules={safeMainModules}
                  categories={safeCategories}
                  subcategories={safeSubcategories}
                  services={safeServices}
                  servicesOpen={mobileServicesOpen}
                  onToggleServices={() => setMobileServicesOpen(prev => !prev)}
                  activeModuleId={mobileActiveModuleId}
                  activeCategoryId={mobileActiveCategoryId}
                  activeSubcategoryId={mobileActiveSubcategoryId}
                  onToggleModule={toggleMobileModule}
                  onToggleCategory={toggleMobileCategory}
                  onToggleSubcategory={toggleMobileSubcategory}
                  onClose={() => setOpen(false)}
                />
                {!HIDE_BLOGS && (
                  <MobileNavLink href="/blog" label="Blog" onClick={() => setOpen(false)} />
                )}
                <MobileNavLink href="/pricing" label="Pricing" onClick={() => setOpen(false)} />
                <MobileNavLink href="/careers" label="Careers" onClick={() => setOpen(false)} />
                <MobileNavLink href="/faq" label="FAQ" onClick={() => setOpen(false)} />
                <MobileNavLink href="/contact" label="Contact" onClick={() => setOpen(false)} />
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-2 py-3 text-[15px] font-medium text-slate-600 hover:text-brand-dark border-b border-gray-100 transition-colors"
    >
      {label}
    </Link>
  )
}

function MobileServicesAccordion({
  modules,
  categories,
  subcategories,
  services,
  servicesOpen,
  onToggleServices,
  activeModuleId,
  activeCategoryId,
  activeSubcategoryId,
  onToggleModule,
  onToggleCategory,
  onToggleSubcategory,
  onClose,
}: {
  modules: StrapiMainModule[]
  categories: StrapiServiceCategory[]
  subcategories: StrapiServiceSubcategory[]
  services: StrapiService[]
  servicesOpen: boolean
  onToggleServices: () => void
  activeModuleId: number | null
  activeCategoryId: number | null
  activeSubcategoryId: number | null
  onToggleModule: (id: number) => void
  onToggleCategory: (id: number) => void
  onToggleSubcategory: (id: number) => void
  onClose: () => void
}) {
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={onToggleServices}
        className="w-full flex items-center justify-between px-2 py-3 text-[15px] font-medium text-slate-600 hover:text-brand-dark"
      >
        <Link href="/services" onClick={e => { e.stopPropagation(); onClose() }} className="hover:text-[#F19020]">Services</Link>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {servicesOpen && (
        <div className="pb-2">
          {modules.map((module) => {
            const isModuleOpen = activeModuleId === module.id
            const moduleCats = categories.filter(c => c.mainModule?.id === module.id)
            return (
              <div key={module.id} className="ml-2 border-l-2 border-gray-200">
                <button
                  onClick={() => onToggleModule(module.id)}
                  className={`w-full flex items-center justify-between pl-4 pr-2 py-2.5 text-[14px] font-medium ${isModuleOpen ? 'text-[#003B49]' : 'text-slate-600'}`}
                >
                  <Link href={moduleHref(module.slug)} onClick={e => { e.stopPropagation(); onClose() }} className="text-left flex-1 hover:text-[#F19020]">{module.title}</Link>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isModuleOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
                </button>
                {isModuleOpen && (
                  <div className="pb-1">
                    {moduleCats.length === 0 && <p className="pl-4 py-2 text-[13px] text-gray-400 italic">No families</p>}
                    {moduleCats.map(cat => {
                      const isCatOpen = activeCategoryId === cat.id
                      const catSubs = subcategories.filter(s => s.category?.id === cat.id)
                      return (
                        <div key={cat.id} className="ml-3 border-l-2 border-gray-100">
                          <button onClick={() => onToggleCategory(cat.id)} className={`w-full flex items-center justify-between pl-4 pr-2 py-2.5 text-[13px] font-medium ${isCatOpen ? 'text-[#e53e3e]' : 'text-gray-500'}`}>
                            <Link href={`/services/${module.slug}/${cat.slug}`} onClick={e => { e.stopPropagation(); onClose() }} className="text-left flex-1">{cat.title}</Link>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isCatOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
                          </button>
                          {isCatOpen && (
                            <div className="ml-3">
                              {catSubs.map(sub => {
                                const isSubOpen = activeSubcategoryId === sub.id
                                const subServices = services.filter(s => s.subcategory?.id === sub.id)
                                return (
                                  <div key={sub.id}>
                                    <button onClick={() => onToggleSubcategory(sub.id)} className={`w-full flex items-center justify-between pl-4 pr-2 py-2 text-[13px] ${isSubOpen ? 'text-[#e53e3e] font-medium' : 'text-gray-500'}`}>
                                      <Link href={`/services/${module.slug}/${cat.slug}/${sub.slug}`} onClick={e => { e.stopPropagation(); onClose() }} className="text-left flex-1">{sub.title}</Link>
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isSubOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
                                    </button>
                                    {isSubOpen && (
                                      <div className="ml-3 pb-1">
                                        {subServices.map(srv => (
                                          <Link key={srv.id} href={serviceHref(srv.slug, { moduleSlug: module.slug, categorySlug: cat.slug, subcategorySlug: sub.slug })} onClick={onClose} className="flex items-center pl-4 pr-2 py-2 text-[13px] text-gray-500 hover:text-[#F19020]">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#F19020] mr-2.5 flex-shrink-0" />
                                            {srv.title}
                                          </Link>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
