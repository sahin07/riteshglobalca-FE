'use client'
import React, { useState, useRef } from 'react'
import { Button } from './Button'
import { OfficeMapEmbed } from './OfficeMapEmbed'

export interface ServiceContactProps {
    title?: string
    officeAddressTitle?: string
    officeAddress?: string
    contactDetailsTitle?: string
    email?: string
    phone?: string
    officeHoursTitle?: string
    officeHours?: string
}

export function ServiceContact({
    title,
    officeAddressTitle,
    officeAddress,
    contactDetailsTitle,
    email,
    phone,
    officeHoursTitle,
    officeHours
}: ServiceContactProps) {
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
        <section className="relative py-12 sm:py-16 md:py-24 bg-[#0b293d] overflow-hidden text-left">
            {/* Background Pattern: Sunburst */}
            {/* Insights-style hero gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b293d] via-[#0b293d]/90 to-[#003B49]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(241,144,32,0.18)_0%,_transparent_50%)]" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left Column: Info & Map */}
                    {(officeAddress || email || phone) && (
                        <div className="lg:col-span-5 space-y-8">
                            <div>
                                <h2 className="text-[28px] md:text-[36px] font-bold text-white tracking-wide leading-tight">
                                    {title}
                                </h2>
                            </div>

                            <OfficeMapEmbed className="w-full h-72 border-slate-700" />

                            {/* Office Info Details */}
                            <div className="space-y-6">
                                {officeAddress && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">{officeAddressTitle || "Office Address"}</h3>
                                        <p className="text-slate-300 font-light leading-relaxed whitespace-pre-line text-sm md:text-base">
                                            {officeAddress}
                                        </p>
                                    </div>
                                )}
                                {(email || phone) && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">{contactDetailsTitle || "Contact Details"}</h3>
                                        <p className="text-slate-300 font-light leading-relaxed text-sm md:text-base">
                                            {email && <a href={`mailto:${email}`} className="text-brand-orange hover:text-white transition-colors block mb-1">{email}</a>}
                                            {phone && <a href={`tel:${phone}`} className="text-brand-orange hover:text-white transition-colors block">{phone}</a>}
                                        </p>
                                    </div>
                                )}
                                {officeHours && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">{officeHoursTitle || "Office Hours"}</h3>
                                        <p className="text-slate-300 font-light leading-relaxed whitespace-pre-line text-sm md:text-base">
                                            {officeHours}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Right Column: Form Container */}
                    <div className={`w-full rounded-[20px] p-5 sm:p-8 md:p-10 shadow-2xl bg-white ${(officeAddress || email || phone) ? "lg:col-span-7" : "lg:col-span-8 lg:col-start-3 mx-auto"}`}>
                        {/* Title if no left column details are provided */}
                        {!(officeAddress || email || phone) && (
                            <div className="text-center mb-8">
                                <h2 className="text-[28px] md:text-[36px] font-bold text-slate-800 tracking-wide">
                                    {title}
                                </h2>
                            </div>
                        )}

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
                        <form className="grid md:grid-cols-2 gap-x-8 gap-y-6 " onSubmit={handleSubmit}>
                            {/* Row 1 */}
                            <div>
                                <label className="block text-[15px] text-slate-600 mb-2 font-medium">Full Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Enter your Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                    className="w-full h-[46px] rounded-lg border border-slate-200 px-4 text-[14px] text-slate-700 placeholder-slate-400 focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[15px] text-slate-600 mb-2 font-medium">Business Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your Business Name"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full h-[46px] rounded-lg border border-slate-200 px-4 text-[14px] text-slate-700 placeholder-slate-400 focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-colors"
                                />
                            </div>

                            {/* Row 1.5 (or keep in same grid) */}
                            <div>
                                <label className="block text-[15px] text-slate-600 mb-2 font-medium">Email <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    placeholder="Enter your Email"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                    className="w-full h-[46px] rounded-lg border border-slate-200 px-4 text-[14px] text-slate-700 placeholder-slate-400 focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-colors"
                                />
                            </div>

                            {/* Row 2 */}
                            <div>
                                <label className="block text-[15px] text-slate-600 mb-2 font-medium">Phone <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    placeholder="Enter your Phone"
                                    value={phoneInput}
                                    onChange={(e) => setPhoneInput(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                    className="w-full h-[46px] rounded-lg border border-slate-200 px-4 text-[14px] text-slate-700 placeholder-slate-400 focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[15px] text-slate-600 mb-2 font-medium">Service Interest</label>
                                <div className="relative">
                                    <select
                                        className="w-full h-[46px] rounded-lg border border-slate-200 pl-4 pr-10 text-[14px] text-slate-700 bg-white focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-colors appearance-none cursor-pointer"
                                        value={serviceInterest}
                                        onChange={(e) => setServiceInterest(e.target.value)}
                                        disabled={isSubmitting}
                                    >
                                        <option>Select a Service</option>
                                        <option>GST Registration & Filing</option>
                                        <option>Income Tax Filing</option>
                                        <option>Company Incorporation</option>
                                        <option>Audit & Assurance</option>
                                        <option>Other</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div className="md:col-span-2">
                                <label className="block text-[15px] text-slate-600 mb-2 font-medium">Message <span className="text-red-500">*</span></label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us briefly about your requirement..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                    className="w-full rounded-lg border border-slate-200 p-4 text-[14px] text-slate-700 placeholder-slate-400 focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none resize-none transition-colors"
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
                            <div className="md:col-span-2">
                                <label className="block text-[15px] text-slate-600 mb-2 font-medium">Attachment</label>
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
                            </div>

                            {/* Submit Button */}
                            <div className="md:col-span-2 mt-2">
                                <Button type="submit" disabled={isSubmitting} variant="primary" className="w-full h-[46px] text-[16px] font-medium bg-[#f28e2b] hover:bg-[#e07b1a] border-none text-white rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
