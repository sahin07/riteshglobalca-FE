'use client'

import { useEffect, useState } from 'react'
import type { PdfArticle } from '@/lib/articles'
import { submitContactRequest, triggerPdfDownload } from '@/lib/submitContactRequest'

interface ArticlePdfGridProps {
  items: PdfArticle[]
}

export function ArticlePdfGrid({ items }: ArticlePdfGridProps) {
  const [selected, setSelected] = useState<PdfArticle | null>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!selected) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) setSelected(null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selected, isSubmitting])

  const closeModal = () => {
    if (isSubmitting) return
    setSelected(null)
    setErrorMessage('')
  }

  const openModal = (article: PdfArticle) => {
    setSelected(article)
    setErrorMessage('')
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selected) return

    setErrorMessage('')

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Please enter your name, email, and phone number.')
      return
    }

    setIsSubmitting(true)

    try {
      await submitContactRequest({
        fullName,
        email,
        phone,
        serviceInterest: 'Articles PDF Download',
        message: `Requested PDF download: ${selected.title} (${selected.fileName})`,
      })

      triggerPdfDownload(selected.pdfUrl, selected.fileName)
      closeModal()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {items.map((article) => (
          <article
            key={article.id}
            className="flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
              <img
                src={article.previewSrc}
                alt={`${article.title} preview`}
                className="h-full w-full object-cover object-top"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
            </div>

            <div className="flex flex-grow flex-col p-5 md:p-6">
              <h3 className="mb-5 flex-grow text-[18px] font-bold leading-snug text-[#0b293d] md:text-[20px]">
                {article.title}
              </h3>

              <button
                type="button"
                onClick={() => openModal(article)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b293d] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#F19020]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 3v12m0 0l4-4m-4 4l-4-4M5 21h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Download PDF
              </button>
            </div>
          </article>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b293d]/70 px-4 py-8"
          onClick={closeModal}
          role="presentation"
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl md:p-8"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pdf-download-modal-title"
          >
            <div className="mb-6">
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#F19020]">
                Download PDF
              </p>
              <h2 id="pdf-download-modal-title" className="text-[22px] font-bold leading-snug text-[#0b293d]">
                {selected.title}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Please share your details to download this publication.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="pdf-download-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Full name
                </label>
                <input
                  id="pdf-download-name"
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none ring-[#F19020] transition focus:border-[#F19020] focus:ring-2"
                  placeholder="Your name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="pdf-download-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="pdf-download-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none ring-[#F19020] transition focus:border-[#F19020] focus:ring-2"
                  placeholder="you@company.com"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="pdf-download-phone" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Phone
                </label>
                <input
                  id="pdf-download-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none ring-[#F19020] transition focus:border-[#F19020] focus:ring-2"
                  placeholder="+91 ..."
                  required
                  disabled={isSubmitting}
                />
              </div>

              {errorMessage && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{errorMessage}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-[#0b293d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#F19020] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit & Download'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
