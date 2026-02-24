import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';

export const metadata = {
  title: 'Privacy Policy – ZIP Concierge',
  description: 'How ZIP Concierge collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f4f5]">
      <SiteNav />
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: February 2026</p>

        <div className="mt-10 space-y-8 text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">1. Introduction</h2>
            <p className="mt-2">
              ZIP Concierge (&quot;we&quot;, &quot;our&quot;, or &quot;ZIP&quot;) operates a rental marketplace and property verification service. We are committed to protecting your privacy and complying with applicable privacy laws, including Canada&apos;s Personal Information Protection and Electronic Documents Act (PIPEDA). This policy explains how we collect, use, disclose, and safeguard your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">2. Information We Collect</h2>
            <p className="mt-2">We may collect:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-700">
              <li>Personal information (name, email, phone)</li>
              <li>Account information and login credentials</li>
              <li>Property listing information (if you are an owner)</li>
              <li>Payment information (processed by Stripe; we do not store card numbers)</li>
              <li>Usage data (e.g. analytics to improve our services)</li>
              <li>Location data (only with your consent, e.g. for property search)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">3. How We Use Information</h2>
            <p className="mt-2">We use your information to:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-700">
              <li>Provide and improve our marketplace and verification services</li>
              <li>Process payments and verification bookings</li>
              <li>Send you notifications about properties and bookings</li>
              <li>Analyze usage (e.g. via PostHog) to improve the product</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">4. Information Sharing</h2>
            <p className="mt-2">
              We may share your information with property owners (for inquiries and bookings), service providers (e.g. Stripe, Cloudinary, hosting) under strict agreements, and where required by law. We do not sell your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">5. Data Security</h2>
            <p className="mt-2">
              We use encryption in transit (HTTPS) and at rest, secure servers, access controls, and regular security practices. Payment data is handled by Stripe and is not stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">6. Your Rights</h2>
            <p className="mt-2">You have the right to:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-700">
              <li>Access and download your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of marketing communications</li>
            </ul>
            <p className="mt-2">Contact us at the address below to exercise these rights.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">7. Data Retention</h2>
            <p className="mt-2">
              We retain active account data while your account is in use. Inactive accounts may be deleted after a defined period. Verification and payment records may be retained longer where required by law (e.g. tax or legal obligations).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">8. Cookies and Tracking</h2>
            <p className="mt-2">
              We use cookies and similar technologies for essential functionality, analytics, and preferences. For details, see our <Link href="/cookies" className="text-primary underline underline-offset-2">Cookie Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">9. International Transfers</h2>
            <p className="mt-2">
              Data may be processed in Canada and the United States. We ensure appropriate safeguards with service providers. By using our services, you consent to such transfer where applicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">10. Children&apos;s Privacy</h2>
            <p className="mt-2">
              Our service is intended for users 18 years of age or older. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">11. Changes</h2>
            <p className="mt-2">
              We may update this policy from time to time. We will post the updated policy on this page and update the &quot;Last updated&quot; date. Continued use of our services after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">12. Contact</h2>
            <p className="mt-2">
              For privacy inquiries or to exercise your rights, contact our Privacy Officer:
            </p>
            <p className="mt-2">
              Email: <a href="mailto:privacy@zipconcierge.com" className="text-primary underline underline-offset-2">privacy@zipconcierge.com</a>
            </p>
            <p className="mt-2 text-sm text-slate-600">
              We aim to respond within 30 days. You may also lodge a complaint with the Office of the Privacy Commissioner of Canada.
            </p>
          </section>
        </div>

        <p className="mt-12 text-sm text-slate-500">
          <Link href="/" className="text-primary underline underline-offset-2">Back to home</Link>
        </p>
      </article>
      <SiteFooter />
    </main>
  );
}
