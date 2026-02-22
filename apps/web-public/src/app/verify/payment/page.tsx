'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getAccessToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteFooter } from '@/components/site-footer';
import { SiteNav } from '@/components/site-nav';

const prices: Record<string, number> = {
  STANDARD: 149,
  COMPREHENSIVE: 249,
  PREMIUM: 399,
};

function VerificationPaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const propertyId = searchParams.get('propertyId') ?? '';
  const packageType = (searchParams.get('packageType') ?? 'STANDARD').toUpperCase();
  const [loading, setLoading] = useState(false);
  const token = getAccessToken();

  useEffect(() => {
    if (!propertyId) {
      router.replace('/properties');
    }
  }, [propertyId, router]);

  async function payNow() {
    if (!propertyId || !token) return;
    setLoading(true);
    try {
      await apiFetch<{ success: true }>('/verification/orders', {
        method: 'POST',
        body: JSON.stringify({ propertyId, packageType }),
      }, true);
      router.push('/profile?tab=verifications');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f4f7]">
      <SiteNav />
      <div className="mx-auto max-w-2xl px-4 py-12">
        {!propertyId ? (
          <Card className="mx-auto max-w-2xl">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-slate-600">
                Select a property first to continue with payment.
              </p>
              <Button asChild className="mt-4">
                <Link href="/properties">Browse properties</Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <div className="mb-4">
          <Button asChild variant="ghost" size="sm">
            <Link href={propertyId ? `/verify/packages?propertyId=${propertyId}` : '/verify/packages'}>← Back to packages</Link>
          </Button>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Verification Payment</h1>
        <p className="mt-2 text-sm text-slate-600">
          Complete payment to place your verification request.
        </p>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">Property ID</p>
            <p className="font-mono text-sm text-slate-700">{propertyId || '-'}</p>
            <p className="mt-4 text-sm text-slate-500">Package</p>
            <p className="text-base font-semibold tracking-tight text-slate-900">{packageType}</p>
            <p className="mt-4 text-sm text-slate-500">Amount</p>
            <p className="text-3xl font-semibold tracking-tight text-slate-900">${prices[packageType] ?? 149} USD</p>
          </CardContent>
        </Card>

        {!token ? (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Please sign in before making payment.
            <div className="mt-3">
              <Button asChild size="sm">
                <Link href="/login">Go to Login</Link>
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            onClick={payNow}
            disabled={loading || !propertyId}
            className="mt-6 w-full"
          >
            {loading ? 'Processing payment...' : 'Pay & Request Verification'}
          </Button>
        )}

        <Link href={propertyId ? `/verify/packages?propertyId=${propertyId}` : '/verify/packages'} className="mt-4 inline-block text-sm text-slate-600 underline">
          Back to packages
        </Link>
      </div>
      <SiteFooter />
    </main>
  );
}

function VerificationPaymentFallback() {
  return (
    <main className="min-h-screen bg-[#f3f4f7]">
      <SiteNav />
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-center text-slate-500">Loading...</p>
      </div>
      <SiteFooter />
    </main>
  );
}

export default function VerificationPaymentPage() {
  return (
    <Suspense fallback={<VerificationPaymentFallback />}>
      <VerificationPaymentPageContent />
    </Suspense>
  );
}
