'use client';

import { useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Briefcase,
  Camera,
  ChevronDown,
  ClipboardList,
  FileText,
  Globe,
  GraduationCap,
  Users,
} from 'lucide-react';
import './landing.css';
import { LandingNav } from '@/components/landing-nav';
import { LandingFooter } from '@/components/landing-footer';

const MAILTO = 'mailto:info@ziphvs.com';
const MAILTO_SUBJECT = 'mailto:info@ziphvs.com?subject=Verification%20Request';

/** Grain overlay – tiled SVG noise (same as HTML reference) */
function GrainOverlay() {
  return <div className="landing-grain" aria-hidden />;
}

const RISKS = [
  {
    icon: AlertTriangle,
    title: 'Rental Fraud Is Rising',
    desc: 'Scammers post photos of properties they don\'t own. Fake landlords collect first and last month\'s rent, then vanish — no recourse, no refund.',
  },
  {
    icon: Camera,
    title: 'Listings Are Designed to Mislead',
    desc: 'Wide-angle lenses make small rooms look spacious. Edited photos hide mould, water damage, and worn fixtures. You only find out on move-in day.',
  },
  {
    icon: FileText,
    title: 'Leases Contain Traps',
    desc: 'Non-standard clauses and illegal terms go unnoticed when you\'re reviewing remotely, under time pressure, in an unfamiliar legal system.',
  },
  {
    icon: Globe,
    title: 'No Way to Verify Remotely',
    desc: 'You cannot smell the hallway, speak to a neighbour, or feel the neighbourhood at 11pm. You are making a $4,000/month decision blind.',
  },
] as const;

const DELIVERABLES = [
  { num: '01', title: 'Private Scheduled Viewing', desc: 'We attend on your behalf at a dedicated time. No group viewings. No rushed walkthroughs. Your exclusive 45–60 minute session.' },
  { num: '02', title: 'Live Zoom Walkthrough', desc: 'Join in real time and direct every step. Ask questions as we move through each room — or receive the full 4K recorded tour on your schedule.' },
  { num: '03', title: 'Deep In-Unit Inspection', desc: 'Moisture checks, damage assessment, appliance condition, smell, light, storage. We look at everything a staged listing is designed to hide.' },
  { num: '04', title: 'Building Common Areas Review', desc: 'Lobby, laundry, parking, mailroom, hallways. The condition of shared spaces tells you everything about how the building is actually managed.' },
  { num: '05', title: 'Neighbourhood Walk Video', desc: 'We walk the immediate area — transit stops, groceries, street safety, noise levels. The real version, not the marketing version.' },
  { num: '06', title: 'Honest Assessment + Lease Scan', desc: 'Would we rent this? We tell you plainly. Plus a review of your lease for unusual or red-flag clauses — not legal advice, but an honest second opinion.' },
] as const;

const CLIENTS = [
  { icon: GraduationCap, name: 'International Students', desc: 'Arriving from India, China, the Middle East. Securing housing months before landing. Family funds on the line, no local network to call on.', spend: 'Typical rent: $2,200 – $3,000 / month\nUpfront exposure: $5,000 – $7,000' },
  { icon: Briefcase, name: 'Relocating Tech Workers', desc: 'Joining a Toronto company with a start date already set. Need somewhere liveable, fast. No time to fly out — no room for a mistake.', spend: 'Typical rent: $3,000 – $4,500 / month\nUpfront exposure: $6,000 – $9,000' },
  { icon: Users, name: 'Immigrating Families', desc: 'Planning a permanent move. Children\'s schools decided. Cannot risk a fraudulent landlord, a dangerous building, or a unit that doesn\'t match the listing.', spend: 'Typical rent: $3,200 – $4,800 / month\nUpfront exposure: $7,000 – $10,000' },
] as const;

