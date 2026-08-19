import hideLists from './hide-docs-123.json'

/**
 * Temporary site-side unpublish for Word docs 1–3.
 * Strapi REST cannot unpublish; flip this to false to show that copy again.
 */
export const HIDE_WORD_DOCS_123 = true

const categorySlugs = new Set(hideLists.categories)
const subcategorySlugs = new Set(hideLists.subcategories)
const serviceSlugs = new Set(hideLists.services)

export function isHiddenServiceSlug(slug?: string | null) {
  if (!HIDE_WORD_DOCS_123 || !slug) return false
  return serviceSlugs.has(slug)
}

export function isHiddenCategorySlug(slug?: string | null) {
  if (!HIDE_WORD_DOCS_123 || !slug) return false
  return categorySlugs.has(slug)
}

export function isHiddenSubcategorySlug(slug?: string | null) {
  if (!HIDE_WORD_DOCS_123 || !slug) return false
  return subcategorySlugs.has(slug)
}
