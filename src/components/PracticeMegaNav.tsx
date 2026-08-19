'use client'
import Link from 'next/link'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import {
  StrapiMainModule,
  StrapiService,
  StrapiServiceCategory,
  StrapiServiceSubcategory,
} from '@/lib/strapi'
import {
  categoriesForModule,
  categoryHref,
  moduleHref,
  serviceHref,
  servicesForSubcategory,
  subcategoryHref,
  subcategoriesForCategory,
} from '@/lib/serviceHierarchy'

export function DesktopPracticeNav({
  modules,
  categories,
  subcategories,
  services,
}: {
  modules: StrapiMainModule[]
  categories: StrapiServiceCategory[]
  subcategories: StrapiServiceSubcategory[]
  services: StrapiService[]
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()
  const [activeModuleId, setActiveModuleId] = useState<number | null>(modules[0]?.id ?? null)
  const activeModule = modules.find((m) => m.id === activeModuleId) || modules[0] || null
  const moduleCats = activeModule ? categoriesForModule(categories, activeModule.id) : []
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(moduleCats[0]?.id ?? null)
  const activeCategory = moduleCats.find((c) => c.id === activeCategoryId) || moduleCats[0] || null
  const moduleSubs = activeCategory ? subcategoriesForCategory(subcategories, activeCategory.id) : []
  const [activeSubcategoryId, setActiveSubcategoryId] = useState<number | null>(null)
  const activeSubcategory = moduleSubs.find((s) => s.id === activeSubcategoryId) || moduleSubs[0] || null
  const moduleServices = activeSubcategory ? servicesForSubcategory(services, activeSubcategory.id) : []
  const [activeServiceId, setActiveServiceId] = useState<number | null>(null)

  const keepOpen = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setMenuOpen(true)
    if (!activeModuleId && modules[0]) setActiveModuleId(modules[0].id)
  }

  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setMenuOpen(false), 300)
  }

  const closeMenu = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setMenuOpen(false)
  }

  useEffect(() => {
    closeMenu()
  }, [pathname])

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [])

  const selectModule = (id: number) => {
    setActiveModuleId(id)
    setActiveCategoryId(null)
    setActiveSubcategoryId(null)
    setActiveServiceId(null)
  }

  return (
    <div
      className={`services-menu relative self-stretch flex items-center ${menuOpen ? 'is-open' : ''}`}
      onMouseEnter={keepOpen}
      onMouseLeave={closeSoon}
    >
      <Link
        href="/services"
        onClick={closeMenu}
        className={`relative z-[70] flex h-full items-center gap-1 text-[14px] xl:text-[15px] transition-colors ${menuOpen ? 'text-brand-dark' : 'text-slate-600'}`}
      >
        Services
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
      </Link>
      <PracticeMegaMenu
        open={menuOpen}
        modules={modules}
        activeModule={activeModule}
        categories={moduleCats}
        subcategories={moduleSubs}
        services={moduleServices}
        activeModuleId={activeModule?.id ?? null}
        activeCategoryId={activeCategory?.id ?? null}
        activeSubcategoryId={activeSubcategory?.id ?? null}
        activeServiceId={activeServiceId}
        onModule={selectModule}
        onCategory={(id) => { setActiveCategoryId(id); setActiveSubcategoryId(null); setActiveServiceId(null) }}
        onSubcategory={(id) => { setActiveSubcategoryId(id); setActiveServiceId(null) }}
        onService={setActiveServiceId}
        onNavigate={closeMenu}
      />
    </div>
  )
}

