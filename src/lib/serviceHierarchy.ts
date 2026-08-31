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
  const populatedSub = service.subcategory
  const subId = populatedSub?.id
  const subSlug = populatedSub?.slug

  let sub =
    tree.subcategories.find((s) => (subId != null && s.id === subId) || (subSlug && s.slug === subSlug)) ||
    null

  let cat =
    sub != null
      ? tree.categories.find(
          (c) => c.id === sub!.category?.id || (sub!.category?.slug && c.slug === sub!.category!.slug)
        ) || null
      : null

  let mod =
    cat != null
      ? tree.modules.find(
          (m) => m.id === cat!.mainModule?.id || (cat!.mainModule?.slug && m.slug === cat!.mainModule!.slug)
        ) || null
      : null

  // Nav tree is filtered to Excel+doc allowlist; fall back to populated relations for detail pages.
  if (!sub && populatedSub?.slug) {
    sub = {
      id: populatedSub.id,
      documentId: populatedSub.documentId ?? '',
      title: populatedSub.title ?? populatedSub.slug,
      slug: populatedSub.slug,
      category: populatedSub.category ?? undefined,
    }
  }

  if (!cat && populatedSub?.category?.slug) {
    cat = {
      id: populatedSub.category.id,
      documentId: populatedSub.category.documentId ?? '',
      title: populatedSub.category.title ?? populatedSub.category.slug,
      slug: populatedSub.category.slug,
      mainModule: populatedSub.category.mainModule ?? undefined,
    }
  }

  if (!mod && populatedSub?.category?.mainModule?.slug) {
    mod = {
      id: populatedSub.category.mainModule.id,
      documentId: populatedSub.category.mainModule.documentId ?? '',
      title: populatedSub.category.mainModule.title ?? populatedSub.category.mainModule.slug,
      slug: populatedSub.category.mainModule.slug,
    }
  }

  if (!sub || !cat || !mod) return null
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
  subcategoryId: number,
  subcategorySlug?: string
) {
  return services.filter((s) => {
    const sub = s.subcategory
    if (!sub) return false
    if (subcategoryId != null && sub.id === subcategoryId) return true
    if (subcategorySlug && sub.slug === subcategorySlug) return true
    return false
  })
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
