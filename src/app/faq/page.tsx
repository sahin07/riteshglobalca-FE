import { Metadata } from 'next'
import { FAQ } from '@/components/FAQ'
import { getServicesPage } from '@/lib/strapi'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Ritesh Arora & Associates',
  description: 'Find answers to common questions about our services, compliance, taxation, and advisory.',
}

export default async function FAQPage() {
  // Try fetching FAQs from Strapi
  const servicesPage = await getServicesPage()
  const fetchedFaqs = servicesPage?.faqs || []

  // Predefined high-quality static FAQs
  const staticFaqs = [
    {
      question: 'What documents are required for GST filing?',
      answer: 'You generally need your sales and purchase invoices, bank statements, and details of input tax credit. Specific requirements may vary based on your business type.'
    },
    {
      question: 'How long does company incorporation take in India?',
      answer: 'Company incorporation typically takes 10-15 working days, provided all necessary documents are in order and name approval is granted promptly.'
    },
    {
      question: 'What are your service charges for tax and compliance filing?',
      answer: 'Our service charges vary depending on the scope and complexity of the work. We offer transparent pricing and can provide a detailed quote after an initial consultation.'
    },
    {
      question: 'Do you handle tax notices and representation?',
      answer: 'Yes, we provide end-to-end support for handling tax notices, drafting responses, and representing you before tax authorities.'
    },
    {
      question: 'Can you manage our company accounts monthly?',
      answer: 'Absolutely. We offer comprehensive monthly retainers covering bookkeeping, GST filings, TDS compliance, and general advisory.'
    },
    {
      question: 'What is the difference between direct and indirect tax services?',
      answer: 'Direct taxes (like Income Tax) are paid directly by individuals or businesses on their income. Indirect taxes (like GST) are collected on goods and services. We offer advisory, filing, and audit support for both.'
    },
    {
      question: 'How do I start working with Ritesh Arora & Associates?',
      answer: 'You can get in touch with us by filling out the contact form on our contact page, emailing us at info@ritesh-arora.com, or calling our office. We will schedule an initial consultation to understand your requirements.'
    }
  ]

  // Merge fetched FAQs with static FAQs, removing duplicates by question
  const mergedFaqs = [...fetchedFaqs.map(f => ({ question: f.question, answer: f.answer }))]
  
  // Add static FAQs if they aren't already present in fetched list
  staticFaqs.forEach(sFaq => {
    if (!mergedFaqs.some(mFaq => mFaq.question.toLowerCase().trim() === sFaq.question.toLowerCase().trim())) {
      mergedFaqs.push(sFaq)
    }
  })

  return (
    <>
      <main className="bg-slate-50 min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-[350px] md:min-h-[400px] flex items-center bg-[#0b293d]">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10 container-prose px-4 md:px-8 w-full mx-auto max-w-6xl text-left">
            <div className="max-w-3xl">
              <h1 className="text-[36px] md:text-[48px] lg:text-[56px] font-bold tracking-tight text-white mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-[16px] md:text-[20px] text-slate-300 max-w-xl leading-relaxed font-normal">
                Find answers to common queries about tax, audits, registration, and compliance services.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Component */}
        <FAQ title="General FAQs" faqs={mergedFaqs} />
      </main>
    </>
  )
}