const STEPS = [
  { num: 1, title: 'Share the Listing', desc: 'Send us the property address and your preferred viewing window. We confirm availability and quote your exact price within the hour.' },
  { num: 2, title: 'We Book the Viewing', desc: 'We contact the landlord or agent and arrange a private session — coordinated around your timezone and Zoom availability.' },
  { num: 3, title: 'Live Walkthrough', desc: 'Join on Zoom and direct the inspection in real time. Or receive the full 4K recorded walkthrough within a few hours.' },
  { num: 4, title: 'Same-Day Report', desc: 'Your PDF lands the same evening — photos, findings, red flags, and our honest recommendation. You decide with full information.' },
] as const;

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    el.querySelectorAll('.reveal').forEach((node) => obs.observe(node));
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={containerRef} data-theme="toronto-concierge" className="min-h-screen">
      <GrainOverlay />
      <LandingNav />

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-glow" aria-hidden />
        <div className="landing-hero-rule" aria-hidden />
        <div className="landing-hero-inner">
          <p className="landing-hero-label">Private Rental Due Diligence · Toronto, Canada</p>
          <h1 className="landing-hero-title">
            Before you send
            <br />
            the deposit,
            <br />
            <em>send someone you trust.</em>
          </h1>
          <p className="landing-hero-sub">
            You&apos;re signing a lease from 10,000 km away. We inspect, verify, and report back with the honesty of a trusted friend on the ground — not a listing agent.
          </p>
          <div className="landing-hero-actions">
            <a href="#offer" className="landing-btn-primary">
              See What&apos;s Included
            </a>
            <a href={MAILTO} className="landing-btn-ghost">
              Book a Verification
            </a>
          </div>
          <div className="landing-hero-stats">
            <div className="landing-hero-stat">
              <span className="landing-hero-stat-num">$5K+</span>
              <span className="landing-hero-stat-label">
                Typical deposit
                <br />
                at risk
              </span>
            </div>
            <div className="landing-hero-stat">
              <span className="landing-hero-stat-num">4K</span>
              <span className="landing-hero-stat-label">
                Video
                <br />
                walkthrough
              </span>
            </div>
            <div className="landing-hero-stat">
              <span className="landing-hero-stat-num">Same Day</span>
              <span className="landing-hero-stat-label">
                PDF report
                <br />
                delivered
              </span>
            </div>
          </div>
        </div>
        <a href="#offer" className="landing-scroll-hint" aria-label="Scroll to content">
          <div className="landing-scroll-line" aria-hidden />
        </a>
      </section>

      {/* Problem */}
      <section className="landing-section" style={{ background: 'var(--ink)' }}>
        <div className="landing-max">
          <p className="landing-label reveal">The Risk Is Real</p>
          <div className="landing-problem-grid">
            <div className="reveal">
              <h2 className="landing-heading landing-problem-heading">
                Renting in Toronto
                <br />
                from abroad is
                <br />
                <em>genuinely dangerous.</em>
                <p>
                  The Toronto rental market moves fast, and overseas tenants have no way to verify what they&apos;re being shown. Thousands of dollars are committed on the basis of six photos and a floor plan.
                </p>
              </h2>
            </div>
            <ul className="landing-risk-list reveal">
              {RISKS.map((risk) => {
                const RiskIcon = risk.icon;
                return (
                  <li key={risk.title} className="landing-risk-item">
                    <span className="landing-risk-icon" aria-hidden>
                      <RiskIcon className="landing-risk-icon-svg" strokeWidth={1.5} />
                    </span>
                    <div className="landing-risk-text">
                      <strong>{risk.title}</strong>
                      <p>{risk.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Quote strip */}
      <div className="landing-quote-strip">
        <div className="landing-quote-inner reveal">
          <p className="landing-quote-text">
            &quot;Before you send a $5,000 deposit, have someone you trust on the ground.&quot;
          </p>
          <span className="landing-quote-attr">ZIP Home Rental Verification — Our Promise</span>
        </div>
      </div>

      {/* Offer */}
      <section className="landing-section landing-offer" id="offer" style={{ background: 'var(--slate)' }}>
        <div className="landing-max landing-offer-inner">
          <div className="landing-offer-top reveal">
            <div>
              <p className="landing-label">Rental Verification Concierge</p>
              <h2 className="landing-heading">
                Everything you need to decide
                <br />
                with <em>complete confidence.</em>
              </h2>
            </div>
            <div className="landing-offer-price">
              <p className="landing-price-eyebrow">Starting from</p>
              <div className="landing-price-num">$350</div>
              <p className="landing-price-suffix">$350 – $500 per property</p>
            </div>
          </div>
          <div className="landing-deliverables reveal">
            {DELIVERABLES.map((d) => (
              <div key={d.num} className="landing-dlv">
                <div className="landing-dlv-num">{d.num}</div>
                <div className="landing-dlv-title">{d.title}</div>
                <div className="landing-dlv-desc">{d.desc}</div>
              </div>
            ))}
          </div>
          <div className="landing-offer-footer reveal">
            <span className="landing-offer-footer-icon" aria-hidden>
              <ClipboardList className="landing-offer-footer-icon-svg" strokeWidth={1.5} />
            </span>
            <p className="landing-offer-footer-text">
              Delivered the <strong>same evening:</strong> a full PDF report with photos, findings, red flags, and a clear recommendation. Decide with confidence before you commit a cent.
            </p>
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="landing-section" style={{ background: 'var(--slate)' }}>
        <div className="landing-max">
          <div className="reveal">
            <p className="landing-label">Who We Serve</p>
            <h2 className="landing-heading">
              Those who <em>cannot afford
              <br />
              to get it wrong.</em>
            </h2>
          </div>
          <div className="landing-client-cards" style={{ marginTop: 60 }}>
            {CLIENTS.map((c, i) => {
                const ClientIcon = c.icon;
                return (
                  <div key={c.name} className="landing-client-card reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
                    <span className="landing-client-icon" aria-hidden>
                      <ClientIcon className="landing-client-icon-svg" strokeWidth={1.5} />
                    </span>
                    <div className="landing-client-name">{c.name}</div>
                <div className="landing-client-desc">{c.desc}</div>
                <div className="landing-client-spend">{c.spend}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Math */}
      <section className="landing-section" style={{ background: 'var(--ink)' }}>
        <div className="landing-max" style={{ textAlign: 'center', maxWidth: 860 }}>
          <div className="reveal">
            <p className="landing-label">The Simple Calculation</p>
            <h2 className="landing-heading">The math is <em>undeniable.</em></h2>
            <p className="landing-muted" style={{ marginBottom: 60, fontWeight: 300 }}>
              At Toronto rent prices, $400 for certainty is not an expense.
            </p>
          </div>
          <div className="landing-math-boxes reveal">
            <div className="landing-math-box danger">
              <div className="landing-math-box-eyebrow">Your Risk Without Us</div>
              <div className="landing-math-amount">$8,000</div>
              <div className="landing-math-desc">
                Deposit + first & last month&apos;s rent. Gone if the property is misrepresented, fraudulent, or unliveable on arrival.
              </div>
            </div>
            <div className="landing-math-vs-cell">
              <span className="landing-math-vs">vs</span>
            </div>
            <div className="landing-math-box safe">
              <div className="landing-math-box-eyebrow">Cost of Certainty</div>
              <div className="landing-math-amount">$400</div>
              <div className="landing-math-desc">
                One honest verification. One same-day report. One trusted person on the ground before you commit a cent.
              </div>
            </div>
          </div>
          <p className="landing-math-conclusion reveal">
            For the cost of a single dinner in downtown Toronto, you protect a financial commitment most people make once and cannot undo.{' '}
            <strong>$400 for certainty is not an expense — it&apos;s the most rational decision you&apos;ll make in your entire move.</strong>
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="landing-section" id="how" style={{ background: 'var(--slate)' }}>
        <div className="landing-max">
          <div className="landing-process-top reveal">
            <div>
              <p className="landing-label">How It Works</p>
              <h2 className="landing-heading">
                Simple. Fast.
                <br />
                <em>No surprises.</em>
              </h2>
            </div>
            <div className="landing-process-time">
              Turnaround: same day
              <br />
              Availability: limited weekly slots
            </div>
          </div>
          <div className="landing-process-steps reveal">
            <div className="landing-process-track" aria-hidden />
            {STEPS.map((step) => (
              <div key={step.num} className="landing-step">
                <div className="landing-step-circle">{step.num}</div>
                <div className="landing-step-title">{step.title}</div>
                <div className="landing-step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta" id="book" style={{ background: 'var(--ink)' }}>
        <div className="landing-cta-inner">
          <p className="landing-label reveal" style={{ textAlign: 'center' }}>
            Ready to proceed safely?
          </p>
          <h2 className="landing-cta-heading reveal">
            Secure your inspection.
            <em>Secure your home.</em>
          </h2>
          <p className="landing-cta-sub reveal">
            We take a limited number of verifications each week to ensure every client receives our complete attention. Reach out now to check availability for your property.
          </p>
          <p className="landing-cta-availability reveal">
            Limited weekly slots available · Response within 2 hours
          </p>
          <div className="landing-cta-actions reveal">
            <a href={MAILTO_SUBJECT} className="landing-btn-primary">
              Request a Verification
            </a>
            <span className="landing-cta-email-label">Or write to us directly</span>
            <a href={MAILTO} className="landing-cta-email">
              info@ziphvs.com
            </a>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
