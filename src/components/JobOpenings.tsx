'use client'

import { useState } from 'react'

const MOCK_JOBS = [
    {
        id: 1,
        title: 'Assistant Manager — Audit',
        department: 'Audit & Assurance',
        type: 'Full Time',
        location: 'New Delhi',
        experience: '2-4 Years',
        postedDate: '19-07-2026',
        description: 'Lead audit engagements and ensure compliance with regulatory standards.',
        fullDescription: 'We are looking for an experienced Assistant Manager to join our Audit & Assurance team. You will be responsible for leading audit engagements, managing client relationships, and mentoring junior staff.',
        responsibilities: [
            'Plan and execute audit engagements',
            'Review financial statements and audit files',
            'Ensure compliance with auditing standards',
            'Manage and mentor a team of auditors',
            'Communicate effectively with clients'
        ]
    },
    {
        id: 2,
        title: 'Senior Executive, GST',
        department: 'Tax',
        type: 'Full Time',
        location: 'New Delhi',
        experience: '2-4 Years',
        postedDate: '19-07-2026',
        description: 'Handle end-to-end GST compliance and return preparation for clients.',
        fullDescription: 'We are looking for a Senior Executive for our GST compliance team.',
        responsibilities: [
            'Prepare and file GST returns',
            'Handle GST audits and notices',
            'Advise clients on GST implications',
        ]
    },
    {
        id: 3,
        title: 'Tax Consultant',
        department: 'Tax',
        type: 'Full Time',
        location: 'New Delhi',
        experience: '2-4 Years',
        postedDate: '19-07-2026',
        description: 'Lead audit engagements and ensure compliance with regulatory standards.',
        fullDescription: 'We are seeking a proactive Tax Consultant to provide comprehensive tax planning.',
        responsibilities: [
            'Direct tax compliance and advisory',
            'Represent clients before tax authorities',
            'Keep abreast of tax law changes'
        ]
    },
    {
        id: 4,
        title: 'Tax Consultant',
        department: 'Tax',
        type: 'Full Time',
        location: 'New Delhi',
        experience: '2-4 Years',
        postedDate: '19-07-2026',
        description: 'Lead audit engagements and ensure compliance with regulatory standards.',
        fullDescription: 'We are seeking a proactive Tax Consultant to provide comprehensive tax planning.',
        responsibilities: [
            'Direct tax compliance and advisory',
            'Represent clients before tax authorities',
            'Keep abreast of tax law changes'
        ]
    },
    {
        id: 5,
        title: 'Senior Executive, GST',
        department: 'Tax',
        type: 'Full Time',
        location: 'New Delhi',
        experience: '2-4 Years',
        postedDate: '19-07-2026',
        description: 'Handle end-to-end GST compliance and return preparation for clients.',
        fullDescription: 'We are looking for a Senior Executive for our GST compliance team.',
        responsibilities: [
            'Prepare and file GST returns',
            'Handle GST audits and notices',
            'Advise clients on GST implications',
        ]
    },
    {
        id: 6,
        title: 'Assistant Manager — Audit',
        department: 'Audit & Assurance',
        type: 'Full Time',
        location: 'New Delhi',
        experience: '2-4 Years',
        postedDate: '19-07-2026',
        description: 'Lead audit engagements and ensure compliance with regulatory standards.',
        fullDescription: 'We are looking for an experienced Assistant Manager to join our Audit & Assurance team. You will be responsible for leading audit engagements, managing client relationships, and mentoring junior staff.',
        responsibilities: [
            'Plan and execute audit engagements',
            'Review financial statements and audit files',
            'Ensure compliance with auditing standards',
            'Manage and mentor a team of auditors',
            'Communicate effectively with clients'
        ]
    },
]

const MapPinIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
)

const ClockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
)

import { StrapiJob } from '@/lib/strapi'

interface JobOpeningsProps {
    jobs?: StrapiJob[];
}

