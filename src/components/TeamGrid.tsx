'use client'

import React, { useState, useEffect } from 'react'

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

export function TeamGrid({ members }: TeamGridProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  // Block background scrolling when modal is open
  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedMember])

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member)
  }

  return (
    <>
      {/* Grid of Partner Cards */}
      <div
        className={
          members.length <= 2
            ? 'grid md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4'
            : 'grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4'
        }
      >
        {members.map((m, index) => {
          // Safely extract expertise list
          let expertiseList: string[] = []
          if (Array.isArray(m.keyExpertise)) {
            expertiseList = m.keyExpertise
          } else if (m.keyExpertise && Array.isArray((m.keyExpertise as any).keyExpertise)) {
            expertiseList = (m.keyExpertise as any).keyExpertise
          }
          const fourExpertise = expertiseList.slice(0, 4)
          return (
            <div
              key={m.name || index}
              onClick={() => handleMemberClick(m)}
              className="group cursor-pointer rounded-[20px] bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden border border-slate-100"
            >
              {/* Image taking full width at the top */}
              <div className="h-[360px] w-full bg-slate-100 relative overflow-hidden">
                <img
                  src={m.image}
                  alt={m.name || "Team Member"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <span className="text-white text-sm font-semibold flex items-center gap-1.5">
                    View Full Profile
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Content padding below image */}
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                {m.name && <h3 className="font-bold text-[22px] text-brand-dark">{m.name}</h3>}
                {m.role && (
                  <p className="text-brand-orange text-[14px] font-semibold tracking-wider uppercase mt-1">
                    {m.role}
                  </p>
                )}

                {/* Card Display: 4 Areas of Expertise */}
                {fourExpertise?.length > 0 && (
                  <div className="mt-5 border-t border-slate-100 pt-5 flex-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Key Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      {fourExpertise?.map((exp) => (
                        <span
                          key={exp}
                          className="px-3 py-1 bg-slate-50 border border-slate-200/60 rounded-full text-slate-600 text-xs font-medium"
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

      {/* User Friendly Profile Modal Popup */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-100 relative animate-scale-up flex flex-col md:flex-row my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              aria-label="Close Profile"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left side: Photo & Socials */}
            <div className="w-full md:w-2/5 bg-slate-50 flex flex-col items-center p-8 border-b md:border-b-0 md:border-r border-slate-100">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-lg relative mb-6">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name || "Team Member"}
                  className="w-full h-full object-cover select-none"
                />
              </div>

              {selectedMember.name && <h3 className="font-bold text-[24px] text-brand-dark text-center">{selectedMember.name}</h3>}
              {selectedMember.role && (
                <p className="text-brand-orange text-sm font-semibold tracking-wider uppercase mt-1">
                  {selectedMember.role}
                </p>
              )}

              {/* Social profile connections */}
              {(selectedMember.linkedInUrl || selectedMember.twitterUrl) && (
                <div className="mt-6 flex items-center gap-4 border-t border-slate-200/60 pt-5 w-full justify-center">
                  {selectedMember.linkedInUrl && (
                    <a
                      href={selectedMember.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-500 hover:text-brand-dark transition-colors font-medium text-sm"
                    >
                      <svg className="w-5 h-5 text-[#0a66c2]" fill="currentColor" viewBox="0 0 24 24">
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
                      className="flex items-center gap-2 text-slate-500 hover:text-brand-dark transition-colors font-medium text-sm"
                    >
                      <svg className="w-5 h-5 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      Twitter
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Right side: Detailed Bio & Areas of Expertise */}
            <div className="w-full md:w-3/5 p-8 flex flex-col justify-between max-h-[80vh] md:max-h-[600px] overflow-y-auto">
              <div className="space-y-6">
                {/* Biography */}
                {selectedMember.biography && (
                  <div>
                    <h4 className="text-slate-900 font-bold text-lg mb-3 pb-1.5 border-b border-slate-100 flex items-center gap-2">
                      <svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Partner Biography
                    </h4>
                    <div className="text-slate-600 text-[15px] leading-relaxed font-light space-y-4">
                      {selectedMember.biography
                        .split('\n')
                        .filter(Boolean)
                        .map((para, idx) => (
                          <p key={idx}>{para}</p>
                        ))}
                    </div>
                  </div>
                )}

                {/* Complete Areas of Expertise */}
                {(() => {
                  let modalExpertise: string[] = []
                  if (Array.isArray(selectedMember.keyExpertise)) {
                    modalExpertise = selectedMember.keyExpertise
                  } else if (selectedMember.keyExpertise && Array.isArray((selectedMember.keyExpertise as any).keyExpertise)) {
                    modalExpertise = (selectedMember.keyExpertise as any).keyExpertise
                  }

                  if (modalExpertise.length === 0) return null;

                  return (
                    <div>
                      <h4 className="text-slate-900 font-bold text-lg mb-3 pb-1.5 border-b border-slate-100 flex items-center gap-2">
                        <svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Areas of Expertise
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                        {modalExpertise.map((exp) => (
                          <li key={exp} className="flex items-start gap-2.5 text-slate-700 text-[14px]">
                            <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
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

              {/* Action Button inside Modal */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-6 h-10 bg-brand-dark hover:bg-slate-800 text-white rounded-lg font-semibold text-sm transition-colors cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
