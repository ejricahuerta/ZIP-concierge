import Link from 'next/link';

const MAILTO = 'mailto:info@ziphvs.com';

export function LandingFooter() {
  return (
    <footer className="landing-footer" role="contentinfo">
      <Link href="/" className="landing-footer-logo" aria-label="ZIP Home Rental Verification home">
        ZIP Home Rental Verification
      </Link>
      <nav className="landing-footer-links" aria-label="Footer navigation">
        <a href="#offer" className="landing-footer-link">
          What&apos;s Included
        </a>
        <a href="#how" className="landing-footer-link">
          How It Works
        </a>
        <a href={MAILTO} className="landing-footer-link">
          Contact
        </a>
      </nav>
      <p className="landing-footer-note">
        Toronto, Canada · Not a licensed real estate brokerage · Lease review is not legal advice.
      </p>
    </footer>
  );
}
