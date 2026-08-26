/**
 * Temporary site-wide blog hide.
 * Flip to false when ready to show blogs again.
 * Does not delete content — only hides UI + routes.
 */
export const HIDE_BLOGS = true

export function isBlogsHidden() {
  return HIDE_BLOGS
}

/** CMS nav/footer link that points at blogs */
export function isBlogNavLink(label?: string, url?: string) {
  const l = (label || '').toLowerCase()
  const u = (url || '').toLowerCase()
  return l.includes('blog') || u.includes('/blog')
}
