'use client'

import { useEffect, useState, useRef } from 'react'

function Counter({ end, suffix }: { end: number | null, suffix: string }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (end === null) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [end])

  useEffect(() => {
    if (!isVisible || end === null) return

    let start = 0
    const duration = 2000 // 2 seconds
    const incrementTime = 20
    const totalSteps = Math.floor(duration / incrementTime)
    const increment = end / totalSteps

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.ceil(start))
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [end, isVisible])

  return (
    <div ref={ref} className="text-4xl font-bold text-brand-orange">
      {end !== null ? count : null}{suffix}
    </div>
  )
}

export interface StatItem {
  label: string
  number: string
}

export interface StatsProps {
  stats?: StatItem[]
}

export function Stats({ stats }: StatsProps) {
  const items = stats
    && stats.map((s) => {
      const numMatch = s.number.match(/\d+/)
      const value = numMatch ? parseInt(numMatch[0], 10) : null
      const suffix = s.number.replace(/\d+/, '')
      return { label: s.label, value, suffix }
    })

  return (
    <div className="bg-brand-orange py-12">
      <div className="container-prose">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items?.map((s) => (
            <div key={s.label} className="bg-white rounded-lg p-8 text-center shadow-lg transform hover:-translate-y-1 transition-transform">
              <Counter end={s.value} suffix={s.suffix} />
              <div className="mt-1 text-slate-800 font-medium text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
