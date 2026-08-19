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

  const steps = tabs[activeTabIdx]?.steps || []

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
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#22c55e]/15 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
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
