import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';

export const metadata = {
  title: 'Terms of Service – ZIP Concierge',
  description: 'Terms and conditions for using ZIP Concierge rental marketplace and verification services.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f4f5]">
      <SiteNav />
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: February 2026</p>

        <div className="mt-10 space-y-8 text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">1. Acceptance</h2>
            <p className="mt-2">
              By accessing or using ZIP Concierge (ZIP, we, our) websites, apps, and services, you agree to these Terms of Service and our <Link href="/privacy" className="text-primary underline underline-offset-2">Privacy Policy</Link>. If you do not agree, do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">2. Description of Services</h2>
            <p className="mt-2">
              ZIP provides a rental marketplace where users can browse property listings and, for a fee, book on-site property verification. Verification is performed by third-party operators; ZIP coordinates the booking and delivery of reports. We do not act as a landlord, tenant, or real estate agent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">3. Eligibility</h2>
            <p className="mt-2">
              You must be at least 18 years old and able to form a binding contract to use our services. By using ZIP, you represent that you meet these requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">4. Accounts</h2>
            <p className="mt-2">
              You may need to create an account to save properties, book verification, or list properties. You are responsible for keeping your credentials secure and for all activity under your account. Notify us promptly of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">5. Use of the Service</h2>
            <p className="mt-2">You agree to use the service only for lawful purposes. You must not:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-700">
              <li>Post false, misleading, or fraudulent content</li>
              <li>Impersonate others or misrepresent your affiliation</li>
              <li>Scrape, automate access, or overload our systems without permission</li>
              <li>Violate any applicable law or third-party rights</li>
            </ul>
            <p className="mt-2">We may suspend or terminate accounts that violate these terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">6. Verification Bookings and Payments</h2>
            <p className="mt-2">
              Verification packages are paid at the time of booking. Prices are in the currency shown (e.g. USD). Refund policy will be stated at checkout; generally, once a verification is scheduled or completed, refunds may be limited. Payment is processed by Stripe; you agree to their terms as applicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">7. Property Listings</h2>
            <p className="mt-2">
              Property owners are responsible for the accuracy of their listings. ZIP does not guarantee the accuracy of listings or verification reports. Renters rely on verification reports at their own discretion; ZIP is not liable for decisions made based on those reports.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">8. Intellectual Property</h2>
            <p className="mt-2">
              ZIP and its logos, design, and content are owned by ZIP or its licensors. You may not copy, modify, or use our branding or content for commercial purposes without our written permission. You retain rights to content you submit (e.g. listing photos); you grant us a license to use it to operate the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">9. Disclaimers</h2>
            <p className="mt-2">
              The service is provided as is. We do not warrant that the service will be uninterrupted or error-free. We are not responsible for the conduct of users, property owners, or verification operators. Verification reports reflect the condition at the time of the visit and do not guarantee future condition or legal status of the property.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">10. Limitation of Liability</h2>
            <p className="mt-2">
              To the maximum extent permitted by law, ZIP and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or data, arising from your use of the service. Our total liability shall not exceed the amount you paid to ZIP in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">11. Governing Law</h2>
            <p className="mt-2">
              These terms are governed by the laws of Canada and the Province of Ontario. Any disputes shall be resolved in the courts of Ontario, unless otherwise required by mandatory law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">12. Changes</h2>
            <p className="mt-2">
              We may update these terms from time to time. We will post the updated terms on this page and update the Last updated date. Continued use of the service after changes constitutes acceptance. Material changes may be communicated by email or in-app notice where appropriate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">13. Contact</h2>
            <p className="mt-2">
              For questions about these terms, contact us at{' '}
              <a href="mailto:legal@zipconcierge.com" className="text-primary underline underline-offset-2">legal@zipconcierge.com</a>.
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
