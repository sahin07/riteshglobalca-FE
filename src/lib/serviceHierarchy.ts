import {
  StrapiMainModule,
  StrapiService,
  StrapiServiceCategory,
  StrapiServiceSubcategory,
} from './strapi'

/** Excel Content tab: Services in header; MAIN MODULE is mega-menu column 1. */
export function moduleHref(moduleSlug: string) {
  return `/services/${moduleSlug}`
}

export function categoryHref(moduleSlug: string, categorySlug: string) {
  return `/services/${moduleSlug}/${categorySlug}`
}

export function subcategoryHref(moduleSlug: string, categorySlug: string, subcategorySlug: string) {
  return `/services/${moduleSlug}/${categorySlug}/${subcategorySlug}`
}

export function serviceHref(
  serviceSlug: string,
  path?: { moduleSlug: string; categorySlug: string; subcategorySlug: string }
) {
  if (path) {
    return `/services/${path.moduleSlug}/${path.categorySlug}/${path.subcategorySlug}/${serviceSlug}`
  }
  return `/services/${serviceSlug}`
}

export function findServiceAncestors(
  service: StrapiService,
  tree: {
    modules: StrapiMainModule[]
    categories: StrapiServiceCategory[]
    subcategories: StrapiServiceSubcategory[]
  }
) {
  const subId = service.subcategory?.id
  const subSlug = service.subcategory?.slug
  const sub =
    tree.subcategories.find((s) => (subId != null && s.id === subId) || (subSlug && s.slug === subSlug)) || null
  if (!sub) return null
  const cat =
    tree.categories.find(
      (c) => c.id === sub.category?.id || (sub.category?.slug && c.slug === sub.category.slug)
    ) || null
  if (!cat) return null
  const mod =
    tree.modules.find(
      (m) => m.id === cat.mainModule?.id || (cat.mainModule?.slug && m.slug === cat.mainModule.slug)
    ) || null
  if (!mod) return null
  return { module: mod, category: cat, subcategory: sub }
}

export function categoriesForModule(
  categories: StrapiServiceCategory[],
  moduleId: number
) {
  return categories.filter((c) => c.mainModule?.id === moduleId)
}

export function subcategoriesForCategory(
  subcategories: StrapiServiceSubcategory[],
  categoryId: number
) {
  return subcategories.filter((s) => s.category?.id === categoryId)
}

export function servicesForSubcategory(
  services: StrapiService[],
  subcategoryId: number
) {
  return services.filter((s) => s.subcategory?.id === subcategoryId)
}

export function findModule(modules: StrapiMainModule[], slug: string) {
  return modules.find((m) => m.slug === slug) || null
}

export function findCategory(
  categories: StrapiServiceCategory[],
  slug: string,
  moduleId?: number
) {
  return (
    categories.find(
      (c) => c.slug === slug && (moduleId == null || c.mainModule?.id === moduleId)
    ) || null
  )
}

export function findSubcategory(
  subcategories: StrapiServiceSubcategory[],
  slug: string,
  categoryId?: number
) {
  return (
    subcategories.find(
      (s) => s.slug === slug && (categoryId == null || s.category?.id === categoryId)
    ) || null
  )
}
