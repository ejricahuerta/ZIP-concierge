'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { DashboardLayout } from '@/components/dashboard-layout';
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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Pencil, ExternalLink, Loader2 } from 'lucide-react';
import { ensureImageUrl } from '@/lib/utils';

type PropertyItem = {
  id: string;
  title: string;
  city: string;
  type: string;
  price: number;
  bedrooms: number;
  images: string[];
  verified: boolean;
  status: string;
  _count?: { savedBy: number };
};

type MineResponse = {
  success: true;
  data: PropertyItem[];
};

export default function LandlordDashboardPage() {
  const router = useRouter();
  const [listings, setListings] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace('/landlord/login?next=/landlord/dashboard');
      return;
    }
    const ac = new AbortController();
    setError('');
    apiFetch<MineResponse>('/properties/mine', { method: 'GET', signal: ac.signal }, true)
      .then((res) => {
        if (ac.signal.aborted) return;
        setListings(res.data);
        setError('');
      })
      .catch((err: unknown) => {
        if (ac.signal.aborted || (err instanceof Error && err.name === 'AbortError')) return;
        setError(err instanceof Error ? err.message : 'Failed to load listings');
        if (err instanceof Error && err.message.toLowerCase().includes('unauthorized')) {
          router.replace('/landlord/login?next=/landlord/dashboard');
        }
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false);
      });
    return () => ac.abort();
  }, [router]);

  if (loading) {
    return (
      <DashboardLayout variant="landlord" breadcrumb={[{ label: 'Landlord' }, { label: 'Listings' }]}>
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" aria-hidden />
          <p className="text-sm text-slate-600">Loading your listings…</p>
        </div>
      </DashboardLayout>
    );
  }

  const verifiedCount = listings.filter((p) => p.verified).length;

  return (
    <DashboardLayout variant="landlord" breadcrumb={[{ label: 'Landlord', href: '/landlord/dashboard' }, { label: 'Listings' }]}>
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your listings and reach international students.
            </p>
          </div>
          <Button asChild size="lg" className="min-h-11 min-w-[140px] shrink-0">
            <Link href="/landlord/listings/new" className="inline-flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" aria-hidden />
              Add listing
            </Link>
          </Button>
        </div>

        {/* Stats */}
        {!error && listings.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="transition-colors hover:bg-muted/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total listings</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold tabular-nums">{listings.length}</p>
              </CardContent>
            </Card>
            <Card className="transition-colors hover:bg-muted/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold tabular-nums">{verifiedCount}</p>
                <p className="text-xs text-muted-foreground mt-0.5">listings verified</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Listings section */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold tracking-tight text-foreground">My listings</h2>

          {error && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-destructive">{error}</p>
                <Button variant="outline" size="default" onClick={() => window.location.reload()} className="shrink-0">
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {!error && listings.length === 0 && (
            <Empty className="rounded-xl border border-dashed">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Building2 className="h-8 w-8 text-muted-foreground" aria-hidden />
                </EmptyMedia>
                <EmptyTitle>No listings yet</EmptyTitle>
                <EmptyDescription>
                  Create your first listing to reach international students looking for housing.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild size="lg" className="min-h-11">
                  <Link href="/landlord/listings/new" className="inline-flex items-center gap-2">
                    <Plus className="h-4 w-4" aria-hidden />
                    Add your first listing
                  </Link>
                </Button>
              </EmptyContent>
            </Empty>
          )}

          {!error && listings.length > 0 && (
            <ul className="grid gap-4" role="list">
              {listings.map((p) => (
                <li key={p.id}>
                  <Card className="relative overflow-hidden pt-0 transition-shadow hover:shadow-md">
                    <div className="flex flex-col sm:flex-row">
                      <Link
                        href={`/properties/${p.id}`}
                        className="relative block h-44 w-full shrink-0 overflow-hidden bg-muted sm:h-auto sm:w-52 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                        tabIndex={0}
                      >
                        <div className="absolute inset-0 z-30 bg-black/35" aria-hidden />
                        {p.images?.[0] ? (
                          <img
                            src={ensureImageUrl(p.images[0])}
                            alt=""
                            className="relative z-20 h-full w-full object-cover brightness-60 dark:brightness-40"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground">
                            <Building2 className="h-12 w-12" aria-hidden />
                          </div>
                        )}
                      </Link>
                      <div className="flex flex-1 flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                        <Link href={`/properties/${p.id}`} className="min-w-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded">
                          <CardHeader className="p-0">
                            <CardAction>
                              <Badge variant="secondary" className="text-xs font-normal">{p.status}</Badge>
                            </CardAction>
                            <CardTitle className="text-base font-semibold leading-tight line-clamp-1">{p.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {p.city} · {p.type} · ${p.price}/mo
                            </CardDescription>
                          </CardHeader>
                        </Link>
                        <CardFooter className="flex flex-wrap gap-2 p-0 sm:shrink-0">
                          <Button asChild variant="outline" size="default" className="min-h-10 min-w-[88px]">
                            <Link href={`/properties/${p.id}`} className="inline-flex items-center justify-center gap-1.5">
                              <ExternalLink className="h-4 w-4" aria-hidden />
                              View
                            </Link>
                          </Button>
                          <Button asChild size="default" className="min-h-10 min-w-[88px]">
                            <Link href={`/landlord/listings/${p.id}/edit`} className="inline-flex items-center justify-center gap-1.5">
                              <Pencil className="h-4 w-4" aria-hidden />
                              Edit
                            </Link>
                          </Button>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
