'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { subscribeAction } from '@/app/actions/subscribe'

interface SharedNewsletterProps {
  title?: string
  description?: string
  placeholder?: string
  buttonText?: string
}

function Fields({
  placeholder,
  buttonText,
  error,
}: {
  placeholder: string
  buttonText: string
  error?: string
}) {
  const { pending } = useFormStatus()

  return (
    <div className="w-full space-y-3">
      <input
        type="email"
        name="email"
        required
        disabled={pending}
        placeholder={placeholder}
        className="h-12 w-full rounded-lg border-0 bg-white px-4 text-[14px] text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-70"
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#F19020] px-5 text-[15px] font-bold text-[#0b293d] transition hover:bg-[#d87f1c] disabled:opacity-70"
      >
        {pending ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#0b293d]/30 border-t-[#0b293d]" />
        ) : (
          <>
            {buttonText}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </>
        )}
      </button>
      {error && <p className="text-[13px] text-red-300">{error}</p>}
    </div>
  )
}

export function SharedNewsletter({
  title = 'Join Our Newsletter',
  description = 'Get practical updates on tax, compliance, and business advisory delivered to your inbox.',
  placeholder = 'Enter your email address',
  buttonText = 'Subscribe Now',
}: SharedNewsletterProps) {
  const [state, formAction] = useFormState(subscribeAction, null)

  // Keep section visible with CMS or fallback copy so newsletter stays available.
  const resolvedTitle = title || 'Join Our Newsletter'
  const resolvedDescription =
    description || 'Get practical updates on tax, compliance, and business advisory delivered to your inbox.'
  const resolvedPlaceholder = placeholder || 'Enter your email address'
  const resolvedButtonText = buttonText || 'Subscribe Now'

  return (
    <section className="bg-[#0b293d] py-14 md:py-16">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 md:gap-12 lg:px-8">
        <div>
          <h2 className="mb-3 text-[28px] font-bold text-white md:text-[34px]">{resolvedTitle}</h2>
          <p className="max-w-md text-[15px] leading-relaxed text-white/75">{resolvedDescription}</p>
        </div>

        <div className="w-full max-w-md md:ml-auto">
          {state?.success ? (
            <p className="text-[16px] font-medium text-[#F19020]">{state.message}</p>
          ) : (
            <form action={formAction}>
              <Fields
                placeholder={resolvedPlaceholder}
                buttonText={resolvedButtonText}
                error={state?.error}
              />
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
