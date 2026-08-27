import { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Privacy Policy | Ritesh Arora & Associates',
  description:
    'How Ritesh Arora & Associates collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="This policy explains what personal information we collect, why we collect it, and how we protect it."
      lastUpdated="27 August 2026"
      sections={[
        {
          title: '1. Who we are',
          paragraphs: [
            'Ritesh Arora & Associates (“we”, “us”, or “our”) operates this website and provides chartered accountancy, tax, compliance, and related professional services.',
            'This Privacy Policy applies to information collected through our website, contact forms, newsletter signup (when enabled), and related communications.',
          ],
        },
        {
          title: '2. Information we collect',
          paragraphs: [
            'We may collect the following categories of information:',
          ],
          bullets: [
            'Identity and contact details — such as name, email address, phone number, and organisation name.',
            'Enquiry details — messages, service interests, and other information you choose to share in forms or emails.',
            'Technical data — IP address, browser type, device information, and pages visited, collected through standard web logs or analytics where used.',
            'Communication records — emails and call notes related to your enquiry or engagement.',
          ],
        },
        {
          title: '3. How we use your information',
          paragraphs: [
            'We use personal information to:',
          ],
          bullets: [
            'Respond to enquiries and provide requested information.',
            'Deliver professional services under an engagement with you or your organisation.',
            'Send service-related updates, and marketing or newsletter content where you have opted in.',
            'Improve our website, security, and user experience.',
            'Comply with legal, regulatory, and professional obligations.',
          ],
        },
        {
          title: '4. Legal basis and consent',
          paragraphs: [
            'Where required, we process personal data based on your consent, our legitimate interests in operating and improving our practice, performance of a contract, or compliance with legal obligations.',
            'You may withdraw marketing consent at any time by contacting us or using unsubscribe options where available.',
          ],
        },
        {
          title: '5. Sharing of information',
          paragraphs: [
            'We do not sell your personal information. We may share information only:',
          ],
          bullets: [
            'With service providers who help us operate our website, email, or IT systems, under appropriate confidentiality obligations.',
            'With professional advisers or authorities where required by law or professional standards.',
            'With your consent, or as otherwise disclosed at the time of collection.',
          ],
        },
        {
          title: '6. Data retention',
          paragraphs: [
            'We retain personal information only as long as needed for the purposes described above, including professional record-keeping, dispute resolution, and legal or regulatory requirements. Retention periods may vary by document type and applicable rules.',
          ],
        },
        {
          title: '7. Security',
          paragraphs: [
            'We take reasonable technical and organisational measures to protect personal information against unauthorised access, loss, misuse, or alteration. No method of transmission or storage is completely secure; please contact us promptly if you believe your information has been compromised.',
          ],
        },
        {
          title: '8. Cookies and similar technologies',
          paragraphs: [
            'Our website may use cookies or similar technologies that are necessary for site function, or for analytics and performance. You can control cookies through your browser settings. Disabling certain cookies may affect site functionality.',
          ],
        },
        {
          title: '9. Your rights',
          paragraphs: [
            'Subject to applicable law, you may request access to, correction of, or deletion of your personal information, or raise a concern about how we handle it. To exercise these rights, contact us using the details below.',
          ],
        },
        {
          title: '10. Children’s privacy',
          paragraphs: [
            'Our website and services are intended for business and professional users. We do not knowingly collect personal information from children.',
          ],
        },
        {
          title: '11. Changes to this policy',
          paragraphs: [
            'We may update this Privacy Policy from time to time. The “Last updated” date at the top of this page will reflect the latest revision. We encourage you to review this page periodically.',
          ],
        },
        {
          title: '12. Contact',
          paragraphs: [
            'For privacy-related questions or requests, email admin@riteshglobalca.com or reach us via the Contact page on this website.',
          ],
        },
      ]}
    />
  )
}
