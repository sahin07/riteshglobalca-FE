export interface ContactRequestPayload {
  fullName: string
  email: string
  phone: string
  message: string
  serviceInterest?: string
  businessName?: string
}

export async function submitContactRequest(payload: ContactRequestPayload) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  if (!strapiUrl) {
    throw new Error('Contact service is not configured.')
  }

  const response = await fetch(`${strapiUrl}/api/contact-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: {
        fullName: payload.fullName.trim(),
        email: payload.email.trim(),
        phone: payload.phone.trim(),
        message: payload.message.trim(),
        serviceInterest: payload.serviceInterest?.trim() || '',
        businessName: payload.businessName?.trim() || '',
      },
    }),
  })

  if (!response.ok) {
    const errJson = await response.json().catch(() => null)
    throw new Error(errJson?.error?.message || 'Failed to submit form. Please try again.')
  }
}

export function triggerPdfDownload(pdfUrl: string, fileName: string) {
  const link = document.createElement('a')
  link.href = pdfUrl
  link.download = fileName
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()
}
