import Link from 'next/link'

type Props = {
  title: string
  description: string
  href?: string
  image?: string
}

export function ServiceCard({ title, description, href = '#', image }: Props) {
  return (
    <div className="group rounded-lg overflow-hidden bg-[#063047] flex flex-col h-full shadow-lg">
      {/* Image Placeholder */}
      <div className="h-48 w-full bg-blue-100 relative">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-brand-dark/50 font-bold bg-white/20">
          Image: {title}
        </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/70 text-sm mb-6 flex-grow leading-relaxed">{description}</p>
        <Link href={href} className="inline-flex items-center text-brand-orange hover:text-orange-300 font-semibold text-sm transition-colors uppercase tracking-wider">
          Read More...
        </Link>
      </div>
    </div>
  )
}
