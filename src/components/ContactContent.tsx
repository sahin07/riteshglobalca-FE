'use client'
import React, { useState, useRef } from 'react'
import { Button } from './Button'
import { OfficeMapEmbed } from './OfficeMapEmbed'

export interface ContactContentProps {
    officeAddressTitle: string
    officeAddress: string
    contactDetailsTitle: string
    email: string
    phone: string
    officeHoursTitle: string
    officeHours: string
    formTitle: string
    formDescription: string
}

export function ContactContent({
    officeAddressTitle,
    officeAddress,
    contactDetailsTitle,
    email,
    phone,
    officeHoursTitle,
    officeHours,
    formTitle,
    formDescription
}: ContactContentProps) {
    const [fullName, setFullName] = useState('')
    const [businessName, setBusinessName] = useState('')
    const [emailInput, setEmailInput] = useState('')
    const [phoneInput, setPhoneInput] = useState('')
    const [serviceInterest, setServiceInterest] = useState('Select a Service')
    const [message, setMessage] = useState('')
    const [file, setFile] = useState<File | null>(null)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage('')
        setSuccessMessage('')

        if (!fullName.trim() || !emailInput.trim() || !phoneInput.trim() || !message.trim()) {
            setErrorMessage('Please fill in all required fields.')
            return
        }

        setIsSubmitting(true)

        try {
            const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL
            let attachmentId = null

            if (file) {
                const uploadFormData = new FormData()
                uploadFormData.append('files', file)

                const uploadResponse = await fetch(`${STRAPI_URL}/api/upload`, {
                    method: 'POST',
                    body: uploadFormData
                })

                if (!uploadResponse.ok) {
                    const errJson = await uploadResponse.json()
                    console.error('File upload error:', errJson)
                    throw new Error(errJson?.error?.message || 'Failed to upload attachment file')
                }

                const uploadData = await uploadResponse.json()
                if (Array.isArray(uploadData) && uploadData.length > 0) {
                    attachmentId = uploadData[0].id
                }
            }

            const payload = {
                data: {
                    fullName,
                    businessName,
                    email: emailInput,
                    phone: phoneInput,
                    serviceInterest: serviceInterest !== 'Select a Service' ? serviceInterest : '',
                    message,
                    ...(attachmentId ? { attachment: attachmentId } : {})
                }
            }

            const response = await fetch(`${STRAPI_URL}/api/contact-requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const errJson = await response.json()
                console.error('Submit error:', errJson)
                throw new Error(errJson?.error?.message || 'Failed to submit contact request')
            }

            setSuccessMessage('Thank you! Your consultation request has been submitted successfully.')

            // Reset fields
            setFullName('')
            setBusinessName('')
            setEmailInput('')
            setPhoneInput('')
            setServiceInterest('Select a Service')
            setMessage('')
            setFile(null)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        } catch (err: any) {
            console.error(err)
            setErrorMessage(err.message || 'Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="py-16 md:py-24 bg-slate-50">
            <div className="container-prose">
                <div className="grid lg:grid-cols-2 gap-12">

                    {/* Left Column: Info & Map */}
                    <div className="space-y-8">
                        <OfficeMapEmbed />

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{officeAddressTitle}</h3>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                    {officeAddress}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{contactDetailsTitle}</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    <a href={`mailto:${email}`} className="hover:text-primary transition-colors">{email}</a><br />
                                    <a href={`tel:${phone}`} className="hover:text-primary transition-colors">{phone}</a>
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{officeHoursTitle}</h3>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                    {officeHours}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Consultation Form */}
                    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{formTitle}</h2>
                        <p className="text-slate-500 mb-8 whitespace-pre-line">{formDescription}</p>

                        {successMessage && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
                                {successMessage}
                            </div>
                        )}

                        {errorMessage && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                                {errorMessage}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full h-12 text-black rounded-lg border border-slate-300 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                                <input
                                    type="text"
                                    placeholder="Business Name"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    className="w-full h-12 text-black rounded-lg border border-slate-300 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    className="w-full h-12 text-black rounded-lg border border-slate-300 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    placeholder="Phone"
                                    value={phoneInput}
                                    onChange={(e) => setPhoneInput(e.target.value)}
                                    className="w-full h-12 text-black rounded-lg border border-slate-300 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Service Interest</label>
                                <select
                                    value={serviceInterest}
                                    onChange={(e) => setServiceInterest(e.target.value)}
                                    className="w-full h-12 text-black rounded-lg border border-slate-300 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow bg-white"
                                    disabled={isSubmitting}
                                >
                                    <option>Select a Service</option>
                                    <option>GST Registration & Filing</option>
                                    <option>Income Tax Filing</option>
                                    <option>Company Incorporation</option>
                                    <option>Audit & Assurance</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Message <span className="text-red-500">*</span></label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us briefly about your requirement..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full text-black rounded-lg border border-slate-300 p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow resize-none"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* File Upload Hidden Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => {
                                    const selectedFile = e.target.files?.[0]
                                    if (selectedFile) {
                                        if (selectedFile.size > 5 * 1024 * 1024) {
                                            setErrorMessage('File size must be less than 5MB.')
                                            return
                                        }
                                        setFile(selectedFile)
                                        setErrorMessage('')
                                    }
                                }}
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                            />

                            {/* File Upload Dropzone/Clickable */}
                            <div
                                onClick={() => !isSubmitting && fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors group relative"
                            >
                                {file ? (
                                    <div className="flex flex-col items-center justify-center">
                                        <svg className="w-8 h-8 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div className="text-sm font-semibold text-slate-700 max-w-xs truncate">
                                            {file.name}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setFile(null)
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = ''
                                                }
                                            }}
                                            className="mt-3 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors underline"
                                            disabled={isSubmitting}
                                        >
                                            Remove File
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-sm text-slate-500 group-hover:text-slate-700">
                                        Upload a file (PDF, JPG, PNG upto 5MB)
                                    </div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full h-12 text-lg font-semibold shadow-md bg-[#f28e2b] hover:bg-[#e07f24] border-none text-white transition-all"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    )
}
