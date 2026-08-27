import { Button } from './Button'
import Link from 'next/link'

export interface ReadyToStartProps {
  title: string
  subtitle: string
  buttonText: string
  buttonLink?: string
}

export function ReadyToStart({ title, subtitle, buttonText, buttonLink = '/contact' }: ReadyToStartProps) {
  return (
    <section className="relative overflow-hidden bg-[#0b293d] py-20 text-center">
      {/* Radial background effect */}
      {/* Insights-style hero gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b293d] via-[#0b293d]/90 to-[#003B49]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(241,144,32,0.18)_0%,_transparent_50%)]" />

      <div className="relative container-prose">
        <h2 className="text-3xl md:text-3xl font-bold text-white mb-4">{title}</h2>
        <p className="text-white/70 max-w-2xl mx-auto mb-8">
          {subtitle}
        </p>
        {buttonText && (
          <Link href={buttonLink}>
            <Button variant="primary" size="lg" className="px-8 font-semibold bg-orange-400 hover:bg-orange-500 text-black border-none">
              {buttonText}
            </Button>
          </Link>
        )}
      </div>
    </section>
  )
}
