'use client';

import { type FormEvent, Fragment, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/** Verification packages from BUSINESS_ANALYSIS.md */
const VERIFICATION_PACKAGES = [
  { name: 'Standard', price: 149, description: 'Essential verification for basic due diligence.', features: ['Exterior + interior photo set (15+)', 'On-site verification checklist', 'Landlord identity confirmation', 'Report delivery within 48 hours'], cta: 'Choose Standard', highlighted: false },
  { name: 'Comprehensive', price: 249, description: 'Detailed documentation with video and utility verification.', features: ['Expanded photo set with annotations (30+)', 'Walkthrough video (5 minutes)', '360° camera walkthrough views', 'Full verification checklist with notes', 'Utility functionality verification', 'Report delivery within 24 hours'], cta: 'Choose Comprehensive', highlighted: true },
  { name: 'Premium', price: 399, description: 'Priority scheduling with comprehensive documentation.', features: ['Comprehensive photo set with annotations (50+)', 'Detailed walkthrough video (10 minutes)', 'Interactive 360° walkthrough', 'Utility + appliance functionality checks', 'Landlord interview summary', 'Same-day report delivery', 'Priority scheduling (within 24 hours)'], cta: 'Choose Premium', highlighted: false },
] as const;

/** Service cards for "Our services" – single grid, image left/right alternate */
const SERVICE_ITEMS = [
  {
    title: 'Marketplace for renters',
    description:
      'Browse listings for free. Filter by city, type, and price. Save properties and see which are verified. No payment until you\'re ready.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Person browsing property listings on laptop',
    href: '/properties',
    cta: 'Browse properties',
    icon: Search,
    isPrimary: false,
  },
  {
    title: 'Property verification',
    description:
      "Can't visit in person? Book an on-site verification. A local operator documents the property and delivers a report with photos, video, and checklist.",
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Property inspection and documentation',
    href: '#services',
    cta: 'View packages',
    icon: ClipboardCheck,
    isPrimary: true,
  },
  {
    title: 'Trust & transparency',
    description:
      'Verification badges on listings, real documentation (photos, video, 360°), and landlord identity confirmation to reduce scam risk.',
    image: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Keys and trust in rental',
    href: '/properties',
    cta: 'See verified listings',
    icon: ShieldCheck,
    isPrimary: false,
  },
  {
    title: 'For property owners',
    description:
      'List your property, reach remote and international renters, and get verification badges. Manage listings, analytics, and inquiries in one place.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Property owner dashboard',
    href: '/landlord',
    cta: 'List your property',
    icon: Building2,
    isPrimary: false,
  },
] as const;

const STEPS = [
  {
    num: '01',
    title: 'Find a property',
    desc: 'Browse listings for free. No payment until you\'re ready.',
    icon: Search,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Person browsing property listings',
  },
  {
    num: '02',
    title: 'Book verification',
    desc: 'Choose a package (Standard, Comprehensive, or Premium) and pay only when you want a report.',
    icon: CalendarCheck,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Property verification and documentation',
  },
  {
    num: '03',
    title: 'Decide with confidence',
    desc: 'Review the report, then move forward or walk away, informed.',
    icon: ShieldCheck,
    image: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Keys and moving with confidence',
  },
] as const;

const FAQ_ITEMS = [
  {
    value: 'what-is-verification',
    question: 'What is property verification?',
    answer:
      'Property verification is an on-site inspection by a trained operator. They document the property with photos and video, complete a checklist (condition, utilities, landlord identity), and deliver a report so you can rent with confidence, especially when you can\'t visit in person.',
  },
  {
    value: 'when-do-i-pay',
    question: 'When do I pay for verification?',
    answer:
      'You only pay when you choose to verify a specific property. Browsing listings is free. When you\'re serious about a place and want a report before signing, you select a verification package and pay then.',
  },
  {
    value: 'how-long-report',
    question: 'How long until I get the report?',
    answer:
      'Standard: 48 hours. Comprehensive: 24 hours. Premium: same-day delivery. You\'ll get a link to your report (photos, video, checklist) once the verification is complete.',
  },
  {
    value: 'which-properties',
    question: 'Can I verify any property?',
    answer:
      'Verification is available for properties listed on our platform. If you see a "Verify" option on a listing, you can book a package for that property. Coverage depends on where our verification operators are available.',
  },
  {
    value: 'what-if-mismatch',
    question: 'What if the property doesn\'t match the report?',
    answer:
      'Our reports are produced from a real on-site visit. If you believe the report is inaccurate or the condition has changed significantly, contact support with your report reference. We take accuracy seriously and will work with you to resolve the issue.',
  },
] as const;

/** Parallax factor: 0 = fixed, 1 = scrolls with content. 0.3–0.5 gives a subtle depth effect. */
const HERO_PARALLAX_SPEED = 0.35;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SECTION_TITLE_CLASS = 'text-2xl font-semibold tracking-tight sm:text-3xl';
const SECTION_SUBTITLE_CLASS = 'mt-2 max-w-3xl text-base text-slate-700';

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const [backgroundOffset, setBackgroundOffset] = useState(0);
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleEmailSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setEmailStatus('error');
      return;
    }
    setEmail('');
    setEmailStatus('success');
  };

  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      setBackgroundOffset(window.scrollY * HERO_PARALLAX_SPEED);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f4f5] text-slate-900">
      {/* Hero: full viewport height with sticky nav overlay + parallax background */}
      <section ref={heroRef} className="relative h-screen w-full">
        <SiteNav overlay />
        <Card className="absolute inset-0 overflow-hidden rounded-none border-0 shadow-none sm:rounded-none">
          <div
            className="absolute inset-0 scale-105"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `translateY(${backgroundOffset}px)`,
              willChange: 'transform',
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,23,0.88)_0%,rgba(15,23,42,0.72)_45%,rgba(15,23,42,0.20)_72%,rgba(15,23,42,0)_100%)]"
            aria-hidden
          />
          <div className="relative flex h-full min-h-0 flex-col justify-center p-6 sm:p-10">
            <div className="mx-auto w-full max-w-5xl">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Rent with confidence. Verify before you sign.
              </h1>
              <p className="mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
                Browse listings for free. Book an on-site verification and get a detailed report so you know exactly what you&apos;re getting.
              </p>
              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <Button
                  asChild
                  size="lg"
                  className="h-11 w-full bg-white text-slate-900 hover:bg-white/90 sm:w-auto sm:min-w-[220px]"
                >
                  <Link href="/properties">Browse properties</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-11 w-full border-white/70 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:w-auto sm:min-w-[220px]"
                >
                  <Link href="#services">View packages</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-8 sm:space-y-16 sm:px-6 sm:py-12 md:space-y-20 md:py-16">
        {/* Our services – what the business does (aligned with docs BUSINESS_ANALYSIS.md § Services) */}
        <section className="space-y-8">
          <div>
            <h2 className={SECTION_TITLE_CLASS}>Our services</h2>
            <p className={SECTION_SUBTITLE_CLASS}>
              We connect renters with property owners and provide on-site verification so you can see it before you sign.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {SERVICE_ITEMS.map((item, index) => {
              const imageLeft = index % 2 === 0;
              const ServiceIcon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="overflow-hidden rounded-2xl border-slate-200 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div
                    className={`flex flex-col md:flex-row ${imageLeft ? '' : 'md:flex-row-reverse'}`}
                  >
                    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-slate-100 md:aspect-auto md:min-h-[240px] md:w-2/5">
                      <img
                        src={item.image}
                        alt={item.imageAlt}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
                      <CardHeader className="space-y-3 p-0 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <ServiceIcon className="h-4 w-4" aria-hidden />
                          </span>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                        </div>
                        <CardDescription className="text-base leading-relaxed text-slate-700">
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="mt-4 p-0">
                        <Button asChild variant={item.isPrimary ? 'default' : 'outline'} className="min-w-[180px]">
                          <Link href={item.href}>{item.cta}</Link>
                        </Button>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Verification packages – detail */}
        <section id="services" className="scroll-mt-8 space-y-6">
          <div>
            <h2 className={SECTION_TITLE_CLASS}>Verification packages</h2>
            <p className={SECTION_SUBTITLE_CLASS}>
              Choose the level of detail you need. Pay only when you want a report for a specific property.
            </p>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-slate-700">
            Select a property first, then choose a package at checkout.{' '}
            <Link href="/properties" className="font-medium text-primary underline underline-offset-2">
              Browse properties
            </Link>
            .
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {VERIFICATION_PACKAGES.map((pkg) => (
              <Card
                key={pkg.name}
                className={`relative overflow-hidden rounded-2xl transition-shadow ${
                  pkg.highlighted
                    ? 'border-primary/70 bg-slate-900 text-white shadow-lg md:scale-[1.02]'
                    : 'border-slate-200 bg-white shadow-sm hover:shadow-md'
                }`}
              >
                <CardHeader className={`relative space-y-2 pb-2 ${pkg.highlighted ? 'pr-28' : ''}`}>
                  {pkg.highlighted && (
                    <Badge className="absolute right-4 top-4 shrink-0 px-4 py-1.5 text-xs font-medium bg-white text-slate-900">
                      Popular
                    </Badge>
                  )}
                  <CardTitle className={`text-lg ${pkg.highlighted ? 'text-white' : 'text-slate-900'}`}>
                    {pkg.name}
                  </CardTitle>
                  <p className={`text-2xl font-bold ${pkg.highlighted ? 'text-white' : 'text-primary'}`}>
                    ${pkg.price}
                  </p>
                  <CardDescription className={pkg.highlighted ? 'text-slate-200' : 'text-slate-700'}>
                    {pkg.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className={`space-y-2 text-sm ${pkg.highlighted ? 'text-slate-200' : 'text-slate-700'}`}>
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className={`mt-0.5 ${pkg.highlighted ? 'text-white' : 'text-primary'}`}>✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={pkg.highlighted ? 'w-full bg-white text-slate-900 hover:bg-white/90' : 'w-full'}
                    variant={pkg.highlighted ? 'default' : 'outline'}
                  >
                    <Link href="/properties">{pkg.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-8 space-y-6">
          <div>
            <h2 className={SECTION_TITLE_CLASS}>Frequently asked questions</h2>
            <p className={SECTION_SUBTITLE_CLASS}>Common questions about verification and how ZIP works.</p>
          </div>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <Accordion type="single" collapsible defaultValue="what-is-verification" className="w-full">
                {FAQ_ITEMS.map((item) => (
                  <AccordionItem key={item.value} value={item.value} className="border-b px-4 last:border-b-0 sm:px-6">
                    <AccordionTrigger className="py-5 text-left text-base hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-700">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
          <p className="text-sm text-slate-700">
            Still have questions?{' '}
            <a href="mailto:support@zipconcierge.com" className="font-medium text-primary underline underline-offset-2">
              Contact us
            </a>
            .
          </p>
        </section>

        {/* How it works */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className={SECTION_TITLE_CLASS}>Your home in 3 steps</h2>
            <p className="mt-2 text-base text-slate-700">Simple, transparent, and designed so you only pay when it matters.</p>
          </div>
          <div className="flex flex-col items-center md:flex-row md:items-stretch md:justify-center md:gap-0">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <Fragment key={step.num}>
                  <div className="flex w-full max-w-sm flex-1 flex-col md:max-w-none">
                    <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                        <img
                          src={step.image}
                          alt={step.imageAlt}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                        <div className="absolute bottom-3 left-4 flex items-center gap-2">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md">
                            {step.num}
                          </span>
                          <span className="text-sm font-medium text-white drop-shadow-sm">{step.title}</span>
                        </div>
                        <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 text-white backdrop-blur-sm">
                          <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                        </div>
                      </div>
                      <CardContent className="flex flex-1 flex-col p-5">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-6 w-6" strokeWidth={2} aria-hidden />
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight text-slate-900">{step.title}</h3>
                        <p className="mt-2 flex-1 text-sm text-slate-700">{step.desc}</p>
                      </CardContent>
                    </Card>
                    {/* Mobile: down arrow between stacked steps */}
                    {index < STEPS.length - 1 && (
                      <div className="flex shrink-0 justify-center py-3 md:hidden" aria-hidden>
                        <ChevronDown className="h-6 w-6 text-slate-400" />
                      </div>
                    )}
                  </div>
                  {/* Desktop: arrow between columns only, no lines */}
                  {index < STEPS.length - 1 && (
                    <div
                      className="hidden shrink-0 items-center justify-center self-center px-1 md:flex"
                      aria-hidden
                    >
                      <ChevronRight className="h-8 w-8 text-slate-400" />
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
          <div className="flex justify-center">
            <Button asChild size="lg" className="min-w-[220px]">
              <Link href="/properties">Start browsing</Link>
            </Button>
          </div>
        </section>

        {/* CTA */}
        <Card className="overflow-hidden rounded-2xl border-0 bg-slate-900 text-white">
          <div className="grid gap-8 p-8 sm:p-10 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ready to find your place?</h3>
              <p className="mt-3 text-base text-slate-300">
                Browse listings and book verification only when you&apos;re ready to move.
              </p>
              <Button asChild size="lg" className="mt-6 bg-white text-slate-900 hover:bg-white/90">
                <Link href="/properties">Start browsing</Link>
              </Button>
            </div>
            <Card className="border-slate-700 bg-slate-800">
              <CardContent className="p-6">
                <form className="space-y-4" noValidate onSubmit={handleEmailSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="home-updates-email" className="text-sm text-slate-200">
                      Email
                    </Label>
                    <Input
                      id="home-updates-email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (emailStatus !== 'idle') setEmailStatus('idle');
                      }}
                      placeholder="name@example.com"
                      className="h-11 border-slate-600 bg-slate-800 text-white placeholder:text-slate-400"
                    />
                    <p className="text-xs text-slate-400">New listings + product updates.</p>
                  </div>
                  <Button type="submit" className="w-full bg-white text-slate-900 hover:bg-white/90">
                    Get updates
                  </Button>
                </form>
                {emailStatus === 'success' ? (
                  <p className="mt-3 text-sm text-emerald-300" role="status">
                    Thanks - check your inbox.
                  </p>
                ) : null}
                {emailStatus === 'error' ? (
                  <p className="mt-3 text-sm text-rose-300" role="alert">
                    Enter a valid email.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </Card>
      </div>
      <SiteFooter />
    </main>
  );
}
