'use client';
import React, { useEffect } from "react";

export default function SEO({ seo }: any) {
    useEffect(() => {
        if (!seo) return;

        // Update title
        if (seo.metaTitle) {
            document.title = seo.metaTitle;
        }

        // Update meta description
        if (seo.metaDescription) {
            let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = "description";
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = seo.metaDescription;
        }

        // Update keywords
        if (seo.keywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
            if (!metaKeywords) {
                metaKeywords = document.createElement('meta');
                metaKeywords.name = "keywords";
                document.head.appendChild(metaKeywords);
            }
            metaKeywords.content = seo.keywords;
        }

        // Optional: Clean up if needed, though usually not for SEO
    }, [seo]);

    return null;
}
