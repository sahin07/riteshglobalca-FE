interface SectionHeadingProps {
  title: string
  subtitle?: string
}

function isPlaceholderTitle(title?: string) {
  const t = (title || '').trim().toLowerCase()
  return t === 'details' || t === 'detail' || t === 'service details'
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  if (isPlaceholderTitle(title) && !subtitle) return null

  return (
    <div className="mb-6">
      {!isPlaceholderTitle(title) && (
        <h2 className="text-[24px] md:text-[32px] font-bold text-[#0b293d] mb-3">
          {title}
        </h2>
      )}
      {!isPlaceholderTitle(title) && (
        <div className="flex w-24">
          <span className="h-[3px] w-10 bg-[#0b293d] rounded-full" />
          <span className="h-[3px] flex-1 bg-[#0b293d] rounded-full" />
        </div>
      )}
      {subtitle && (
        <p className="text-slate-500 text-[15px] mt-3 leading-relaxed max-w-3xl">
          {subtitle}
        </p>
      )}
    </div>
  )
}
