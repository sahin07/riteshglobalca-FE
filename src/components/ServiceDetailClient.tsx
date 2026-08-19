'use client'

import { useState } from 'react'

// 1. Tabbed Rich Text Block Component (styled with dark blue pill buttons and orange-headed tables)
export function TabbedRichText({ block }: { block: any }) {
  const [activeTabIdx, setActiveTabIdx] = useState(0)
  const tabs = block.tabs || []

  if (tabs.length === 0) return null

  return (
    <section className="bg-white py-16 md:py-24 border-b border-slate-100">
      <div className="container-prose px-4 md:px-8 mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-[28px] md:text-[36px] font-bold text-[#0b293d] mb-4">
            {block.title}
          </h2>
          {block.subtitle && (
            <p className="text-slate-600 text-[15px] md:text-[16px] max-w-3xl mx-auto">
              {block.subtitle}
            </p>
          )}
        </div>

        {/* Tab Buttons (Blue Pills) */}
        <div className="flex flex-wrap justify-center border-b border-slate-200 pb-5 mb-8 gap-3">
          {tabs.map((tab: any, idx: number) => {
            const isActive = activeTabIdx === idx
            return (
              <button
                key={idx}
                onClick={() => setActiveTabIdx(idx)}
                className={`px-6 py-2.5 rounded-full text-[14px] font-semibold transition-all duration-300 border ${
                  isActive
                    ? 'bg-[#0b293d] text-white border-[#0b293d] shadow-sm'
                    : 'bg-slate-50 text-[#0b293d] border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab.tab_name || tab.tabName}
              </button>
            )
          })}
        </div>

        {/* Tab Content Box */}
        <div className="bg-white p-2 rounded-[8px] border border-slate-100 shadow-sm transition-all duration-300 overflow-x-auto">
          <div 
            className="prose max-w-none text-slate-700 leading-relaxed text-[14px] md:text-[15px] p-2 md:p-6
                       [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:min-w-[600px]
                       [&_th]:bg-[#f28e2b] [&_th]:text-white [&_th]:p-3 [&_th]:border [&_th]:border-slate-200 [&_th]:text-left [&_th]:text-[14px] [&_th]:font-semibold
                       [&_td]:p-3 [&_td]:border [&_td]:border-slate-200 [&_td]:text-[14px] [&_tr:nth-child(even)]:bg-[#f8f9fa] [&_tr:hover]:bg-orange-50/40 [&_tr]:transition-colors"
            dangerouslySetInnerHTML={{ __html: tabs[activeTabIdx]?.content || '' }}
          />
        </div>
      </div>
    </section>
  )
}

// 2. Process Section Block Component (Restructured into a two-column timeline and document sidecard)
export function ProcessSection({ block }: { block: any }) {
  const [activeTabIdx, setActiveTabIdx] = useState(0)
  const tabs = block.tabs || []

  if (tabs.length === 0) return null

  return (
    <section className="relative py-16 md:py-24 bg-[#0b293d] overflow-hidden text-white border-b border-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
        <div className="w-[150%] h-[150%] opacity-20" style={{ backgroundImage: 'repeating-conic-gradient(from 0deg, transparent 0deg 10deg, rgba(255,255,255,0.1) 10deg 20deg)' }}></div>
      </div>

      <div className="relative container-prose px-4 md:px-8 mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-[28px] md:text-[36px] font-bold mb-4">
            {block.title}
          </h2>
          {block.subtitle && (
            <p className="text-slate-300 text-[14px] md:text-[15px] font-light max-w-2xl mx-auto">
              {block.subtitle}
            </p>
          )}
        </div>

        {/* Tab Switcher (Blue/Orange Pills) */}
        {tabs.length > 1 && (
          <div className="flex justify-center border-b border-slate-700 pb-5 mb-10 gap-3">
            {tabs.map((tab: any, idx: number) => {
              const isActive = activeTabIdx === idx
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTabIdx(idx)}
                  className={`px-6 py-2.5 rounded-full text-[14px] font-semibold border transition-all duration-300 ${
                    isActive
                      ? 'bg-[#f28e2b] text-white border-[#f28e2b] shadow-md'
                      : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {tab.tab_name || tab.tabName}
                </button>
              )
            })}
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-5 gap-10 items-start">
          
          {/* Left Column: Timeline Steps */}
          <div className="lg:col-span-3 space-y-6 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-700/50">
            {(tabs[activeTabIdx]?.steps || []).map((step: any, idx: number) => (
              <div key={idx} className="relative pl-12 flex gap-4 transition-all duration-300 group">
                {/* Step Circle Indicator */}
                <div className="absolute left-3 -translate-x-1/2 bg-[#f28e2b] text-white font-bold text-[14px] w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 border-[#0b293d] group-hover:scale-110 transition-transform duration-300">
                  {idx + 1}
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-[8px] flex-1 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <h3 className="text-white text-[16px] md:text-[18px] font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-slate-300 text-[13px] md:text-[14px] font-light mt-1.5 leading-relaxed">
                    We manage the complete compilation, verification, and filing processes for this stage.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: CTA & Documents Sidecard */}
          <div className="lg:col-span-2">
            <div className="bg-white text-slate-800 p-6 md:p-8 rounded-[8px] shadow-2xl border border-slate-100 flex flex-col">
              <h3 className="text-[#0b293d] text-[18px] md:text-[20px] font-bold mb-3">
                Get Started Today
              </h3>
              <p className="text-slate-600 text-[13px] md:text-[14px] leading-relaxed mb-6 font-light">
                Complete your registration journey efficiently with our dedicated CA assistance.
              </p>

              <div className="flex flex-col gap-3 mb-6">
                <button 
                  onClick={() => {
                    const el = document.getElementById('contact-form-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 bg-[#0b293d] text-white font-semibold text-[14px] rounded-[4px] hover:bg-[#f28e2b] transition-all duration-300 text-center shadow-sm"
                >
                  Start Registration
                </button>
                <a 
                  href="#contact-form-section"
                  className="w-full py-3 border border-[#0b293d] text-[#0b293d] font-semibold text-[14px] rounded-[4px] hover:bg-slate-50 transition-all duration-300 text-center"
                >
                  Download Info Guide
                </a>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-[#0b293d] text-[14px] font-bold mb-4 uppercase tracking-wider">
                  Required Documents Checklist
                </h4>
                <ul className="space-y-3">
                  {[
                    'PAN cards of all proposed directors/partners',
                    'Aadhaar cards / Passport / Voter ID proof',
                    'Electricity bill or utility statement of registered office',
                    'NOC from the property owner'
                  ].map((doc, i) => (
                    <li key={i} className="flex gap-3 items-start text-slate-600 text-[13px] leading-relaxed font-light">
                      <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

// 3. FAQ Accordion Component (clean styled with sliding animation)
export function ServiceFaqAccordion({ faqs }: { faqs: any[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  if (!faqs || faqs.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-[#f8f9fa] border-t border-slate-100">
      <div className="container-prose px-4 md:px-8 mx-auto max-w-4xl">
        <h2 className="text-[28px] md:text-[36px] font-bold text-[#0b293d] mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div key={idx} className="bg-white rounded-[8px] shadow-sm border border-slate-100 overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-[#0b293d] font-semibold text-[15px] md:text-[16px]">
                    {faq.question}
                  </span>
                  <span className={`text-[#f28e2b] text-[20px] font-bold transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[500px]' : 'max-h-0'
                  }`}
                >
                  <div className="p-6 pt-0 border-t border-slate-50 text-slate-600 text-[14px] md:text-[15px] leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// 4. Contact CTA Section Component (with form state & validation)
export function ContactCtaSection({ block }: { block: any }) {
  return (
    <section id="contact-form-section" className="bg-[#0b293d] py-20 text-white border-b border-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(242,142,43,0.1)_0%,_transparent_40%)] pointer-events-none"></div>
      
      <div className="relative container-prose px-4 md:px-8 mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Call to Action text */}
          <div className="max-w-xl text-left">
            <h2 className="text-[32px] md:text-[42px] font-bold mb-4 leading-tight">
              {block.title}
            </h2>
            {block.subtitle && (
              <p className="text-slate-300 text-[15px] md:text-[17px] mb-8 font-light leading-relaxed">
                {block.subtitle}
              </p>
            )}
            
            <div className="space-y-4">
              {block.phone && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#f28e2b]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[12px] uppercase text-slate-400 block tracking-wider font-semibold">Call Us Direct</span>
                    <a href={`tel:${block.phone}`} className="text-white hover:text-[#f28e2b] transition-colors font-semibold text-[16px] md:text-[18px]">
                      {block.phone}
                    </a>
                  </div>
                </div>
              )}
              {block.email && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#f28e2b]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[12px] uppercase text-slate-400 block tracking-wider font-semibold">Email Us Direct</span>
                    <a href={`mailto:${block.email}`} className="text-white hover:text-[#f28e2b] transition-colors font-semibold text-[16px] md:text-[18px]">
                      {block.email}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Consultation Form (Orange box) */}
          <div className="bg-[#f28e2b] p-6 md:p-8 rounded-[8px] shadow-2xl text-slate-800">
            <h3 className="text-[#0b293d] font-bold text-[20px] mb-4 text-center">
              Request a Free Consultation
            </h3>
            
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full p-3 bg-white rounded border border-orange-400 text-slate-800 text-[14px] outline-none focus:border-[#0b293d] placeholder:text-slate-400"
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full p-3 bg-white rounded border border-orange-400 text-slate-800 text-[14px] outline-none focus:border-[#0b293d] placeholder:text-slate-400"
              />
              <input 
                type="text" 
                placeholder="Phone Number" 
                className="w-full p-3 bg-white rounded border border-orange-400 text-slate-800 text-[14px] outline-none focus:border-[#0b293d] placeholder:text-slate-400"
              />
              <select 
                className="w-full p-3 bg-white rounded border border-orange-400 text-slate-800 text-[14px] outline-none focus:border-[#0b293d]"
              >
                <option value="">Select Service Needed</option>
                <option value="incorporation">Company Incorporation</option>
                <option value="gst">GST Filing & Advisory</option>
                <option value="tax">Income Tax Advisory</option>
                <option value="audit">Audit & Compliance</option>
              </select>
              <textarea 
                placeholder="Briefly describe your requirements..." 
                className="w-full p-3 bg-white rounded border border-orange-400 text-slate-800 text-[14px] h-20 outline-none focus:border-[#0b293d] placeholder:text-slate-400 resize-none"
              ></textarea>
              
              <button 
                type="submit" 
                className="w-full py-3 bg-[#0b293d] text-white font-bold text-[14px] rounded hover:bg-slate-900 transition-all duration-300 uppercase tracking-wider shadow-md"
              >
                Submit Request
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
