import React from 'react'
import clsx from 'clsx'

type Props = {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export function Section({ title, subtitle, children, className }: Props) {
  return (
    <section className={clsx('py-20 md:py-24', className)}>
      <div className="container-prose">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-slate-600">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}
