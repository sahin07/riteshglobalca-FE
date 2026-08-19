'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { subscribeAction } from '@/app/actions/subscribe'

interface NewsletterFormProps {
  placeholder?: string;
  buttonText?: string;
}

function SubmitFields({ placeholder, buttonText, error }: NewsletterFormProps & { error?: string }) {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto relative">
      <input
        type="email"
        name="email"
        placeholder={placeholder}
        className="w-full sm:w-[285px] md:w-[320px] h-[48px] px-5 rounded-[8px] bg-white text-slate-800 placeholder-slate-400 focus:outline-none text-[15px] shadow-inner disabled:opacity-70"
        required
        disabled={pending}
      />
      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto h-[48px] px-8 bg-[#F19020] hover:bg-[#D87F1C] text-white font-medium rounded-[8px] transition-colors whitespace-nowrap text-[15px] shadow-sm focus:outline-none disabled:bg-[#D87F1C]/70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
      >
        {pending ? (
          <span className="block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        ) : (
          buttonText
        )}
      </button>
      {error && (
        <p className="absolute -bottom-6 left-0 text-red-400 text-[13px] whitespace-nowrap">{error}</p>
      )}
    </div>
  );
}

export function NewsletterForm({ placeholder = "Enter your email", buttonText = "Subscribe" }: NewsletterFormProps) {
  const [state, formAction] = useFormState(subscribeAction, null);

  if (state?.success) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 w-full lg:w-auto h-[48px]">
        <p className="text-[#F19020] font-medium text-[16px]">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-8 max-w-5xl mx-auto w-full">
      <SubmitFields placeholder={placeholder} buttonText={buttonText} error={state?.error} />
    </form>
  );
}
