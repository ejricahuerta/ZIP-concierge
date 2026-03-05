'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const BOOK_CTA = 'Book a Verification';

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`landing-nav ${scrolled ? 'scrolled' : ''}`}
      role="banner"
    >
      <Link href="/" className="landing-nav-logo" aria-label="ZIP Home Rental Verification home">
        ZIP Home Rental Verification
      </Link>
      <div className="landing-nav-right">
        <a href="#offer" className="landing-nav-link">
          What&apos;s Included
        </a>
        <a href="#how" className="landing-nav-link">
          How It Works
        </a>
        <Link
          href="/book"
          className="landing-btn-primary"
          aria-label="Book a verification"
        >
          {BOOK_CTA}
        </Link>
      </div>
    </header>
  );
}
