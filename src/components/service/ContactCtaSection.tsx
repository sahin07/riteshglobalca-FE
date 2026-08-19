'use client'
import React, { useState } from 'react'

interface ContactCtaSectionProps {
  block: any
}

export function ContactCtaSection({ block }: ContactCtaSectionProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [message, setMessage] = useState('')
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const captchaA = 6
  const captchaB = 4
  const captchaCorrect = captchaA * captchaB

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!fullName.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setErrorMessage('Please fill in all required fields.')
      return
    }

    if (parseInt(captchaAnswer, 10) !== captchaCorrect) {
      setErrorMessage('Incorrect captcha answer. Please try again.')
      return
    }

    setIsSubmitting(true)

    try {
      const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL
      const response = await fetch(`${STRAPI_URL}/api/contact-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            fullName,
            email,
            phone,
            serviceInterest: businessName,
            message,
          },
        }),
      })

      if (!response.ok) {
        const errJson = await response.json()
        throw new Error(errJson?.error?.message || 'Failed to submit request')
      }

      setSuccessMessage('Thank you! Your request has been submitted successfully.')
      setFullName('')
      setEmail('')
      setPhone('')
      setBusinessName('')
      setMessage('')
      setCaptchaAnswer('')
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="bg-[#0b293d] py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(241,144,32,0.12)_0%,_transparent_50%)] pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: CTA text */}
          <div className="text-white">
            <h2 className="text-[28px] md:text-[38px] font-bold leading-tight mb-4">
              {block.title || 'Expand your Business'}
            </h2>
            {block.subtitle && (
              <p className="text-white/70 text-[15px] md:text-[17px] mb-8 leading-relaxed">
                {block.subtitle}
              </p>
            )}

            <div className="space-y-5">
              {block.phone && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[#F19020]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase text-white/50 block tracking-wider font-semibold">Call Us</span>
                    <a href={`tel:${block.phone}`} className="text-white hover:text-[#F19020] transition-colors font-semibold text-[16px]">
                      {block.phone}
                    </a>
                  </div>
                </div>
              )}
              {block.email && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[#F19020]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase text-white/50 block tracking-wider font-semibold">Email Us</span>
                    <a href={`mailto:${block.email}`} className="text-white hover:text-[#F19020] transition-colors font-semibold text-[16px]">
                      {block.email}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl">
            <h3 className="text-[#0b293d] font-bold text-[20px] mb-6 text-center">
              Request a Free Consultation
            </h3>

            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 text-[14px] text-slate-800 outline-none focus:border-[#F19020] focus:ring-1 focus:ring-[#F19020] placeholder:text-slate-400 transition"
                required
                disabled={isSubmitting}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 text-[14px] text-slate-800 outline-none focus:border-[#F19020] focus:ring-1 focus:ring-[#F19020] placeholder:text-slate-400 transition"
                required
                disabled={isSubmitting}
              />
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 text-[14px] text-slate-800 outline-none focus:border-[#F19020] focus:ring-1 focus:ring-[#F19020] placeholder:text-slate-400 transition"
                required
                disabled={isSubmitting}
              />
              <input
                type="text"
                placeholder="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 text-[14px] text-slate-800 outline-none focus:border-[#F19020] focus:ring-1 focus:ring-[#F19020] placeholder:text-slate-400 transition"
                disabled={isSubmitting}
              />
              <textarea
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 text-[14px] text-slate-800 outline-none focus:border-[#F19020] focus:ring-1 focus:ring-[#F19020] placeholder:text-slate-400 resize-none h-24 transition"
                required
                disabled={isSubmitting}
              />

              {/* Simple captcha */}
              <div className="flex items-center gap-3">
                <span className="text-[14px] text-slate-600 font-medium whitespace-nowrap">
                  What is {captchaA} &times; {captchaB} ?
                </span>
                <input
                  type="text"
                  placeholder="Type your answer"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 text-[14px] text-slate-800 outline-none focus:border-[#F19020] focus:ring-1 focus:ring-[#F19020] placeholder:text-slate-400 transition"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#F19020] text-white font-bold text-[14px] rounded-lg hover:bg-[#d87f1c] transition-colors uppercase tracking-wider"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
