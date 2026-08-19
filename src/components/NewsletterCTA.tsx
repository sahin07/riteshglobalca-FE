'use client' // Added to make it safe for your client-side detail page

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getBlogSubscribe } from '@/lib/strapi'
import { NewsletterForm } from './NewsletterForm'

export function NewsletterCTA() {
    const [subscribeData, setSubscribeData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Handle the async data fetching inside a client side effect hook
        getBlogSubscribe()
            .then((data) => {
                setSubscribeData(data)
                setLoading(false)
            })
            .catch((err) => {
                console.error("Error fetching newsletter config:", err)
                setLoading(false)
            })
    }, [])

    // While loading configuration, return a matching empty layout skeleton to avoid layout shifts
    if (loading) {
        return <section className="relative py-12 md:py-16 bg-[#0a2e3b] overflow-hidden border-t border-slate-800 h-[200px]" />
    }

    const title = subscribeData?.subscribeTitle || "Subscribe to our newsletter"
    const placeholder = subscribeData?.subscribePlaceholder || "Enter your email address"
    const buttonText = subscribeData?.subscribeButtonText || "Subscribe"
    const disclaimer = subscribeData?.subscribeDisclaimer || "We protect your data."
    const privacyText = subscribeData?.privacyPolicyLinkText || "Privacy Policy"
    const privacyUrl = subscribeData?.privacyPolicyLinkUrl

    return (
        <section className="relative py-12 md:py-16 bg-[#0a2e3b] overflow-hidden border-t border-slate-800">
            {/* Background Pattern: Sunburst radiating from the bottom center */}
            <div
                className="absolute inset-0 opacity-90"
                style={{
                    backgroundImage: "repeating-conic-gradient(from 270deg at 50% 130%, rgba(255,255,255,0.04) 0deg 1.5deg, transparent 1.5deg 3deg)"
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto px-4">
                {/* Heading */}
                <h2 className="text-[24px] md:text-[32px] font-bold text-white mb-6 md:mb-8 tracking-tight text-center">
                    {title}
                </h2>

                {/* Form and Disclaimer Horizontal Layout */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-8 max-w-5xl mx-auto">
                    <NewsletterForm placeholder={placeholder} buttonText={buttonText} />

                    {/* Disclaimer Text */}
                    <p className="text-[13px] text-white/80 max-w-sm leading-relaxed text-center lg:text-left">
                        {disclaimer}{" "}
                        {privacyUrl ? (
                            <Link href={privacyUrl} className="underline cursor-pointer hover:text-white transition-colors">
                                {privacyText}
                            </Link>
                        ) : (
                            <span className="underline cursor-pointer hover:text-white transition-colors">{privacyText}</span>
                        )}
                    </p>
                </div>
            </div>
        </section>
    )
}