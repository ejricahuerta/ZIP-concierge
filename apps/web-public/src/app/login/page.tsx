'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { setAccessToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SiteFooter } from '@/components/site-footer';
import { SiteNav } from '@/components/site-nav';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next');
  const [email, setEmail] = useState('student@zipconcierge.dev');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const json = await apiFetch<{
        success: true;
        data: { accessToken: string };
      }>('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAccessToken(json.data.accessToken);
      const redirect = nextUrl && nextUrl.startsWith('/') ? nextUrl : '/profile';
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f3f4f7]">
      <SiteNav />
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-8 sm:py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Sign in with email/password for MVP.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={onSubmit}>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <Button
                type="submit"
                disabled={loading}
                className="min-h-11 w-full touch-manipulation"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
              {error ? <p className="text-xs text-red-600">{error}</p> : null}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                <p className="font-semibold text-slate-700">Demo API users</p>
                <p className="mt-1">owner@zipconcierge.dev / Password123!</p>
                <p>student@zipconcierge.dev / Password123!</p>
              </div>
              <Button asChild variant="link" className="w-full text-zip-primary">
                <Link href="/">Back to home</Link>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <SiteFooter />
    </main>
  );
}
