'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, CalendarCheck, ShieldCheck, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  {
    name: 'Standard',
    price: 149,
    description: 'Essential verification for basic due diligence.',
    features: [
      '15+ exterior and interior photographs',
      'Verification checklist completion',
      'Landlord identity confirmation',
      '48-hour report delivery',
    ],
    cta: 'Get Standard',
    highlighted: false,
  },
  {
    name: 'Comprehensive',
    price: 249,
    description: 'Detailed documentation with video and utility verification.',
    features: [
      '30+ photographs with annotations',
      '5-minute walkthrough video',
      '360° camera walkthrough views',
      'Full checklist with notes',
      'Utility function verification',
      '24-hour report delivery',
    ],
    cta: 'Get Comprehensive',
    highlighted: true,
  },
  {
    name: 'Premium',
    price: 399,
    description: 'Priority scheduling with comprehensive documentation.',
    features: [
      '50+ photographs with annotations',
      '10-minute detailed video tour',
      'Interactive 360° walkthrough',
      'All utility and appliance testing',
      'Landlord interview summary',
      'Same-day report delivery',
      'Priority scheduling within 24 hours',
    ],
    cta: 'Get Premium',
    highlighted: false,
  },
] as const;

/** Service cards for "Our services" – single grid, image left/right alternate */
const SERVICE_ITEMS = [
  {
    title: 'Marketplace for renters',
    description:
      'Browse listings for free. Filter by city, type, and price. Save properties and see which are verified—no payment until you\'re ready.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Person browsing property listings on laptop',
    href: '/properties',
    cta: 'Browse properties',
    variant: 'outline' as const,
  },
  {
    title: 'Property verification',
    description:
      "Can't visit in person? Book an on-site verification. A local operator documents the property and delivers a report with photos, video, and checklist.",
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Property inspection and documentation',
    href: '#services',
    cta: 'View verification packages',
    variant: 'default' as const,
  },
  {
    title: 'Trust & transparency',
    description:
      'Verification badges on listings, real documentation (photos, video, 360°), and landlord identity confirmation to reduce scam risk.',
    image: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Keys and trust in rental',
    href: '/properties',
    cta: 'See verified listings',
    variant: 'outline' as const,
  },
  {
    title: 'For property owners',
    description:
      'List your property, reach remote and international renters, and get verification badges. Manage listings, analytics, and inquiries in one place.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Property owner dashboard',
    href: '/properties',
    cta: 'Got a property to list?',
    variant: 'outline' as const,
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

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const [backgroundOffset, setBackgroundOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      setBackgroundOffset(scrollY * HERO_PARALLAX_SPEED);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#f4f4f5] text-slate-900">
      {/* Hero: full viewport height with sticky nav overlay + parallax background */}
      <section ref={heroRef} className="relative h-screen w-full">
        <SiteNav overlay />
        <Card className="absolute inset-0 overflow-hidden rounded-none border-0 shadow-none sm:rounded-none">
          {/* Parallax background layer: moves slower than scroll */}
          <div
            className="absolute inset-0 scale-105"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.4)), url(https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `translateY(${backgroundOffset}px)`,
              willChange: 'transform',
            }}
            aria-hidden
          />
          <div className="relative flex h-full min-h-0 flex-col items-center justify-center p-6 sm:p-10">
            <div className="relative mx-auto w-full max-w-4xl text-center">
              <Badge variant="secondary" className="mb-4 border-white/30 bg-white/10 text-white">
                See it before you sign
              </Badge>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Rent with confidence. Verify before you sign.
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
                Browse listings for free. When you&apos;re ready, book an on-site verification and get a detailed report with photos, video, and checklist so you know exactly what you&apos;re getting.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" variant="inverse" className="w-fit">
                  <Link href="/properties">Browse properties</Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="w-fit border-white/25 bg-white/15 text-white hover:bg-white/25">
                  <Link href="#services">View verification packages</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-10 sm:py-14">
        {/* Our services – what the business does (aligned with docs BUSINESS_ANALYSIS.md § Services) */}
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Our services</h2>
            <p className="mt-1 text-slate-600">
              We connect renters with property owners and provide on-site verification so you can see it before you sign.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {SERVICE_ITEMS.map((item, index) => {
              const imageLeft = index % 2 === 0;
              return (
                <Card key={item.title} className="overflow-hidden transition-shadow hover:shadow-lg">
                  <div
                    className={`flex flex-col md:flex-row ${imageLeft ? '' : 'md:flex-row-reverse'}`}
                  >
                    <div className="relative h-48 w-full shrink-0 overflow-hidden bg-slate-100 md:h-auto md:min-h-[220px] md:w-2/5">
                      <img
                        src={item.image}
                        alt={item.imageAlt}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center p-5 md:p-6">
                      <CardHeader className="p-0 pb-3">
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                        <CardDescription className="mt-1">{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Button asChild size="sm" variant={item.variant} className="w-fit">
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
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Verification packages</h2>
            <p className="mt-1 text-slate-600">
              Choose the level of detail you need. Pay only when you want a report for a specific property.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {VERIFICATION_PACKAGES.map((pkg) => (
              <Card
                key={pkg.name}
                className={`overflow-hidden transition-shadow hover:shadow-lg ${pkg.highlighted ? 'ring-2 ring-primary' : ''}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    {pkg.highlighted && (
                      <Badge variant="default">Popular</Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-primary">${pkg.price}</p>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-slate-600">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-0.5 text-primary">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full" variant={pkg.highlighted ? 'default' : 'outline'}>
                    <Link href="/properties">{pkg.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500">
            Select a property first, then choose a package at checkout. <Link href="/properties" className="text-primary underline underline-offset-2">Browse properties</Link>
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Frequently asked questions</h2>
            <p className="mt-1 text-slate-600">Common questions about verification and how ZIP works.</p>
          </div>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <Accordion type="single" collapsible defaultValue="what-is-verification" className="w-full">
                {FAQ_ITEMS.map((item) => (
                  <AccordionItem key={item.value} value={item.value} className="border-b px-6 last:border-b-0">
                    <AccordionTrigger className="text-left hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* How it works */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Your home in 3 steps</h2>
            <p className="mt-2 text-slate-600">Simple, transparent, and designed so you only pay when it matters.</p>
          </div>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="relative flex flex-col">
                  <Card className="flex flex-1 flex-col overflow-hidden transition-shadow hover:shadow-lg">
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
                      <p className="mt-2 flex-1 text-sm text-slate-600">{step.desc}</p>
                    </CardContent>
                  </Card>
                  {index < STEPS.length - 1 && (
                    <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 md:block" aria-hidden>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 bg-[#f4f4f5]">
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <Card className="overflow-hidden rounded-2xl border-0 bg-slate-900 text-white">
          <div className="grid gap-6 p-8 sm:p-10 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ready to find your place?</h3>
              <p className="mt-3 text-slate-300">
                Browse listings and book verification only when you&apos;re ready to move.
              </p>
              <Button asChild size="lg" variant="inverse" className="mt-6">
                <Link href="/properties">Start browsing</Link>
              </Button>
            </div>
            <Card className="border-slate-700 bg-slate-800">
              <CardContent className="space-y-4 p-6">
                <Input
                  placeholder="Your email"
                  className="border-slate-600 bg-slate-800 text-white placeholder:text-slate-400"
                />
                <Button variant="inverse" className="w-full">Get updates</Button>
              </CardContent>
            </Card>
          </div>
        </Card>
      </div>
      <SiteFooter />
    </main>
  );
}
