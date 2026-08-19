import Link from 'next/link'
import { Button } from './Button'

export interface BulletPoint {
  id: number
  text: string
}

export interface AboutHomeProps {
  sectionTitle?: string
  leftTitle?: string
  leftDescription?: string
  leftButtonText?: string
  leftButtonLink?: string
  rightTitle?: string
  rightPoints?: BulletPoint[]
}

export function AboutHome({
  sectionTitle,
  leftTitle,
  leftDescription,
  leftButtonText,
  leftButtonLink,
  rightTitle,
  rightPoints
}: AboutHomeProps) {

  const points = rightPoints && rightPoints.length > 0 ? rightPoints : [];

  return (
    <section className="bg-brand-dark py-16 md:py-24 text-white relative overflow-hidden">
      {/* Background Pattern: Sunburst */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: "repeating-conic-gradient(from 0deg at 50% 10%, rgba(255,255,255,0.03) 0deg 2deg, transparent 2deg 4deg)"
        }}
      />

      <div className="container-prose relative z-10 max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-wide">{sectionTitle}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* Left Card */}
          <div className="bg-white rounded-xl p-8 md:p-10 shadow-xl flex flex-col h-full border-t-[6px] border-transparent">
            <h3 className="text-[22px] md:text-[26px] font-bold mb-4 text-brand-dark leading-tight">
              {leftTitle}
            </h3>
            <p className="text-slate-600 text-[15px] leading-relaxed mb-8 flex-1">
              {leftDescription}
            </p>
            {leftButtonText && leftButtonLink && (
              <div>
                <Link href={leftButtonLink}>
                  <Button variant="primary" className="bg-brand-orange hover:bg-orange-600 text-white font-medium px-6 py-2.5 rounded text-sm shadow-sm transition-colors border-none">
                    {leftButtonText}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Right Card: Why Choose Us */}
          <div className="bg-white rounded-xl p-8 md:p-10 shadow-xl flex flex-col h-full border-t-[6px] border-transparent">
            <h3 className="text-[22px] md:text-[26px] font-bold mb-6 text-brand-dark leading-tight">
              {rightTitle}
            </h3>
            <ul className="space-y-4">
              {points.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="shrink-0 flex items-center justify-center text-brand-orange mt-1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span className="font-medium text-slate-600 text-[15px]">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
