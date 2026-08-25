import { SectionHeading } from './SectionHeading'

function stripSeparatorHtml(html: string): string {
  return html
    .replace(/<p>\s*-{10,}\s*<\/p>\s*/gi, '')
    .replace(/<h[1-4][^>]*>\s*(?:<strong>)?\s*details\s*(?:<\/strong>)?\s*<\/h[1-4]>\s*/gi, '')
    .trim()
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .trim()
}

function splitH3Sections(html: string): { preface: string; sections: { title: string; body: string }[] } {
  const matches = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)]
  if (matches.length === 0) return { preface: html, sections: [] }

  const firstIndex = matches[0].index ?? 0
  const preface = html.slice(0, firstIndex).trim()
  const sections = matches.map((match, i) => {
    const bodyStart = (match.index ?? 0) + match[0].length
    const bodyEnd = i + 1 < matches.length ? (matches[i + 1].index ?? html.length) : html.length
    return {
      title: stripTags(match[1] || ''),
      body: html.slice(bodyStart, bodyEnd).trim(),
    }
  })
  return { preface, sections }
}

function reconstructHtml(sections: { title: string; body: string }[]): string {
  return sections
    .map((section) => `<h3><strong>${section.title}</strong></h3>\n${section.body}`)
    .join('\n')
}

interface RichTextSectionProps {
  block: any
  variant?: 'default' | 'closing'
}

function HeaderCards({ sections }: { sections: { title: string; body: string }[] }) {
  const cols = sections.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
  return (
    <div className={`grid gap-6 ${cols}`}>
      {sections.map((section) => (
        <div
          key={section.title}
          className="header-card overflow-hidden rounded-xl border-2 border-[#0b293d] bg-white shadow-lg"
        >
          <div className="bg-[#F19020] px-5 py-3.5 text-center">
            <h3 className="text-[16px] font-bold leading-snug text-white md:text-[18px]">
              {section.title}
            </h3>
          </div>
          <div
            className="strapi-html px-6 py-5"
            dangerouslySetInnerHTML={{ __html: section.body }}
          />
        </div>
      ))}
    </div>
  )
}

export function RichTextSection({ block, variant = 'default' }: RichTextSectionProps) {
  const content = stripSeparatorHtml(block?.content || '')
  if (!content) return null

  const { preface, sections } = splitH3Sections(content)
  const useHeaderCards = variant === 'closing' && sections.length > 0
  const cardCount = sections.length === 1 ? 1 : 2
  const earlier = useHeaderCards ? sections.slice(0, -cardCount) : sections
  const cardSections = useHeaderCards ? sections.slice(-cardCount) : []
  const earlierHtml = [preface, reconstructHtml(earlier)].filter(Boolean).join('\n')

  return (
    <div className="mb-12">
      {block.title && <SectionHeading title={block.title} />}
      {earlierHtml ? (
        <div className="strapi-html" dangerouslySetInnerHTML={{ __html: earlierHtml }} />
      ) : null}
      {cardSections.length > 0 ? (
        <div className={earlierHtml ? 'mt-10' : ''}>
          <HeaderCards sections={cardSections} />
        </div>
      ) : null}
    </div>
  )
}
