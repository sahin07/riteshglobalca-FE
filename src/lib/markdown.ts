/**
 * Shakes out leading and trailing whitespaces inside formatting markdown tags
 * (e.g. "**text **" becomes "**text** ") so they render correctly in standard markdown parsers.
 */
function fixMarkerSpaces(text: string, marker: string): string {
  const escaped = marker.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  const regex = new RegExp(`${escaped}(\\s*)((?:(?!${escaped}).)*?)(\\s*)${escaped}`, 'g')
  
  return text.replace(regex, (match, leadingSpace, content, trailingSpace) => {
    if (!content.trim()) return match
    const prefix = leadingSpace ? ' ' : ''
    const suffix = trailingSpace ? ' ' : ''
    return `${prefix}${marker}${content.trim()}${marker}${suffix}`
  })
}

/**
 * Preprocesses markdown text from Strapi CMS to handle common editor anomalies:
 * - Moves whitespace from inside bold, italic, strikethrough tags to the outside.
 */
export function cleanMarkdown(text: string): string {
  if (!text) return ''
  let cleaned = text
  cleaned = fixMarkerSpaces(cleaned, '~~')
  cleaned = fixMarkerSpaces(cleaned, '**')
  cleaned = fixMarkerSpaces(cleaned, '__')
  cleaned = fixMarkerSpaces(cleaned, '_')
  cleaned = fixMarkerSpaces(cleaned, '*')
  return cleaned
}
