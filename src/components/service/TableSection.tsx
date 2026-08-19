import React from 'react'
import { SectionHeading } from './SectionHeading'

interface TableSectionProps {
  block: any
}

export function TableSection({ block }: TableSectionProps) {
  if (!block.headers && !block.rows) return null

  return (
    <div className="mb-12">
      {block.title && <SectionHeading title={block.title} subtitle={block.description} />}

      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
        <table className="w-full border-collapse min-w-[500px]">
          <thead>
            <tr>
              {block.headers?.map((header: any, idx: number) => (
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
            {block.rows?.map((row: any, rIdx: number) => (
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

      {block.footnotes && (
        <p className="mt-4 text-[12px] text-slate-400 italic">{block.footnotes}</p>
      )}
    </div>
  )
}
