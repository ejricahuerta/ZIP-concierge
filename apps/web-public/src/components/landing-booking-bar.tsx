'use client';

import { useEffect, useState } from 'react';

const MAILTO = 'mailto:info@ziphvs.com?subject=Verification%20Request';

export function LandingBookingBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const threshold = typeof window !== 'undefined' ? window.innerHeight * 0.7 : 600;
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`landing-booking-bar ${visible ? 'visible' : ''}`}
      role="complementary"
      aria-label="Book a verification"
    >
      <div className="landing-booking-bar-text">
        <strong>ZIP Home Rental Verification</strong> — Private due diligence for overseas tenants
      </div>
      <a href={MAILTO} className="landing-btn-primary">
        Book a Verification
      </a>
    </div>
  );
}
