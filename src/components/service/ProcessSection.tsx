'use client'

import { useState } from 'react'
import { SectionHeading } from './SectionHeading'

interface ProcessSectionProps {
  block: any
}

export function ProcessSection({ block }: ProcessSectionProps) {
  const [activeTabIdx, setActiveTabIdx] = useState(0)
  const tabs = block.tabs || []

  if (tabs.length === 0) return null

  const rawSteps = tabs[activeTabIdx]?.steps || []
  const steps = rawSteps.filter((step: any) => {
    const title = String(step?.title || '').trim()
    const description = String(step?.description || '').trim()
    if (!title) return false
    const lower = title.toLowerCase()
    if (['stage', 'step', 'our approach', 'approach'].includes(lower)) return false
    // Closing marketing lines with no description
    if (!description && (title.length > 55 || /^(building|ensuring|why)\b/i.test(title))) {
      return false
    }
    return true
  })

  if (steps.length === 0) return null

  return (
    <div className="mb-14">
      <SectionHeading title={block.title || 'Our Process'} subtitle={block.subtitle} />

      {tabs.length > 1 && (
        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tab: any, idx: number) => {
            const isActive = activeTabIdx === idx
            return (
              <button
                key={idx}
                onClick={() => setActiveTabIdx(idx)}
                className={`px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all border ${isActive
                  ? 'bg-[#0b293d] text-white border-[#0b293d]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-[#0b293d]'
                }`}
              >
                {tab.tab_name || tab.tabName}
              </button>
            )
          })}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {steps.map((step: any, idx: number) => (
          <div key={idx} className="flex items-center gap-4 bg-[#f8f9fa] rounded-2xl p-5 border border-slate-100">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#0b293d] flex items-center justify-center text-white font-bold text-[15px]">
              {String(idx + 1).padStart(2, '0')}
            </div>
            <div>
              <h4 className="text-[#0b293d] font-bold text-[17px] mb-1">
                {step.title}
              </h4>
              {step.description && (
                <p className="text-slate-500 text-[14px] leading-relaxed">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
