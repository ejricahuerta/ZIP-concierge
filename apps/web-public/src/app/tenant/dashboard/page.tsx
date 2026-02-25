'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getAccessToken } from '@/lib/auth';
import { DashboardLayout } from '@/components/dashboard-layout';
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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Heart, FileCheck, Loader2, Mail, Phone, Globe, PackageOpen } from 'lucide-react';

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

type SavedResponse = {
  success: true;
  data: Array<{
    propertyId: string;
    property: {
      id: string;
      title: string;
      city: string;
      type: string;
      price: number;
      verified: boolean;
    };
  }>;
};

type VerificationOrdersResponse = {
  success: true;
  data: Array<{
    id: string;
    packageType: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
    property: { id: string; title: string; city: string };
  }>;
};

type TenantTab = 'saved' | 'verifications' | 'settings';

function TenantDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialTab: TenantTab =
    tabParam === 'verifications' ? 'verifications' : tabParam === 'settings' ? 'settings' : 'saved';

  const [activeTab, setActiveTab] = useState<TenantTab>(initialTab);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<MeResponse['data']['user'] | null>(null);
  const [saved, setSaved] = useState<SavedResponse['data']>([]);
  const [orders, setOrders] = useState<VerificationOrdersResponse['data']>([]);

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t === 'verifications' || t === 'settings' || t === 'saved') setActiveTab(t);
  }, [searchParams]);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace('/tenant/login?next=' + encodeURIComponent('/tenant/dashboard'));
      return;
    }
    const ac = new AbortController();
    const { signal } = ac;
    Promise.all([
      apiFetch<MeResponse>('/users/me', { signal }, true),
      apiFetch<SavedResponse>('/users/me/saved', { signal }, true),
      apiFetch<VerificationOrdersResponse>('/verification/orders/me', { signal }, true),
    ])
      .then(([me, list, orderList]) => {
        if (signal.aborted) return;
        if (me.data.user.role === 'PROPERTY_OWNER') {
          router.replace('/landlord/dashboard');
          return;
        }
        setUser(me.data.user);
        setSaved(list.data);
        setOrders(orderList.data);
      })
      .catch((err: unknown) => {
        if (signal.aborted || (err instanceof Error && err.name === 'AbortError')) return;
      })
      .finally(() => {
        if (!signal.aborted) setLoading(false);
      });
    return () => ac.abort();
  }, [router]);

  const breadcrumb = useMemo(() => {
    const base = [{ label: 'Tenant', href: '/tenant/dashboard' }];
    if (activeTab === 'verifications') return [...base, { label: 'Verification Order' }];
    if (activeTab === 'settings') return [...base, { label: 'Settings' }];
    return [...base, { label: 'Saved' }];
  }, [activeTab]);

  if (loading) {
    return (
      <DashboardLayout variant="tenant" breadcrumb={[{ label: 'Tenant' }, { label: 'Dashboard' }]}>
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">Loading dashboard…</p>
        </div>
      </DashboardLayout>
    );
  }

  async function removeSaved(propertyId: string) {
    try {
      await apiFetch<{ success: true }>(`/users/me/saved/${propertyId}`, { method: 'DELETE' }, true);
      setSaved((prev) => prev.filter((item) => item.propertyId !== propertyId));
    } catch {
      // noop
    }
  }

  return (
    <DashboardLayout variant="tenant" breadcrumb={breadcrumb}>
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Welcome back, {user?.name?.trim() || user?.email?.split('@')[0] || 'there'}
          </h1>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="transition-colors hover:bg-muted/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saved</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" aria-hidden />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums">{saved.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">properties saved</p>
            </CardContent>
          </Card>
          <Card className="transition-colors hover:bg-muted/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Verifications</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" aria-hidden />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums">{orders.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Content: section driven by sidebar (Saved | Verifications | Contact) */}
        <Card>
          <CardContent className="px-6 pb-6 pt-6">
              {activeTab === 'saved' && (
                <>
                  {saved.length === 0 ? (
                    <Empty className="min-h-[260px] py-12">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Heart className="h-8 w-8 text-muted-foreground" aria-hidden />
                        </EmptyMedia>
                        <EmptyTitle>No saved properties</EmptyTitle>
                        <EmptyDescription>
                          Save listings while browsing to see them here.
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <Button asChild size="lg" className="min-h-11">
                          <Link href="/properties">Browse properties</Link>
                        </Button>
                      </EmptyContent>
                    </Empty>
                  ) : (
                    <ul className="grid gap-4 sm:grid-cols-2" role="list">
                      {saved.map((item) => (
                        <li key={item.propertyId}>
                          <Card className="overflow-hidden transition-shadow hover:shadow-md">
                            <CardHeader>
                              {item.property.verified && (
                                <CardAction>
                                  <Badge variant="secondary" className="text-xs font-normal">Verified</Badge>
                                </CardAction>
                              )}
                              <CardTitle className="text-base font-semibold leading-tight line-clamp-2">
                                <Link href={`/properties/${item.property.id}`} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset rounded">
                                  {item.property.title}
                                </Link>
                              </CardTitle>
                              <CardDescription>
                                {item.property.city} · {item.property.type} · ${item.property.price}/mo
                              </CardDescription>
                            </CardHeader>
                            <CardFooter className="flex gap-2 border-t">
                              <Button asChild variant="outline" size="sm" className="min-h-9">
                                <Link href={`/properties/${item.property.id}`}>View</Link>
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="min-h-9 text-muted-foreground hover:text-destructive"
                                onClick={() => removeSaved(item.propertyId)}
                              >
                                Remove
                              </Button>
                            </CardFooter>
                          </Card>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {activeTab === 'verifications' && (
                <>
                  {orders.length === 0 ? (
                    <Empty className="min-h-[260px] py-12">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <PackageOpen className="h-8 w-8 text-muted-foreground" aria-hidden />
                        </EmptyMedia>
                        <EmptyTitle>No verifications yet</EmptyTitle>
                        <EmptyDescription>
                          Book a verification when you find a property you like.
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <Button asChild size="lg" className="min-h-11">
                          <Link href="/properties">Browse properties</Link>
                        </Button>
                      </EmptyContent>
                    </Empty>
                  ) : (
                    <ul className="space-y-3" role="list">
                      {orders.map((order) => (
                        <li key={order.id}>
                          <Card>
                            <CardHeader>
                              <CardAction>
                                <Badge variant="secondary" className="text-xs font-normal">{order.status}</Badge>
                              </CardAction>
                              <CardTitle className="text-base font-semibold">{order.property.title}</CardTitle>
                              <CardDescription>{order.property.city}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="flex flex-wrap items-center gap-2 text-sm">
                                <span>{order.packageType}</span>
                                <span className="text-muted-foreground">·</span>
                                <span>${order.amount} {order.currency}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(order.createdAt).toLocaleString()}
                              </p>
                            </CardContent>
                          </Card>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <h2 className="text-sm font-medium text-muted-foreground">Account</h2>
                  <div className="rounded-lg border bg-muted/30 p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" aria-hidden />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</p>
                        <p className="mt-0.5 text-sm">{user?.email ?? '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" aria-hidden />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</p>
                        <p className="mt-0.5 text-sm">{user?.phone ?? '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" aria-hidden />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Country</p>
                        <p className="mt-0.5 text-sm">{user?.country ?? '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function TenantDashboardFallback() {
  return (
    <DashboardLayout variant="tenant" breadcrumb={[{ label: 'Tenant' }, { label: 'Dashboard' }]}>
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">Loading dashboard…</div>
    </DashboardLayout>
  );
}

export default function TenantDashboardPage() {
  return (
    <Suspense fallback={<TenantDashboardFallback />}>
      <TenantDashboardContent />
    </Suspense>
  );
}
