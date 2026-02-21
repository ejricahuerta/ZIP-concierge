import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';

export const metadata = {
  title: 'Cookie Policy – ZIP Concierge',
  description: 'How ZIP Concierge uses cookies and similar technologies.',
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#f4f4f5]">
      <SiteNav />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Cookie Policy</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: February 2026</p>

        <div className="mt-10 space-y-8 text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">1. What Are Cookies</h2>
            <p className="mt-2">
              Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, keep you signed in, and understand how the site is used. We also use similar technologies such as local storage and analytics scripts where relevant.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">2. Cookies We Use</h2>
            <p className="mt-2">We use the following types of cookies:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-700">
              <li><strong>Strictly necessary:</strong> Required for the site to function (e.g. authentication, security, load balancing). These cannot be disabled if you want to use the service.</li>
              <li><strong>Functional:</strong> Remember your preferences (e.g. language, region) to improve your experience.</li>
              <li><strong>Analytics:</strong> Help us understand how visitors use our site (e.g. PostHog). This data is aggregated and used to improve the product.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">3. Third-Party Cookies</h2>
            <p className="mt-2">
              Our service may include third-party services that set their own cookies, for example:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-700">
              <li><strong>Stripe:</strong> Payment processing; may set cookies for fraud prevention and checkout.</li>
              <li><strong>PostHog (or similar):</strong> Product analytics to understand usage and improve the service.</li>
              <li><strong>Google Maps:</strong> If we embed maps, Google may set cookies for map functionality.</li>
            </ul>
            <p className="mt-2">These parties have their own privacy and cookie policies.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">4. How Long Cookies Last</h2>
            <p className="mt-2">
              Session cookies are deleted when you close your browser. Persistent cookies remain for a set period (e.g. until you log out or for up to a year) to remember your preferences or support security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">5. Managing Cookies</h2>
            <p className="mt-2">
              You can control cookies through your browser settings. Most browsers let you block or delete cookies; note that blocking strictly necessary cookies may affect how the site works (e.g. you may not stay signed in). For analytics, we aim to respect Do Not Track or similar signals where we can, and you can often opt out via the relevant provider (e.g. PostHog).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">6. More Information</h2>
            <p className="mt-2">
              For how we use personal data collected via cookies and other tracking, see our <Link href="/privacy" className="text-primary underline underline-offset-2">Privacy Policy</Link>. If you have questions about this Cookie Policy, contact us at{' '}
              <a href="mailto:privacy@zipconcierge.com" className="text-primary underline underline-offset-2">privacy@zipconcierge.com</a>.
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
