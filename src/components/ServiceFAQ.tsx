'use client'
import { useState } from 'react'
import clsx from 'clsx'
import { StrapiFaq } from '@/lib/strapi'

interface ServiceFAQProps {
    faqs?: StrapiFaq[];
}

export function ServiceFAQ({ faqs: fetchedFaqs }: ServiceFAQProps) {
    const staticFaqs = [
        {
            q: 'What documents are required for GST filing?',
            a: 'You generally need your sales and purchase invoices, bank statements, and details of input tax credit. Specific requirements may vary based on your business type.'
        },
        {
            q: 'How long does incorporation take?',
            a: 'Company incorporation typically takes 10-15 working days, provided all necessary documents are in order and name approval is granted promptly.'
        },
        {
            q: 'What are your service charges?',
            a: 'Our service charges vary depending on the scope and complexity of the work. We offer transparent pricing and can provide a detailed quote after an initial consultation.'
        },
        {
            q: 'Do you handle notices?',
            a: 'Yes, we provide end-to-end support for handling tax notices, drafting responses, and representing you before tax authorities.'
        },
        {
            q: 'Can you manage everything monthly?',
            a: 'Absolutely. We offer comprehensive monthly retainers covering bookkeeping, GST filings, TDS compliance, and general advisory.'
        },
    ]

    const faqs = fetchedFaqs && fetchedFaqs.length > 0
        && fetchedFaqs.map(item => ({
            q: item.question,
            a: item.answer
        }))

    if (!faqs) {
        return null;
    }

    return (
        <section className="py-16 md:py-24 bg-[#f8f9fa]">
            <div className="container-prose max-w-4xl mx-auto px-4">
                <h2 className="text-[28px] md:text-[36px] font-bold text-[#0b293d] mb-10 text-center">Frequently Asked Questions</h2>

                <div className="space-y-4">
                    {faqs.map((item, idx) => (
                        <Accordion key={idx} question={item.q} answer={item.a} isOpen={idx === 0} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function Accordion({ question, answer, isOpen: initialOpen }: { question: string, answer: string, isOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(initialOpen || false)

    return (
        <div className="border border-slate-300 rounded-[6px] overflow-hidden bg-[#f8f9fa] md:bg-white shadow-sm hover:shadow-md transition-shadow">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-6 py-5 bg-transparent hover:bg-slate-50 text-left transition-colors"
            >
                <span className="font-medium text-[#0b293d] text-[16px] md:text-[18px]">{question}</span>
                <svg
                    className={clsx("w-5 h-5 text-slate-500 transition-transform duration-200", isOpen ? "transform rotate-180" : "")}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div
                className={clsx(
                    "px-6 text-slate-600 font-light text-[15px] leading-relaxed transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-48 pb-6 opacity-100" : "max-h-0 py-0 opacity-0 overflow-hidden"
                )}
            >
                {answer}
            </div>
        </div>
    )
}
