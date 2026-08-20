import { SectionHeading } from './SectionHeading'

interface FeatureGridSectionProps {
  block: any
  gridIndex?: number
}

const iconColors = [
  'bg-[#F19020]',
  'bg-[#e04f5f]',
  'bg-[#3b4b5b]',
  'bg-[#2d88ff]',
  'bg-[#0b293d]',
  'bg-[#8B5CF6]',
  'bg-[#f88f24]',
]

const defaultIcons = [
  <svg key="i0" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  <svg key="i1" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  <svg key="i2" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  <svg key="i3" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  <svg key="i4" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  <svg key="i5" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  <svg key="i6" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
]

function renderIcon(card: any, idx: number) {
  const imgUrl = card.icon?.data?.attributes?.url || card.icon?.url
  if (imgUrl) {
    return <img src={imgUrl} alt={card.title} className="h-5 w-5 object-contain brightness-0 invert filter" />
  }
  return defaultIcons[idx % defaultIcons.length]
}

/** Coverage / entity lists render as a table; “Our … Services” stay as icon cards. */
function isCoverageTableSection(sectionTitle: string, gridIndex?: number): boolean {
  const lower = sectionTitle.toLowerCase()
  if (
    lower.includes('covered') ||
    lower.includes('entities') ||
    lower.includes('applicable') ||
    lower.includes('who can') ||
    lower.includes('types of')
  ) {
    return true
  }
  return (gridIndex ?? 0) >= 1
}

function coverageColumnLabel(sectionTitle: string): string {
  const stripped = sectionTitle
    .replace(/^business entities covered under\s+/i, '')
    .replace(/^business entities covered\s*/i, '')
    .trim()
  if (stripped && stripped.toLowerCase() !== sectionTitle.toLowerCase()) {
    return stripped
  }
  return 'Coverage'
}

function ServicesCardGrid({ cards }: { cards: any[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {cards.map((card: any, idx: number) => (
        <div
          key={idx}
          className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg md:p-7"
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-white ${iconColors[idx % iconColors.length]}`}
            >
              <div className="h-6 w-6">{renderIcon(card, idx)}</div>
            </div>
            <div className="min-w-0">
              <h4 className="mb-3 text-[21px] font-bold leading-tight text-[#0b293d]">
                {card.title}
              </h4>
              <p className="whitespace-pre-line text-[15px] leading-7 text-slate-600">
                {card.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function EntityCoverageTable({ cards, columnLabel }: { cards: any[]; columnLabel: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#e8c9a0] bg-white shadow-sm">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="bg-[#F19020] text-white">
            <th className="w-[44%] px-5 py-3.5 text-[14px] font-bold md:px-6 md:text-[15px]">
              Particulars
            </th>
            <th className="px-5 py-3.5 text-[14px] font-bold md:px-6 md:text-[15px]">
              {columnLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card: any, idx: number) => (
            <tr
              key={idx}
              className={`border-t border-[#eadac8] ${idx % 2 === 1 ? 'bg-[#fff8f1]' : 'bg-white'}`}
            >
              <td className="px-5 py-4 align-top text-[14px] font-semibold leading-snug text-[#0b293d] md:px-6 md:text-[15px]">
                {card.title}
              </td>
              <td className="px-5 py-4 align-top text-[14px] leading-relaxed text-slate-600 md:px-6 md:text-[15px]">
                {card.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function FeatureGridSection({ block, gridIndex }: FeatureGridSectionProps) {
  const cards = block.cards || []
  const title = block.section_title || block.sectionTitle || ''
  const subtitle = block.section_subtitle || block.sectionSubtitle || ''
  const useTableLayout = isCoverageTableSection(title, gridIndex)

  return (
    <div className="mb-12">
      {title && <SectionHeading title={title} subtitle={subtitle} />}
      {useTableLayout ? (
        <EntityCoverageTable cards={cards} columnLabel={coverageColumnLabel(title)} />
      ) : (
        <ServicesCardGrid cards={cards} />
      )}
    </div>
  )
}
