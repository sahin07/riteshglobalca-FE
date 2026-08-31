function stripHtml(html?: string | null) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function blockHasSubstance(block: any) {
  const component = block?.__component as string | undefined
  if (!component || component === 'service.contact-cta') return false

  if (component === 'service.rich-text-section') {
    return stripHtml(block.content).length >= 50
  }

  if (component === 'service.process-section') {
    const tabs = block.tabs || []
    return tabs.some((tab: any) => (tab.steps || []).length > 0)
  }

  if (component === 'service.feature-grid') {
    const items = block.items || []
    if (items.length === 0) return false
    const text = items
      .map((item: any) => `${stripHtml(item.title)} ${stripHtml(item.description)}`)
      .join(' ')
      .trim()
    return text.length >= 80
  }

  if (
    component === 'service.tabbed-rich-text' ||
    component === 'service.tabbed-table' ||
    component === 'service.table-section'
  ) {
    return true
  }

  return stripHtml(block.content || block.title || block.sectionTitle).length >= 50
}

/** True when the service has a real detail page (not just title + CTA). */
export function hasDetailPageContent(service: {
  introDescription?: string | null
  contentBlocks?: any[]
}) {
  const blocks = service.contentBlocks || []
  if (blocks.some(blockHasSubstance)) return true
  return stripHtml(service.introDescription).length >= 200
}
