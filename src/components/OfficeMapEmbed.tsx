import { OFFICE_LOCATION } from '@/lib/officeLocation'

interface OfficeMapEmbedProps {
  className?: string
}

export function OfficeMapEmbed({ className = 'w-full h-80' }: OfficeMapEmbedProps) {
  return (
    <div className={`${className} rounded-xl overflow-hidden shadow-sm border border-slate-300`}>
      <iframe
        title={`${OFFICE_LOCATION.name} office location`}
        src={OFFICE_LOCATION.mapsEmbedUrl}
        className="w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  )
}
