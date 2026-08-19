type Props = {
  title: string
  text: string
  icon?: 'target' | 'eye'
}

export function InfoCard({ title, text, icon = 'target' }: Props) {
  const Icon = () => (
    <div className="w-8 h-8 bg-primary/20 rounded grid place-items-center">
      {icon === 'target' ? (
        <svg width="18" height="18" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M12 5v2M12 17v2M5 12h2M17 12h2" stroke="currentColor" strokeWidth="2" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      )}
    </div>
  )
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-6">
      <div className="flex items-center gap-3 text-primary">
        <Icon />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="mt-3 text-white/80">{text}</p>
    </div>
  )
}
