/**
 * Temporary site-wide articles hide.
 * Flip to false when ready to show Articles again.
 * Does not delete content — only hides UI + routes.
 */
export const HIDE_ARTICLES = true

export function isArticlesHidden() {
  return HIDE_ARTICLES
}

/** CMS nav/footer link that points at articles */
export function isArticleNavLink(label?: string, url?: string) {
  const l = (label || '').toLowerCase()
  const u = (url || '').toLowerCase()
  return l === 'articles' || u.includes('/articles')
}
