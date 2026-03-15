'use client';

import Link from 'next/link';
import { FormEvent, useRef, useState } from 'react';
import '../landing.css';
import { LandingNav } from '@/components/landing-nav';
import { LandingFooter } from '@/components/landing-footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

function GrainOverlay() {
  return <div className="landing-grain" aria-hidden />;
}

export default function BookVerificationPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const payload: Record<string, string> = {};
    data.forEach((value, key) => { payload[key] = String(value); });

    setStatus('loading');
    try {
      const res = await fetch(`${API_URL}/contact/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <div data-theme="toronto-concierge" className="min-h-screen">
      <GrainOverlay />
      <LandingNav />

      <section className="landing-section" style={{ paddingTop: 160, background: 'var(--ink)' }}>
        <div className="landing-max">
          <div style={{ marginBottom: 48 }}>
            <p className="landing-label">Request a verification</p>
            <h1 className="landing-heading" style={{ marginTop: 8 }}>
              Book a <em>verification</em>
            </h1>
            <p className="landing-muted" style={{ marginTop: 16, maxWidth: 480 }}>
              Share the property details below. We will confirm availability and send you an exact quote.
            </p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="landing-form"
          >
            <div className="landing-form-group">
              <label htmlFor="name" className="landing-form-label">
                Your name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Full name"
                autoComplete="name"
              />
            </div>
            <div className="landing-form-group">
              <label htmlFor="email" className="landing-form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div className="landing-form-group">
              <label htmlFor="property" className="landing-form-label">
                Property address or listing URL
              </label>
              <input
                id="property"
                name="property"
                type="text"
                required
                placeholder="Address or link to the listing"
              />
            </div>
            <div className="landing-form-group">
              <label htmlFor="viewing" className="landing-form-label">
                Preferred viewing window (optional)
              </label>
              <input
                id="viewing"
                name="viewing"
                type="text"
                placeholder="e.g. Next week, mornings"
              />
            </div>
            <div className="landing-form-group">
              <label htmlFor="message" className="landing-form-label">
                Message (optional)
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Any specific questions or timing constraints..."
                rows={4}
              />
            </div>
            <div className="landing-form-submit">
              <button type="submit" className="landing-btn-primary" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending…' : 'Send request'}
              </button>
            </div>
            {status === 'success' && (
              <p className="landing-muted" style={{ marginTop: 16 }}>
                Request sent — we'll be in touch shortly.
              </p>
            )}
            {status === 'error' && (
              <p className="landing-muted" style={{ marginTop: 16, color: 'var(--danger, #e55)' }}>
                Something went wrong. Please try again or email us directly.
              </p>
            )}
          </form>

          <p className="landing-muted" style={{ marginTop: 48, fontSize: '0.8rem' }}>
            Or email us directly at{' '}
            <a href="mailto:info@ziphvs.com?subject=Verification%20Request" className="landing-cta-email" style={{ fontSize: 'inherit' }}>
              info@ziphvs.com
            </a>
          </p>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
