'use client'

import { useState } from 'react'

export function SearchFilters() {
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <div className="section-padding bg-slate-50 border-b border-slate-200">
            <div className="container-prose py-8">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-grow relative">
                        <input
                            type="text"
                            placeholder="Search by title, author, description"
                            className="w-full h-12 pl-12 pr-4 rounded-md border border-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-700 placeholder-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 lg:w-auto w-full">
                        <select className="h-12 px-4 rounded-md border border-slate-300 bg-white text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-w-[160px]">
                            <option>All posts</option>
                            <option>Expert Advice</option>
                            <option>Case Studies</option>
                            <option>News</option>
                        </select>
                        <select className="h-12 px-4 rounded-md border border-slate-300 bg-white text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-w-[160px]">
                            <option>All authors</option>
                            <option>Ritesh Arora</option>
                            <option>Anita Sharma</option>
                        </select>
                        <select className="h-12 px-4 rounded-md border border-slate-300 bg-white text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-w-[160px]">
                            <option>Newest first</option>
                            <option>Oldest first</option>
                            <option>Popular</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}
