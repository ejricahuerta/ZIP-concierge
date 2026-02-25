'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Building2, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setAccessToken } from '@/lib/auth';
import { API_URL } from '@/lib/api';

type SignInResponse = {
  success: true;
  data: { user: { id: string; email: string }; accessToken: string };
};

const DEMO_OWNER = { email: 'owner@zipconcierge.dev', password: 'Password123!', label: 'Property owner' };
const DEMO_STUDENT = { email: 'student@zipconcierge.dev', password: 'Password123!', label: 'Student' };

export type LoginVariant = 'landlord' | 'tenant';

export function LoginForm({
  variant,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'> & { variant?: LoginVariant }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultNext = variant === 'landlord' ? '/landlord/dashboard' : variant === 'tenant' ? '/tenant' : '/';
  const next = searchParams.get('next') ?? defaultNext;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function signIn(credentials: { email: string; password: string }) {
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.email.trim(), password: credentials.password }),
      });
      const json = await res.json();

      if (!res.ok || json.success === false) {
        const message = json?.error?.message ?? json?.message ?? 'Invalid email or password.';
        setError(typeof message === 'string' ? message : 'Invalid email or password.');
        return;
      }

      const data = json as SignInResponse;
      if (data.data?.accessToken) {
        setAccessToken(data.data.accessToken);
        router.push(next);
        router.refresh();
      } else {
        setError('Invalid response from server.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    await signIn({ email, password });
  }

  async function onDemoLogin(credentials: { email: string; password: string }) {
    setEmail(credentials.email);
    setPassword(credentials.password);
    await signIn(credentials);
  }

  const isLandlord = variant === 'landlord';
  const isTenant = variant === 'tenant';
  const title = isLandlord ? 'Sign in as property owner' : isTenant ? 'Sign in as renter' : 'Sign in to your account';
  const subtitle = isLandlord
    ? 'Manage your listings and dashboard.'
    : isTenant
      ? 'Save properties, book verifications, and manage your account.'
      : 'Enter your email and password to continue.';

  return (
    <form className={cn('flex flex-col gap-6', className)} onSubmit={onSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-balance text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="grid gap-6">
        {error ? (
          <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in…' : 'Sign in'}
        </Button>

        {(isLandlord || isTenant) && (
          <div className="space-y-2">
            <p className="text-center text-xs font-medium text-muted-foreground">Demo (run seed first)</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full gap-2"
              disabled={isLoading}
              onClick={() => onDemoLogin(isLandlord ? DEMO_OWNER : DEMO_STUDENT)}
            >
              {isLandlord ? <Building2 className="h-4 w-4" aria-hidden /> : <GraduationCap className="h-4 w-4" aria-hidden />}
              <span>Sign in as demo {isLandlord ? DEMO_OWNER.label : DEMO_STUDENT.label}</span>
            </Button>
          </div>
        )}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        {variant ? (
          <>
            Not a {isLandlord ? 'property owner' : 'renter'}?{' '}
            <Link href={isLandlord ? '/tenant/login' : '/landlord/login'} className="underline underline-offset-4 hover:text-foreground">
              Sign in as {isLandlord ? 'renter' : 'owner'}
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{' '}
            <Link href="/tenant/login" className="underline underline-offset-4 hover:text-foreground">
              Sign in
            </Link>{' '}
            to get started.
          </>
        )}
      </p>
    </form>
  );
}
