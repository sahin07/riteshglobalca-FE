import { SectionHeading } from './SectionHeading'

interface RichTextSectionProps {
  block: any
}

export function RichTextSection({ block }: RichTextSectionProps) {
  if (!block?.content) return null

  return (
    <div className="mb-12">
      {block.title && <SectionHeading title={block.title} />}
      <div
        className="strapi-html"
        dangerouslySetInnerHTML={{ __html: block.content }}
      />
    </div>
  )
}
