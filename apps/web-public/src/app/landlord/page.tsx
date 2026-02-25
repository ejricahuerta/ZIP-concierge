'use client';

import { type FormEvent, Fragment, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Building2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Globe,
  Home,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

const VALUE_PROPS = [
  {
    title: 'Stand Out with a ZIP Property Assessment',
    description:
      'The ZIP Property Assessment confirms: the property details are accurate, photos reflect the actual unit, and landlord or ownership documentation is reviewed. For renters moving from abroad, trust is everything. The assessment reduces uncertainty and increases serious inquiries.',
    tagline: 'More confidence → More inquiries → Faster leases.',
    cta: 'Complete the Property Assessment',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Property verification and documentation',
    icon: Home,
  },
  {
    title: 'Help Renters Commit Without In-Person Viewings',
    description:
      'Many international tenants can\'t tour properties before arrival. The ZIP Property Assessment gives them structured reassurance that your listing is legitimate and documented, making them far more comfortable committing remotely.',
    cta: 'Start My Listing',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Person browsing listings on laptop',
    icon: Globe,
  },
  {
    title: 'Financially Reliable, Commitment-Ready Renters',
    description:
      'Our renters are primarily international students and remote professionals who: provide financial documentation, pay on time, are prepared to put down deposits or upfront rent, and actively search for assessed listings. You\'re connecting with renters ready to secure housing, not just browsing.',
    cta: 'List My Property',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Students and professionals in a modern space',
    icon: Briefcase,
  },
] as const;

const STEPS = [
  {
    num: '01',
    title: 'List Your Property',
    desc: 'Add photos, pricing, and availability in minutes.',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Property listing',
  },
  {
    num: '02',
    title: 'Complete the ZIP Property Assessment',
    desc: 'Submit documentation and confirm listing details to increase renter confidence.',
    icon: ClipboardCheck,
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Property assessment and documentation',
  },
  {
    num: '03',
    title: 'Receive Serious Inquiries',
    desc: 'Connect with financially prepared tenants ready to move forward.',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Tenants and inquiries',
  },
] as const;

const FAQ_ITEMS = [
  {
    value: 'what-is-assessment',
    question: 'What is a ZIP Property Assessment?',
    answer:
      "It's a structured documentation review that confirms listing accuracy and landlord identity. It helps renters, especially those abroad, feel confident committing to your property.",
  },
  {
    value: 'who-can-list',
    question: 'Who can list a property?',
    answer: 'Any landlord or property owner can create a listing on ZIP.',
  },
  {
    value: 'fee-to-list',
    question: 'Is there a fee to list?',
    answer:
      'Listing is free. Additional services may vary depending on location.',
  },
  {
    value: 'what-is-verification',
    question: 'What does verification mean for my listing?',
    answer:
      'Verification is an on-site visit by a trained operator who documents your property (photos, checklist, and optionally video). Once complete, your listing gets a verification badge so renters know it’s real and accurately represented. It helps build trust and can lead to more serious inquiries.',
  },
  {
    value: 'who-are-renters',
    question: 'Who are the renters on ZIP?',
    answer:
      'Our renters are predominantly international students and remote workers who can’t always visit in person. They tend to be financially reliable, pay on time, and are often able to put down substantial deposits or upfront rent. Many are looking for medium- to long-term leases and take good care of properties.',
  },
  {
    value: 'how-do-renters-find',
    question: 'How do renters find my property?',
    answer:
      'Renters browse listings on ZIP by city, type, and price. Verified listings are highlighted so renters looking for documented, trustworthy options can find you. When they’re interested, they can reach out or book a verification if they want a detailed report before signing.',
  },
] as const;

const SECTION_TITLE_CLASS = 'text-2xl font-semibold tracking-tight sm:text-3xl';
const SECTION_SUBTITLE_CLASS = 'mt-2 max-w-3xl text-base text-slate-700';
const DASHBOARD_URL = '/landlord/dashboard';

export default function LandlordPage() {
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleEmailSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      setEmailStatus('error');
      return;
    }
    setEmail('');
    setEmailStatus('success');
  };

  return (
    <main className="min-h-screen bg-[#f4f4f5] text-slate-900 overflow-x-hidden">
      {/* Hero */}
      <section className="relative h-screen w-full">
        <SiteNav overlay />
        <Card className="absolute inset-0 overflow-hidden rounded-none border-0 shadow-none">
          <div
            className="absolute inset-0 scale-105"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.5)), url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            aria-hidden
          />
          <div className="relative flex h-full min-h-0 flex-col justify-center p-6 sm:p-10">
            <div className="mx-auto w-full max-w-5xl">
              <Badge
                variant="secondary"
                className="mb-4 border-white/30 bg-white/10 text-white"
              >
                For property owners
              </Badge>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Fill Your Vacancy with Qualified International Tenants, Faster.
              </h1>
              <p className="mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
                List your property on ZIP and complete a <strong>ZIP Property Assessment</strong> so serious renters can confidently commit, even without an in-person visit.
              </p>
              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <Button
                  asChild
                  size="lg"
                  className="h-11 w-full bg-white text-slate-900 hover:bg-white/90 sm:w-auto sm:min-w-[220px]"
                >
                  <Link href={DASHBOARD_URL}>Start My Free Listing</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-11 w-full border-white/70 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:w-auto sm:min-w-[220px]"
                >
                  <Link href="#property-assessment">How the Property Assessment Works</Link>
                </Button>
              </div>
              <p className="mt-3 text-sm text-white/80">
                Free to list. No obligation. Takes minutes.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-8 sm:space-y-16 sm:px-6 sm:py-12 md:space-y-20 md:py-16">
        {/* Value props */}
        <section className="space-y-6 sm:space-y-8">
          <div>
            <h2 className={SECTION_TITLE_CLASS}>Why Landlords Choose ZIP</h2>
            <p className={SECTION_SUBTITLE_CLASS}>
              Reduce vacancy risk. Attract reliable tenants. Close leases faster.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {VALUE_PROPS.map((item, index) => {
              const imageLeft = index % 2 === 0;
              const Icon = item.icon;
              const hasTagline = 'tagline' in item && item.tagline;
              const cta = 'cta' in item ? item.cta : null;
              const isFirst = index === 0;
              return (
                <Card
                  key={item.title}
                  id={isFirst ? 'property-assessment' : undefined}
                  className={`relative overflow-hidden rounded-2xl border-slate-200 pt-0 shadow-sm transition-shadow hover:shadow-md ${isFirst ? 'scroll-mt-8' : ''}`}
                >
                  <div
                    className={`flex flex-col md:flex-row ${imageLeft ? '' : 'md:flex-row-reverse'}`}
                  >
                    <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-slate-100 md:aspect-[16/10] md:min-h-[240px] md:w-2/5">
                      <div className="absolute inset-0 z-30 bg-black/35" aria-hidden />
                      <img
                        src={item.image}
                        alt={item.imageAlt}
                        className="relative z-20 h-full w-full object-cover brightness-60 dark:brightness-40"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
                      <CardHeader className="space-y-3 p-0 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" aria-hidden />
                          </span>
                          <CardTitle className="text-xl leading-tight">{item.title}</CardTitle>
                        </div>
                        <CardDescription className="text-base leading-relaxed text-slate-700">
                          {item.description}
                        </CardDescription>
                        {hasTagline && (
                          <p className="text-sm font-medium text-slate-800">
                            {(item as { tagline: string }).tagline}
                          </p>
                        )}
                      </CardHeader>
                      {cta && (
                        <CardFooter className="p-0 pt-2">
                          <Button asChild size="sm" className="w-fit">
                            <Link href={DASHBOARD_URL}>{cta}</Link>
                          </Button>
                        </CardFooter>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-8 space-y-8">
          <div className="text-center">
            <h2 className={SECTION_TITLE_CLASS}>How ZIP Works for Landlords</h2>
            <p className={SECTION_SUBTITLE_CLASS}>
              List once, complete the assessment, and receive serious inquiries from financially prepared tenants.
            </p>
          </div>
          <div className="flex flex-col items-center md:flex-row md:items-stretch md:justify-center md:gap-0">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <Fragment key={step.num}>
                  <div className="flex w-full max-w-sm flex-1 flex-col md:max-w-none">
                    <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border-slate-200 pt-0 shadow-sm transition-shadow hover:shadow-md">
                      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                        <div className="absolute inset-0 z-30 bg-black/35" aria-hidden />
                        <img
                          src={step.image}
                          alt={step.imageAlt}
                          className="relative z-20 h-full w-full object-cover brightness-60 dark:brightness-40"
                        />
                        <div className="absolute bottom-3 left-4 z-40 flex items-center gap-2">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md">
                            {step.num}
                          </span>
                          <span className="text-sm font-medium text-white drop-shadow-sm">
                            {step.title}
                          </span>
                        </div>
                        <div className="absolute right-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 text-white backdrop-blur-sm">
                          <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                        </div>
                      </div>
                      <CardHeader className="flex flex-1 flex-col gap-3 p-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-6 w-6" strokeWidth={2} aria-hidden />
                        </div>
                        <CardTitle className="text-lg font-semibold leading-tight tracking-tight text-slate-900">
                          {step.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-700">{step.desc}</CardDescription>
                      </CardHeader>
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
          <div className="flex flex-col items-center gap-2 text-center">
            <Button asChild size="lg" className="min-w-[220px]">
              <Link href={DASHBOARD_URL}>Start My Free Listing</Link>
            </Button>
            <p className="text-sm text-slate-600">
              No upfront fees. Takes less than 2 minutes to begin.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-8 space-y-6">
          <div>
            <h2 className={SECTION_TITLE_CLASS}>Frequently asked questions</h2>
            <p className={SECTION_SUBTITLE_CLASS}>
              Common questions for property owners about listing and verification.
            </p>
          </div>
          <Card className="overflow-hidden rounded-2xl border-slate-200">
            <CardContent className="p-0">
              <Accordion
                type="single"
                collapsible
                defaultValue="what-is-assessment"
                className="w-full"
              >
                {FAQ_ITEMS.map((item) => (
                  <AccordionItem
                    key={item.value}
                    value={item.value}
                    className="border-b px-4 last:border-b-0 sm:px-6"
                  >
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
            <a
              href="mailto:support@zipconcierge.com"
              className="font-medium text-primary underline underline-offset-2"
            >
              Contact us
            </a>
            .
          </p>
        </section>

        {/* CTA */}
        <Card className="overflow-hidden rounded-2xl border-0 bg-slate-900 text-white">
          <div className="grid gap-8 p-8 sm:p-10 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Increase Trust. Reduce Vacancy. Fill Units Faster.
              </h3>
              <p className="mt-3 text-base text-slate-300">
                Complete a ZIP Property Assessment and connect with reliable international tenants ready to secure housing.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-6 bg-white text-slate-900 hover:bg-white/90"
              >
                <Link href={DASHBOARD_URL}>Start My Free Listing</Link>
              </Button>
              <p className="mt-2 text-sm text-slate-400">
                Free to list. No commitment required.
              </p>
            </div>
            <Card className="border-slate-700 bg-slate-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">Get updates</CardTitle>
                <CardDescription className="text-slate-300">Updates for landlords and property owners.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <form
                  className="space-y-4"
                  noValidate
                  onSubmit={handleEmailSubmit}
                >
                  <div className="space-y-2">
                    <Label htmlFor="landlord-updates-email" className="text-sm text-slate-200">
                      Email
                    </Label>
                    <Input
                      id="landlord-updates-email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (emailStatus !== 'idle') setEmailStatus('idle');
                      }}
                      placeholder="name@example.com"
                      className="h-11 border-slate-600 bg-slate-800 text-white placeholder:text-slate-400"
                    />
                    <p className="text-xs text-slate-400">
                      Updates for landlords and property owners.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-white text-slate-900 hover:bg-white/90"
                  >
                    Get updates
                  </Button>
                </form>
                {emailStatus === 'success' ? (
                  <p className="mt-3 text-sm text-emerald-300" role="status">
                    Thanks. Check your inbox.
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
