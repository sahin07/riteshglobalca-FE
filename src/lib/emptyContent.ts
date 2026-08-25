import emptyLists from './empty-services.json'

const emptyServiceSlugs = new Set(emptyLists.services)
const emptySubcategorySlugs = new Set(emptyLists.subcategories)

/** Hide taxonomy/services that have no Word-doc copy yet. */
export function isEmptyContentServiceSlug(slug?: string | null) {
  if (!slug) return false
  return emptyServiceSlugs.has(slug)
}

export function isEmptyContentSubcategorySlug(slug?: string | null) {
  if (!slug) return false
  return emptySubcategorySlugs.has(slug)
}
