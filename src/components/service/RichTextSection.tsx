import { SectionHeading } from './SectionHeading'

function stripSeparatorHtml(html: string): string {
  return html.replace(/<p>\s*-{10,}\s*<\/p>\s*/gi, '').trim()
}

interface RichTextSectionProps {
  block: any
}

export function RichTextSection({ block }: RichTextSectionProps) {
  const content = stripSeparatorHtml(block?.content || '')
  if (!content) return null

  return (
    <div className="mb-12">
      {block.title && <SectionHeading title={block.title} />}
      <div
        className="strapi-html"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}
