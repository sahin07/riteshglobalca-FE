'use client'

import { useState } from 'react'
import { SectionHeading } from './SectionHeading'

interface TabbedRichTextSectionProps {
  block: any
}

export function TabbedRichTextSection({ block }: TabbedRichTextSectionProps) {
  const [activeTabIdx, setActiveTabIdx] = useState(0)
  const tabs = block.tabs || []

  if (tabs.length === 0) return null

  const activeTab = tabs[activeTabIdx]

  return (
    <div className="mb-12">
      {(block.title || block.subtitle) && (
        <SectionHeading title={block.title} subtitle={block.subtitle} />
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        {tabs.map((tab: any, idx: number) => {
          const isActive = activeTabIdx === idx
          return (
            <button
              key={tab.id || idx}
              onClick={() => setActiveTabIdx(idx)}
              className={`px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all border ${isActive
                ? 'bg-[#0b293d] text-white border-[#0b293d]'
                : 'bg-white text-slate-600 border-slate-200 hover:border-[#0b293d]'
              }`}
            >
              {tab.tabName}
            </button>
          )
        })}
      </div>

      {activeTab?.content && (
        <div
          className="strapi-html bg-[#f8f9fa] p-6 md:p-8 rounded-xl border border-slate-200"
          dangerouslySetInnerHTML={{ __html: activeTab.content }}
        />
      )}
    </div>
  )
}
