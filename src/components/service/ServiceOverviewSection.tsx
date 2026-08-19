interface ServiceOverviewSectionProps {
  service: any
}

export function ServiceOverviewSection({ service }: ServiceOverviewSectionProps) {
  if (!service.introDescription && !service.introQuote) return null

  const isHtml = (service.introDescription || '').includes('<')

  return (
    <div className="mb-12">
      {service.introQuote && (
        <blockquote className="border-l-4 border-[#F19020] pl-5 mb-8 text-[18px] md:text-[20px] italic text-[#0b293d] font-medium leading-relaxed">
          &ldquo;{service.introQuote}&rdquo;
        </blockquote>
      )}
      {service.introDescription && (
        isHtml ? (
          <div
            className="strapi-html"
            dangerouslySetInnerHTML={{ __html: service.introDescription }}
          />
        ) : (
          <div className="strapi-html">
            {service.introDescription.split('\n\n').map((para: string, i: number) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )
      )}
    </div>
  )
}
