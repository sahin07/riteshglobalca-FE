import { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Ritesh Arora & Associates',
  description:
    'Terms and conditions for using the Ritesh Arora & Associates website and professional services.',
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      subtitle="Please read these terms carefully before using our website or engaging our professional services."
      lastUpdated="27 August 2026"
      sections={[
        {
          title: '1. About us',
          paragraphs: [
            'These Terms & Conditions govern your use of the website operated by Ritesh Arora & Associates (“we”, “us”, or “our”), Chartered Accountants, and any enquiry or engagement initiated through this website.',
            'By accessing or using this website, you agree to these terms. If you do not agree, please discontinue use of the site.',
          ],
        },
        {
          title: '2. Website information',
          paragraphs: [
            'Content on this website is provided for general information only. It does not constitute legal, tax, accounting, or other professional advice, and should not be relied upon as a substitute for advice tailored to your specific circumstances.',
            'We make reasonable efforts to keep information accurate and up to date, but we do not warrant that all content is complete, current, or error-free.',
          ],
        },
        {
          title: '3. Professional services',
          paragraphs: [
            'Any professional engagement with us is subject to a separate engagement letter, scope of work, and applicable professional standards and regulations.',
            'Fees, timelines, and deliverables will be agreed in writing for each assignment. Website descriptions of services are indicative and may vary based on your facts and applicable law.',
          ],
        },
        {
          title: '4. User responsibilities',
          bullets: [
            'Provide accurate and complete information when submitting forms or making enquiries.',
            'Do not misuse the website, attempt unauthorised access, or interfere with its operation.',
            'Do not use website content in a misleading way or for unlawful purposes.',
            'Ensure you have authority to share any business or personal information you submit.',
          ],
        },
        {
          title: '5. Intellectual property',
          paragraphs: [
            'All branding, text, graphics, logos, and other materials on this website are owned by or licensed to Ritesh Arora & Associates, unless otherwise stated.',
            'You may view and print pages for personal, non-commercial use. You may not copy, modify, distribute, or exploit content for commercial purposes without our prior written consent.',
          ],
        },
        {
          title: '6. Third-party links',
          paragraphs: [
            'This website may include links to third-party sites. We are not responsible for the content, policies, or practices of those sites. Accessing them is at your own risk.',
          ],
        },
        {
          title: '7. Limitation of liability',
          paragraphs: [
            'To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential loss arising from your use of this website or reliance on its content.',
            'Nothing in these terms excludes liability that cannot be excluded under applicable law, including liability for fraud or wilful misconduct.',
          ],
        },
        {
          title: '8. Privacy',
          paragraphs: [
            'How we collect and use personal information is described in our Privacy Policy. By using this website, you acknowledge that policy.',
          ],
        },
        {
          title: '9. Changes to these terms',
          paragraphs: [
            'We may update these Terms & Conditions from time to time. The “Last updated” date at the top of this page will reflect the latest revision. Continued use of the website after changes means you accept the updated terms.',
          ],
        },
        {
          title: '10. Governing law',
          paragraphs: [
            'These terms are governed by the laws of India. Courts in India shall have exclusive jurisdiction over disputes arising from these terms or use of this website, subject to any mandatory consumer protections that apply.',
          ],
        },
        {
          title: '11. Contact',
          paragraphs: [
            'For questions about these Terms & Conditions, contact us at admin@riteshglobalca.com or through our Contact page.',
          ],
        },
      ]}
    />
  )
}
