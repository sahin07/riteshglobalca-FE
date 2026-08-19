'use client'

import { useState } from 'react'
import { SectionHeading } from './SectionHeading'

interface TabbedTableSectionProps {
  block: any
}

export function TabbedTableSection({ block }: TabbedTableSectionProps) {
  const [activeTabIdx, setActiveTabIdx] = useState(0)
  const tabs = block.tabs || []

  if (tabs.length === 0) return null

  const activeTab = tabs[activeTabIdx]

  return (
    <div className="mb-12">
      <SectionHeading title={block.title} subtitle={block.description} />

      {tabs.length > 1 && (
        <div className="flex flex-wrap gap-3 mb-6">
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
                {tab.tabName}
              </button>
            )
          })}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
        <table className="w-full border-collapse min-w-[500px]">
          <thead>
            <tr>
              {activeTab?.headers?.map((header: any, idx: number) => (
                <th
                  key={idx}
                  className="bg-[#0b293d] text-white px-5 py-3.5 text-left text-[13px] font-semibold tracking-wide uppercase first:rounded-tl-xl last:rounded-tr-xl"
                >
                  {header.text}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeTab?.rows?.map((row: any, rIdx: number) => (
              <tr key={rIdx} className="border-b border-slate-100 last:border-b-0 even:bg-slate-50/50 hover:bg-orange-50/30 transition-colors">
                {row.cells?.map((cell: any, cIdx: number) => (
                  <td key={cIdx} className="px-5 py-3.5 text-[14px] text-slate-700 leading-relaxed">
                    {cell.text}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