function PracticeMegaMenu({
  open,
  modules,
  activeModule,
  categories,
  subcategories,
  services,
  activeModuleId,
  activeCategoryId,
  activeSubcategoryId,
  activeServiceId,
  onModule,
  onCategory,
  onSubcategory,
  onService,
  onNavigate,
}: {
  open: boolean
  modules: StrapiMainModule[]
  activeModule: StrapiMainModule | null
  categories: StrapiServiceCategory[]
  subcategories: StrapiServiceSubcategory[]
  services: StrapiService[]
  activeModuleId: number | null
  activeCategoryId: number | null
  activeSubcategoryId: number | null
  activeServiceId: number | null
  onModule: (id: number) => void
  onCategory: (id: number) => void
  onSubcategory: (id: number) => void
  onService: (id: number) => void
  onNavigate: () => void
}) {
  const category = categories.find((c) => c.id === activeCategoryId) || categories[0] || null
  const subcategory = subcategories.find((s) => s.id === activeSubcategoryId) || subcategories[0] || null
  const moduleSlug = activeModule?.slug || ''

  return (
    <>
      <div
        aria-hidden
        className={`fixed inset-x-0 top-[6.5rem] bottom-0 z-40 pointer-events-none bg-transparent backdrop-blur-0 transition-all duration-300 ${open ? 'visible bg-black/20 backdrop-blur-xl' : 'invisible'}`}
      />
      <div
        aria-hidden
        className={`fixed left-1/2 -translate-x-1/2 top-[5rem] h-14 w-[min(1080px,calc(100vw-2rem))] z-[55] ${open ? 'block' : 'hidden'}`}
      />
      <div className={`fixed left-1/2 -translate-x-1/2 top-[6.5rem] z-50 w-[min(1080px,calc(100vw-2rem))] transition-opacity duration-200 ease-out ${open ? 'visible opacity-100 pointer-events-auto' : 'invisible opacity-0 pointer-events-none'}`}>
        <div className="bg-white border border-t-0 border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
          <div className="grid grid-cols-4">
            <MegaColumn label="Practice">
              {modules.length === 0 && <MegaEmpty text="No practices" />}
              {modules.map((mod) => {
                const isActive = activeModuleId === mod.id
                return (
                  <Link
                    key={mod.id}
                    href={moduleHref(mod.slug)}
                    onClick={onNavigate}
                    onMouseEnter={() => onModule(mod.id)}
                    className={`w-full text-left flex items-start rounded-lg px-3 py-2 text-[13px] leading-snug transition-all duration-200 ${isActive ? 'bg-[#003B49] text-white shadow-sm' : 'text-slate-700 hover:bg-[#003B49]/10'}`}
                  >
                    <span className="flex-1">{mod.menuLabel || mod.title}</span>
                    <MegaChevron active={isActive} />
                  </Link>
                )
              })}
            </MegaColumn>

            <MegaColumn label="Families">
              {categories.length === 0 && <MegaEmpty text="No families" />}
              {categories.map((cat) => {
                const isActive = activeCategoryId === cat.id
                return (
                  <Link
                    key={cat.id}
                    href={categoryHref(moduleSlug, cat.slug)}
                    onClick={onNavigate}
                    onMouseEnter={() => onCategory(cat.id)}
                    className={`w-full text-left flex items-start rounded-lg px-3 py-2 text-[13px] leading-snug transition-all duration-200 ${isActive ? 'bg-[#F19020] text-white shadow-sm' : 'text-slate-700 hover:bg-[#F19020]/10'}`}
                  >
                    <span className="flex-1">{cat.menuLabel || cat.title}</span>
                    <MegaChevron active={isActive} />
                  </Link>
                )
              })}
            </MegaColumn>

            <MegaColumn label="Groups">
              {subcategories.length === 0 && <MegaEmpty text="No groups" />}
              {subcategories.map((sub) => {
                const isActive = activeSubcategoryId === sub.id
                return (
                  <Link
                    key={sub.id}
                    href={category ? subcategoryHref(moduleSlug, category.slug, sub.slug) : '#'}
                    onClick={onNavigate}
                    onMouseEnter={() => onSubcategory(sub.id)}
                    className={`w-full text-left flex items-start rounded-lg px-3 py-2 text-[13px] leading-snug transition-all duration-200 ${isActive ? 'bg-[#003B49] text-white shadow-sm' : 'text-slate-700 hover:bg-[#003B49]/10'}`}
                  >
                    <span className="flex-1">{sub.menuLabel || sub.title}</span>
                    <MegaChevron active={isActive} />
                  </Link>
                )
              })}
            </MegaColumn>

            <MegaColumn label="Services" last>
              {services.length === 0 && <MegaEmpty text="No services" />}
              {services.map((srv) => {
                const isActive = activeServiceId === srv.id
                return (
                  <Link
                    key={srv.id}
                    href={
                      category && subcategory
                        ? serviceHref(srv.slug, {
                            moduleSlug,
                            categorySlug: category.slug,
                            subcategorySlug: subcategory.slug,
                          })
                        : serviceHref(srv.slug)
                    }
                    onClick={onNavigate}
                    onMouseEnter={() => onService(srv.id)}
                    className={`rounded-lg px-3 py-2 text-[13px] leading-snug transition-all duration-200 ${isActive ? 'bg-[#F19020] text-white shadow-sm font-medium' : 'text-slate-700 hover:bg-[#F19020]/10 hover:text-[#003B49]'}`}
                  >
                    {srv.title}
                  </Link>
                )
              })}
            </MegaColumn>
          </div>
        </div>
      </div>
    </>
  )
}

function MegaColumn({
  label,
  children,
  last,
}: {
  label: string
  children: ReactNode
  last?: boolean
}) {
  return (
    <div className={`flex flex-col px-3 py-4 bg-white ${last ? '' : 'border-r border-gray-100'}`}>
      <div className="mb-3 text-[11px] font-bold tracking-[0.16em] uppercase text-slate-500 px-2">
        {label}
      </div>
      <div className="flex flex-col gap-1">
        {children}
      </div>
    </div>
  )
}

function MegaEmpty({ text }: { text: string }) {
  return <p className="px-2 py-3 text-[13px] text-slate-400 italic">{text}</p>
}

function MegaChevron({ active }: { active: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`ml-2 mt-0.5 flex-shrink-0 transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}
