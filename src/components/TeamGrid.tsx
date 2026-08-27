'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

export interface TeamMember {
  name: string
  role: string
  image: string
  linkedInUrl?: string
  twitterUrl?: string
  biography?: string
  keyExpertise?: any
}

export interface TeamGridProps {
  members: TeamMember[]
}

function expertiseOf(member: TeamMember): string[] {
  if (Array.isArray(member.keyExpertise)) return member.keyExpertise
  if (member.keyExpertise && Array.isArray((member.keyExpertise as any).keyExpertise)) {
    return (member.keyExpertise as any).keyExpertise
  }
  return []
}

export function TeamGrid({ members }: TeamGridProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!selectedMember) return

    const prevOverflow = document.body.style.overflow
    const prevPaddingRight = document.body.style.paddingRight
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedMember(null)
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPaddingRight
      window.removeEventListener('keydown', onKey)
    }
  }, [selectedMember])

  const close = () => setSelectedMember(null)

  const modal =
    selectedMember && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[200] flex items-stretch justify-center sm:items-center sm:p-4 md:p-6">
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close profile"
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
              onClick={close}
            />

            {/* Panel */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedMember.name || 'Partner'} profile`}
              className="relative z-10 flex h-[100dvh] w-full max-w-4xl flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[min(90dvh,880px)] sm:rounded-2xl sm:border sm:border-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sticky top bar */}
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-bold text-brand-dark sm:text-base">
                    {selectedMember.name}
                  </p>
                  {selectedMember.role && (
                    <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-brand-orange sm:text-xs">
                      {selectedMember.role}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="shrink-0 rounded-full bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                  aria-label="Close Profile"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable content */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <div className="flex flex-col lg:flex-row">
                  {/* Photo column */}
                  <div className="flex shrink-0 flex-col items-center bg-slate-50 px-5 py-6 sm:px-8 sm:py-8 lg:w-[38%] lg:border-r lg:border-slate-100">
                    <div className="relative mb-4 h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg sm:mb-5 sm:h-40 sm:w-40 lg:h-52 lg:w-52">
                      <img
                        src={selectedMember.image}
                        alt={selectedMember.name || 'Team Member'}
                        className="h-full w-full select-none object-cover object-[center_28%]"
                      />
                    </div>

                    <h3 className="hidden text-center text-[22px] font-bold text-brand-dark lg:block">
                      {selectedMember.name}
                    </h3>
                    {selectedMember.role && (
                      <p className="mt-1 hidden text-center text-sm font-semibold uppercase tracking-wider text-brand-orange lg:block">
                        {selectedMember.role}
                      </p>
                    )}

                    {(selectedMember.linkedInUrl || selectedMember.twitterUrl) && (
                      <div className="mt-5 flex w-full items-center justify-center gap-4 border-t border-slate-200/60 pt-4">
                        {selectedMember.linkedInUrl && (
                          <a
                            href={selectedMember.linkedInUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-brand-dark"
                          >
                            <svg className="h-5 w-5 text-[#0a66c2]" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                            LinkedIn
                          </a>
                        )}
                        {selectedMember.twitterUrl && (
                          <a
                            href={selectedMember.twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-brand-dark"
                          >
                            <svg className="h-5 w-5 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            Twitter
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bio column */}
                  <div className="flex flex-1 flex-col px-5 py-6 sm:px-8 sm:py-8 lg:w-[62%]">
                    {selectedMember.biography && (
                      <div className="mb-6">
                        <h4 className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-1.5 text-base font-bold text-slate-900 sm:text-lg">
                          <svg className="h-5 w-5 shrink-0 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Partner Biography
                        </h4>
                        <div className="space-y-3 text-[14px] font-light leading-relaxed text-slate-600 sm:space-y-4 sm:text-[15px]">
                          {selectedMember.biography
                            .split('\n')
                            .filter(Boolean)
                            .map((para, idx) => (
                              <p key={idx}>{para}</p>
                            ))}
                        </div>
                      </div>
                    )}

                    {(() => {
                      const modalExpertise = expertiseOf(selectedMember)
                      if (modalExpertise.length === 0) return null
                      return (
                        <div className="mb-6">
                          <h4 className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-1.5 text-base font-bold text-slate-900 sm:text-lg">
                            <svg className="h-5 w-5 shrink-0 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Areas of Expertise
                          </h4>
                          <ul className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                            {modalExpertise.map((exp) => (
                              <li key={exp} className="flex items-start gap-2.5 text-[14px] text-slate-700">
                                <svg
                                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{exp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>

              {/* Sticky footer */}
              <div className="flex shrink-0 justify-end border-t border-slate-100 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5">
                <button
                  type="button"
                  onClick={close}
                  className="h-10 cursor-pointer rounded-lg bg-brand-dark px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null

  return (
    <>
      <div
        className={
          members.length <= 2
            ? 'mx-auto grid max-w-4xl gap-8 px-4 md:grid-cols-2'
            : 'mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-3'
        }
      >
        {members.map((m, index) => {
          const fourExpertise = expertiseOf(m).slice(0, 4)
          return (
            <div
              key={m.name || index}
              onClick={() => setSelectedMember(m)}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-[280px] w-full overflow-hidden bg-slate-100 sm:h-[360px]">
                <img
                  src={m.image}
                  alt={m.name || 'Team Member'}
                  className="h-full w-full select-none object-cover object-[center_28%] transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-transparent to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                    View Full Profile
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6 md:p-8">
                {m.name && <h3 className="text-[22px] font-bold text-brand-dark">{m.name}</h3>}
                {m.role && (
                  <p className="mt-1 text-[14px] font-semibold uppercase tracking-wider text-brand-orange">
                    {m.role}
                  </p>
                )}

                {fourExpertise.length > 0 && (
                  <div className="mt-5 flex-1 border-t border-slate-100 pt-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Key Expertise
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {fourExpertise.map((exp) => (
                        <span
                          key={exp}
                          className="rounded-full border border-slate-200/60 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {modal}
    </>
  )
}
