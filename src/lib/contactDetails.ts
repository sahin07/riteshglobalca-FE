import { OFFICE_LOCATION } from '@/lib/officeLocation'

type ContactCmsData = {
  officeAddressTitle?: string
  officeAddress?: string
  contactDetailsTitle?: string
  email?: string
  phone?: string
  officeHoursTitle?: string
  officeHours?: string
  formTitle?: string
  formDescription?: string
  bannerTitle?: string
  bannerSubtitle?: string
} | null | undefined

export function resolveContactDetails(cmsData?: ContactCmsData) {
  return {
    officeAddressTitle: cmsData?.officeAddressTitle || 'Office Address',
    officeAddress: OFFICE_LOCATION.addressText,
    contactDetailsTitle: cmsData?.contactDetailsTitle || 'Contact Details',
    email: OFFICE_LOCATION.email,
    phone: OFFICE_LOCATION.phone,
    officeHoursTitle: cmsData?.officeHoursTitle || 'Office Hours',
    officeHours: OFFICE_LOCATION.officeHours,
    formTitle: cmsData?.formTitle || 'Request a Consultation',
    formDescription: cmsData?.formDescription || "We'll get back to you within 24 hours.",
    bannerTitle: cmsData?.bannerTitle || 'Get in touch',
    bannerSubtitle:
      cmsData?.bannerSubtitle ||
      'Get in touch for enquiries, service requests, or to book a consultation. We typically respond within 24 hours.',
  }
}
