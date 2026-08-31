import serviceTree from '../../data/service-tree.json'

type TreeService = { slug: string; hasCopy?: boolean }
type TreeSubcategory = { slug: string; services: TreeService[] }
type TreeCategory = { slug: string; subcategories: TreeSubcategory[] }
type TreeModule = { slug: string; categories: TreeCategory[] }

const modules = (serviceTree as { modules: TreeModule[] }).modules

const serviceSlugsWithCopy = new Set<string>()
const subcategorySlugsWithCopy = new Set<string>()
const categorySlugsWithCopy = new Set<string>()
const moduleSlugsWithCopy = new Set<string>()

for (const mod of modules) {
  let moduleVisible = false
  for (const cat of mod.categories) {
    let categoryVisible = false
    for (const sub of cat.subcategories) {
      const visibleServices = sub.services.filter((svc) => svc.hasCopy)
      if (visibleServices.length === 0) continue
      subcategorySlugsWithCopy.add(sub.slug)
      categoryVisible = true
      for (const svc of visibleServices) {
        serviceSlugsWithCopy.add(svc.slug)
      }
    }
    if (categoryVisible) {
      categorySlugsWithCopy.add(cat.slug)
      moduleVisible = true
    }
  }
  if (moduleVisible) {
    moduleSlugsWithCopy.add(mod.slug)
  }
}

/** Excel + Word doc + seed pipeline: service page is allowed when hasCopy is true. */
export function isPublishedServiceSlug(slug?: string | null) {
  if (!slug) return false
  return serviceSlugsWithCopy.has(slug)
}

export function isPublishedSubcategorySlug(slug?: string | null) {
  if (!slug) return false
  return subcategorySlugsWithCopy.has(slug)
}

export function isPublishedCategorySlug(slug?: string | null) {
  if (!slug) return false
  return categorySlugsWithCopy.has(slug)
}

export function isPublishedModuleSlug(slug?: string | null) {
  if (!slug) return false
  return moduleSlugsWithCopy.has(slug)
}
