'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteFooter } from '@/components/site-footer';
import { SiteNav } from '@/components/site-nav';

export default function VerificationSuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace('/login?next=' + encodeURIComponent('/verify/success'));
      return;
    }

    setStatus('processing');
    apiFetch<{ success: true; data: Array<{ id: string }> }>(
      '/verification/orders/me',
      undefined,
      true,
    )
      .then((res) => {
        if (res.data.length > 0) {
          setStatus('success');
          setMessage('Payment confirmed. Your verification request is now in your profile.');
        } else {
          setStatus('success');
          setMessage('Payment received. It may take a moment for webhook sync to appear in profile.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Could not check verification status. Please open Profile in a moment.');
      });
  }, [router]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f3f4f7]">
      <SiteNav />
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-14">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">Verification Payment Result</h1>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
          {status === 'processing' ? (
            <p className="text-sm text-slate-600">Checking your payment status...</p>
          ) : (
            <p className={`text-sm ${status === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
              {message}
            </p>
          )}
          <div className="mt-5 flex gap-3">
            <Button asChild>
              <Link href="/profile?tab=verifications">Go to Profile</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/properties">Browse Properties</Link>
            </Button>
          </div>
          </CardContent>
        </Card>
      </div>
      <SiteFooter />
    </main>
  );
}
