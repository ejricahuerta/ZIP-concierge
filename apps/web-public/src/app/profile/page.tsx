'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getAccessToken } from '@/lib/auth';
import { DashboardLayout, type DashboardVariant } from '@/components/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SiteFooter } from '@/components/site-footer';
import { SiteNav } from '@/components/site-nav';
import { Mail, Phone, Globe } from 'lucide-react';

type MeResponse = {
  success: true;
  data: {
    user: {
      id: string;
      name: string | null;
      email: string;
      phone: string | null;
      country: string | null;
      role?: string;
    };
  };
};

function ProfilePageContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<MeResponse['data']['user'] | null>(null);

  const isLandlord = user?.role === 'PROPERTY_OWNER';
  const variant: DashboardVariant = isLandlord ? 'landlord' : 'tenant';

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace('/tenant/login?next=' + encodeURIComponent('/profile'));
      return;
    }
    const ac = new AbortController();
    apiFetch<MeResponse>('/users/me', { signal: ac.signal }, true)
      .then((res) => {
        if (!ac.signal.aborted) setUser(res.data.user);
      })
      .catch((err: unknown) => {
        if (ac.signal.aborted || (err instanceof Error && err.name === 'AbortError')) return;
        setUser(null);
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false);
      });
    return () => ac.abort();
  }, [router]);

  const initials = useMemo(() => (user?.name?.[0] ?? user?.email?.[0] ?? 'U').toUpperCase(), [user]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <SiteNav />
        <div className="flex flex-col items-center justify-center gap-4 px-4 py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" aria-hidden />
          <p className="text-sm text-muted-foreground">Loading profile…</p>
        </div>
        <SiteFooter />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <SiteNav />
        <div className="flex flex-col items-center justify-center gap-4 px-4 py-24">
          <p className="text-sm text-muted-foreground">Sign in to view your profile.</p>
          <Button asChild>
            <Link href="/tenant/login?next=/profile">Sign in</Link>
          </Button>
        </div>
        <SiteFooter />
      </main>
    );
  }

  const breadcrumb =
    variant === 'landlord'
      ? [{ label: 'Landlord', href: '/landlord/dashboard' }, { label: 'Profile' }]
      : [{ label: 'Tenant', href: '/tenant/dashboard' }, { label: 'Profile' }];

  return (
    <DashboardLayout variant={variant} breadcrumb={breadcrumb}>
      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardAction>
              {user.role === 'PROPERTY_OWNER' ? (
                <Badge variant="secondary">Property owner</Badge>
              ) : (
                <Badge variant="outline">Renter</Badge>
              )}
            </CardAction>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-semibold">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg font-semibold tracking-tight">{user.name ?? 'Guest'}</CardTitle>
                <CardDescription className="truncate">{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact details</CardTitle>
            <CardDescription>Email, phone, and country on file.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" aria-hidden />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</p>
                  <p className="mt-0.5 text-sm">{user.email ?? '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" aria-hidden />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</p>
                  <p className="mt-0.5 text-sm">{user.phone ?? '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" aria-hidden />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Country</p>
                  <p className="mt-0.5 text-sm">{user.country ?? '—'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function ProfilePageFallback() {
  return (
    <main className="min-h-screen bg-background">
      <SiteNav />
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">Loading profile…</div>
      <SiteFooter />
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfilePageFallback />}>
      <ProfilePageContent />
    </Suspense>
  );
}