export function JobOpenings({ jobs = [] }: JobOpeningsProps) {
    const displayJobs = jobs && jobs.length > 0 ? jobs.map(job => {
        const parsedResponsibilities = job.responsibilities
            ? typeof job.responsibilities === 'string'
                ? job.responsibilities.split('\n').map(r => r.replace(/^- /, '').trim()).filter(Boolean)
                : []
            : [];

        const parsedRequirements = job.requirements
            ? typeof job.requirements === 'string'
                ? job.requirements.split('\n').map(r => r.replace(/^- /, '').trim()).filter(Boolean)
                : []
            : [];

        return {
            id: job.id,
            title: job.title,
            department: job.department,
            type: job.jobType || 'Full Time',
            location: job.location,
            experience: job.experience,
            postedDate: job.postedDate || (job.publishedAt ? new Date(job.publishedAt).toLocaleDateString('en-GB').replace(/\//g, '-') : ''),
            description: job.shortDescription || job.description || '',
            fullDescription: job.fullDescription || job.description || '',
            responsibilities: parsedResponsibilities,
            requirements: parsedRequirements
        }
    }) : [];

    const [selectedJob, setSelectedJob] = useState<typeof displayJobs[0] | null>(null)
    const [filterDepartment, setFilterDepartment] = useState('')
    const [filterLocation, setFilterLocation] = useState('')

    const uniqueDepartments = Array.from(new Set(displayJobs.map(job => job.department).filter(Boolean)));
    const uniqueLocations = Array.from(new Set(displayJobs.map(job => job.location).filter(Boolean)));

    const filteredJobs = displayJobs.filter(job => {
        const matchDepartment = filterDepartment ? job.department === filterDepartment : true;
        const matchLocation = filterLocation ? job.location === filterLocation : true;
        return matchDepartment && matchLocation;
    });
    const [isApplying, setIsApplying] = useState(false)
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [portfolio, setPortfolio] = useState('')
    const [message, setMessage] = useState('')
    const [resumeFile, setResumeFile] = useState<File | null>(null)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSubmittingForm, setIsSubmittingForm] = useState(false)

    const resetForm = () => {
        setFullName('')
        setEmail('')
        setPhone('')
        setPortfolio('')
        setMessage('')
        setResumeFile(null)
        setIsSubmitted(false)
        setIsApplying(false)
    }

    const handleClose = () => {
        setSelectedJob(null)
        resetForm()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resumeFile || !selectedJob) return;

        setIsSubmittingForm(true);

        try {
            const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
            let resumeId = null;

            // 1. Upload Resume
            const uploadFormData = new FormData();
            uploadFormData.append('files', resumeFile);

            const uploadResponse = await fetch(`${STRAPI_URL}/api/upload`, {
                method: 'POST',
                body: uploadFormData
            });

            if (!uploadResponse.ok) {
                const errJson = await uploadResponse.json();
                console.error('File upload error:', errJson);
                throw new Error(errJson?.error?.message || 'Failed to upload resume');
            }

            const uploadData = await uploadResponse.json();
            if (Array.isArray(uploadData) && uploadData.length > 0) {
                resumeId = uploadData[0].id;
            }

            // 2. Submit Application Data
            const payload = {
                data: {
                    fullName,
                    email,
                    phone,
                    jobAppliedFor: selectedJob.title,
                    portfolioLink: portfolio,
                    message,
                    resume: resumeId
                }
            };
            
            const response = await fetch(`${STRAPI_URL}/api/job-applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setIsSubmitted(true);
            } else {
                const err = await response.json();
                console.error('Failed to submit application', err);
                alert(`Failed to submit your application: ${err?.error?.message || 'Please verify all fields.'}`);
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('An error occurred while submitting. Please try again later.');
        } finally {
            setIsSubmittingForm(false);
        }
    }

    return (
        <section className="py-16 md:py-24 bg-[#f8f9fa] min-h-screen">
            <div className="container-prose max-w-6xl mx-auto px-4">

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                    <select 
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                        className="border border-slate-200 rounded-[8px] px-4 py-2.5 text-[14px] text-slate-500 w-full sm:w-64 bg-white outline-none focus:border-[#f28e2b]"
                    >
                        <option value="">All Departments</option>
                        {uniqueDepartments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                    <select 
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                        className="border border-slate-200 rounded-[8px] px-4 py-2.5 text-[14px] text-slate-500 w-full sm:w-64 bg-white outline-none focus:border-[#f28e2b]"
                    >
                        <option value="">All Locations</option>
                        {uniqueLocations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>

                {/* Job Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-500">
                            No open positions found matching your filters.
                        </div>
                    ) : filteredJobs?.map((job) => (
                        <div key={job.id} className="bg-[#0b293d] rounded-[12px] p-6 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                            <h3 className="text-[18px] md:text-[20px] font-medium text-white mb-3">
                                {job.title}
                            </h3>
                            <p className="text-[14px] text-slate-300 leading-relaxed mb-6 font-light">
                                {job.description}
                            </p>

                            <div className="mt-auto">
                                <div className="flex items-center justify-between text-slate-400 text-[13px] mb-8">
                                    <div className="flex items-center">
                                        <MapPinIcon />
                                        {job.location}
                                    </div>
                                    <div className="flex items-center">
                                        <ClockIcon />
                                        {job.experience}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedJob(job)}
                                    className="text-[#f28e2b] text-[14px] font-medium hover:text-[#e07b1a] transition-colors flex items-center"
                                >
                                    View Details <span className="ml-1">→</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Job Details Modal */}
            {selectedJob && (
                <div
                    onClick={handleClose}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-[16px] w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col"
                    >
                        {/* Modal Header Actions (Sticky) */}
                        <div className="sticky top-0 bg-white z-30 flex items-center justify-between px-8 md:px-10 py-5 border-b border-slate-100">
                            {isApplying && !isSubmitted ? (
                                <button
                                    onClick={() => setIsApplying(false)}
                                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-[14px] font-medium transition-colors focus:outline-none"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="19" y1="12" x2="5" y2="12"></line>
                                        <polyline points="12 19 5 12 12 5"></polyline>
                                    </svg>
                                    Back to Job Details
                                </button>
                            ) : (
                                <div />
                            )}
                            <button
                                onClick={handleClose}
                                className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                                aria-label="Close modal"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 md:p-10 pt-6 md:pt-8 flex-1">
                            {isSubmitted ? (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h3>
                                    <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed mb-8">
                                        Thank you for applying, {fullName}! Our recruitment team will review your resume and get back to you shortly.
                                    </p>
                                    <button
                                        onClick={handleClose}
                                        className="px-6 py-2.5 bg-[#F19020] hover:bg-[#D87F1C] text-white font-semibold rounded-[8px] text-[14px] transition-colors focus:outline-none"
                                    >
                                        Close Window
                                    </button>
                                </div>
                            ) : isApplying ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Header info */}
                                    <div>
                                        <div className="flex flex-wrap gap-2.5 mb-4">
                                            <span className="px-3.5 py-1 bg-[#FFF5E9] text-[#F19020] text-[12px] font-medium rounded-full">
                                                {selectedJob.department}
                                            </span>
                                            <span className="px-3.5 py-1 bg-[#FFF5E9] text-[#F19020] text-[12px] font-medium rounded-full">
                                                {selectedJob.type}
                                            </span>
                                        </div>

                                        <h2 className="text-[26px] md:text-[30px] font-bold text-[#0b293d] tracking-tight leading-snug mb-3">
                                            {selectedJob.title}
                                        </h2>

                                        <div className="flex flex-wrap items-center gap-5 text-[13px] text-slate-500 font-medium">
                                            <div className="flex items-center">
                                                <MapPinIcon />
                                                {selectedJob.location}
                                            </div>
                                            <div className="flex items-center">
                                                <ClockIcon />
                                                Posted {selectedJob.postedDate}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fields Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[#0b293d] text-[14px] font-medium mb-1.5">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Enter your Name"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full h-11 border border-slate-200 rounded-[8px] px-4 text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#F19020] focus:ring-1 focus:ring-[#F19020] transition-colors bg-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[#0b293d] text-[14px] font-medium mb-1.5">Email</label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="example@gmail.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full h-11 border border-slate-200 rounded-[8px] px-4 text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#F19020] focus:ring-1 focus:ring-[#F19020] transition-colors bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[#0b293d] text-[14px] font-medium mb-1.5">Phone</label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="+91 98765 43210"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full h-11 border border-slate-200 rounded-[8px] px-4 text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#F19020] focus:ring-1 focus:ring-[#F19020] transition-colors bg-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[#0b293d] text-[14px] font-medium mb-1.5">Job Applied For</label>
                                            <input
                                                type="text"
                                                readOnly
                                                value={selectedJob.title}
                                                className="w-full h-11 border border-slate-200 rounded-[8px] px-4 text-[14px] text-slate-500 bg-slate-50 cursor-not-allowed outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Upload */}
                                    <div>
                                        <label className="block text-[#0b293d] text-[14px] font-medium mb-1.5">Resume (PDF, Max 5MB) *</label>
                                        <div className="relative border-2 border-dashed border-slate-200 bg-white hover:bg-slate-50/50 rounded-[12px] p-7 text-center transition-colors group flex flex-col items-center justify-center min-h-[140px]">
                                            {resumeFile ? (
                                                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-[8px] p-2.5 px-4 shadow-sm max-w-sm pointer-events-auto relative z-20">
                                                    <svg className="w-6 h-6 text-[#F19020] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <div className="text-left overflow-hidden">
                                                        <p className="text-[13px] text-slate-700 font-semibold truncate max-w-[200px]">{resumeFile.name}</p>
                                                        <p className="text-[11px] text-slate-400">{(resumeFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.preventDefault(); setResumeFile(null); }}
                                                        className="ml-auto text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <input
                                                        type="file"
                                                        required
                                                        accept=".pdf"
                                                        onChange={handleFileChange}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#0b293d] mb-3 transition-transform group-hover:scale-105 duration-300">
                                                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                                        <polyline points="14 2 14 8 20 8" />
                                                        <path d="M12 18v-6" />
                                                        <polyline points="9 15 12 12 15 15" />
                                                    </svg>
                                                    <p className="text-[14px] font-bold text-[#0b293d] mb-1">Click to upload or drag and drop</p>
                                                    <p className="text-xs text-slate-400 font-medium">PDF only (Max, 5MB)</p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Portfolio */}
                                    <div>
                                        <label className="block text-[#0b293d] text-[14px] font-medium mb-1.5">Portfolio link (Optional)</label>
                                        <input
                                            type="url"
                                            placeholder="https://linkedin.com/in/naveed"
                                            value={portfolio}
                                            onChange={(e) => setPortfolio(e.target.value)}
                                            className="w-full h-11 border border-slate-200 rounded-[8px] px-4 text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#F19020] focus:ring-1 focus:ring-[#F19020] transition-colors bg-white"
                                        />
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-[#0b293d] text-[14px] font-medium mb-1.5">Message / Notes (Optional)</label>
                                        <textarea
                                            rows={4}
                                            placeholder="Tell us why you're a good fit..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="w-full rounded-[8px] border border-slate-200 p-4 text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#F19020] focus:ring-1 focus:ring-[#F19020] transition-colors resize-none bg-white"
                                        />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end pt-6">
                                        <button
                                            type="submit"
                                            disabled={isSubmittingForm}
                                            className="px-8 py-3 bg-[#F19020] hover:bg-[#D87F1C] text-white font-semibold rounded-[8px] text-[14px] shadow-md hover:shadow-lg transition-all focus:outline-none active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSubmittingForm ? 'Submitting...' : 'Submit Application'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        <span className="px-4 py-1.5 bg-[#FFF5E9] text-[#F19020] text-[13px] font-medium rounded-full">
                                            {selectedJob.department}
                                        </span>
                                        <span className="px-4 py-1.5 bg-[#FFF5E9] text-[#F19020] text-[13px] font-medium rounded-full">
                                            {selectedJob.type}
                                        </span>
                                    </div>

                                    <h2 className="text-[28px] md:text-[32px] font-bold text-[#0b293d] mb-4">
                                        {selectedJob.title}
                                    </h2>

                                    <div className="flex flex-wrap items-center gap-6 text-[14px] text-slate-500 mb-10 border-b border-slate-100 pb-8">
                                        <div className="flex items-center">
                                            <MapPinIcon />
                                            {selectedJob.location}
                                        </div>
                                        <div className="flex items-center">
                                            <ClockIcon />
                                            Posted {selectedJob.postedDate}
                                        </div>
                                    </div>

                                    <div className="prose prose-slate max-w-none">
                                        <h3 className="text-[20px] font-medium text-[#0b293d] mb-3">Job Description</h3>
                                        <p className="text-slate-600 font-light leading-relaxed mb-8 text-[15px]">
                                            {selectedJob.fullDescription}
                                        </p>

                                        <h3 className="text-[20px] font-medium text-[#0b293d] mb-4">Key Responsibilities</h3>
                                        <ul className="space-y-3">
                                            {selectedJob.responsibilities.map((resp: any, i: any) => (
                                                <li key={i} className="flex items-start text-slate-600 font-light text-[15px]">
                                                    <span className="text-slate-400 mr-3 mt-1">•</span>
                                                    {resp}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="prose prose-slate max-w-none mt-5">
                                        <h3 className="text-[20px] font-medium text-[#0b293d] mb-4">Requirements</h3>
                                        <ul className="space-y-3">
                                            {selectedJob?.requirements?.map((req, i) => (
                                                <li key={i} className="flex items-start text-slate-600 font-light text-[15px]">
                                                    <span className="text-slate-400 mr-3 mt-1">•</span>
                                                    {req}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-slate-100">
                                        <button
                                            onClick={() => setIsApplying(true)}
                                            className="w-full sm:w-auto px-8 py-3 bg-[#f28e2b] hover:bg-[#e07b1a] text-white font-medium rounded-[8px] transition-colors"
                                        >
                                            Apply Now
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
