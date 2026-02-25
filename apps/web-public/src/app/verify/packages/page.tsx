'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getAccessToken } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { SiteFooter } from '@/components/site-footer';
import { SiteNav } from '@/components/site-nav';

const packages = [
  {
    name: 'Standard',
    price: 149,
    description: 'Photo report, neighborhood notes, and key condition checks.',
    bullets: ['30+ photos', 'Basic condition checklist', '48-hour delivery'],
  },
  {
    name: 'Comprehensive',
    price: 249,
    description: 'Most popular: adds detailed room-by-room assessment and short video.',
    bullets: ['60+ photos', '5-8 min walkthrough video', 'Detailed checklist'],
    featured: true,
  },
  {
    name: 'Premium',
    price: 399,
    description: 'Highest confidence package with expanded media and priority support.',
    bullets: ['100+ photos', 'Full walkthrough + commentary', 'Priority scheduling'],
  },
];

function VerificationPackagesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  const [acknowledged, setAcknowledged] = useState(false);
  const [limitationsOpen, setLimitationsOpen] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      const next = propertyId
        ? `/verify/packages?propertyId=${encodeURIComponent(propertyId)}`
        : '/verify/packages';
      router.replace('/tenant/login?next=' + encodeURIComponent(next));
      return;
    }
    if (!propertyId) {
      router.replace('/properties');
    }
  }, [propertyId, router]);

  async function startStandardCheckout() {
    if (!propertyId) return;
    if (!acknowledged) {
      setLimitationsOpen(true);
      return;
    }
    if (!getAccessToken()) {
      window.location.href = '/tenant/login';
      return;
    }
    try {
      const json = await apiFetch<{
        success: true;
        data: { checkoutUrl: string };
      }>('/verification/checkout-link', {
        method: 'POST',
        body: JSON.stringify({
          propertyId,
          packageType: 'STANDARD',
        }),
      }, true);
      window.location.href = json.data.checkoutUrl;
    } catch {
      // noop for MVP
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f3f4f7]">
      <SiteNav />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
        {!propertyId ? (
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>Select a property</CardTitle>
              <CardDescription>Select a property first to start verification.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/properties">Browse properties</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : null}

        <div className="mb-4">
          <Button asChild variant="ghost" size="sm">
            <Link href={propertyId ? `/properties/${propertyId}` : '/properties'}>← Back to property</Link>
          </Button>
        </div>
        <h1 className="text-center text-3xl font-semibold tracking-tight text-slate-900">Select a Verification Package</h1>
        <p className="mt-2 text-center text-slate-600">
          Pick and pay for the level of detail you need before signing your lease.
        </p>
        {propertyId ? (
          <p className="mt-2 text-center text-sm text-slate-500">
            Property ID: <span className="font-mono">{propertyId}</span>
          </p>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:gap-5 md:grid-cols-3">
          {packages.map((pkg) => (
            <Card key={pkg.name} className="overflow-hidden">
              <CardHeader>
                {pkg.featured ? (
                  <CardAction>
                    <Badge className="shrink-0 px-5 py-2 text-xs font-medium">Popular</Badge>
                  </CardAction>
                ) : null}
                <CardTitle className="text-xl text-slate-900">{pkg.name}</CardTitle>
                <p className="text-2xl font-semibold tracking-tight text-slate-900">${pkg.price}</p>
                <CardDescription className="text-sm text-slate-600">{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Included</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  {pkg.bullets.map((b) => (
                    <li key={b}>✓ {b}</li>
                  ))}
                </ul>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Not Included</p>
                <ul className="space-y-1 text-sm text-slate-400">
                  <li>✕ Same-day scheduling</li>
                  <li>✕ Extended property access</li>
                </ul>
              </CardContent>
              <CardFooter>
                {pkg.name === 'Standard' ? (
                  <Button
                    type="button"
                    onClick={startStandardCheckout}
                    disabled={!propertyId}
                    className="min-h-11 w-full touch-manipulation"
                  >
                    Buy Standard (Stripe)
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="min-h-11 w-full touch-manipulation"
                    onClick={() => {
                      if (!acknowledged) {
                        setLimitationsOpen(true);
                        return;
                      }
                      router.push(`/verify/payment?propertyId=${propertyId ?? ''}&packageType=${pkg.name.toUpperCase()}`);
                    }}
                  >
                    Select {pkg.name}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-slate-500">
          Standard package uses hosted Stripe Checkout. Comprehensive and Premium currently use in-app MVP flow.
        </p>
        <p className="mt-1 text-center text-xs text-slate-500">
          After Stripe success, open <span className="font-mono">/verify/success</span>; profile updates via webhook.
        </p>

        <div className="mt-6 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Please review and accept service limitations before selecting a package.
          </p>
          <Dialog open={limitationsOpen} onOpenChange={setLimitationsOpen}>
            <DialogTrigger asChild>
              <Button variant={acknowledged ? 'secondary' : 'default'}>
                {acknowledged ? 'Limitations acknowledged' : 'Review service limitations'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Service Limitations</DialogTitle>
                <DialogDescription>
                  Please read this before continuing with verification.
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <ul className="space-y-1">
                  <li>• This service documents observable conditions at time of visit only</li>
                  <li>• We do not provide property recommendations or opinions</li>
                  <li>• We do not negotiate with landlords or property managers</li>
                  <li>• Report content does not constitute endorsement or advice</li>
                </ul>
              </div>
              <div className="flex items-start gap-3 rounded-md border border-input p-3">
                <Checkbox
                  id="acknowledge"
                  checked={acknowledged}
                  onCheckedChange={(checked) => setAcknowledged(Boolean(checked))}
                />
                <Label htmlFor="acknowledge" className="text-sm font-normal leading-5 text-slate-600">
                  I understand that this verification service documents observable property conditions
                  at the time of visit only.
                </Label>
              </div>
              <DialogFooter>
                <Button type="button" onClick={() => setLimitationsOpen(false)} disabled={!acknowledged}>
                  Continue
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-6 flex justify-end">
          <Button asChild variant="secondary">
            <Link href={propertyId ? `/properties/${propertyId}` : '/properties'}>Back to Property →</Link>
          </Button>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

function VerificationPackagesFallback() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f3f4f7]">
      <SiteNav />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-center text-slate-500">Loading...</p>
      </div>
      <SiteFooter />
    </main>
  );
}

export default function VerificationPackagesPage() {
  return (
    <Suspense fallback={<VerificationPackagesFallback />}>
      <VerificationPackagesPageContent />
    </Suspense>
  );
}
