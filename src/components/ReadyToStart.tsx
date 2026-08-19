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
    <section className="relative overflow-hidden bg-[#0f283d] py-20 text-center">
      {/* Radial background effect */}
      <div 
        className="absolute inset-0 opacity-80" 
        style={{ 
          backgroundImage: "repeating-conic-gradient(from 0deg at 50% 10%, rgba(255,255,255,0.03) 0deg 2deg, transparent 2deg 4deg)" 
        }} 
      />

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
