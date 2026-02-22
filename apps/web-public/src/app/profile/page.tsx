'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { clearAccessToken, getAccessToken } from '@/lib/auth';
import { useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SiteFooter } from '@/components/site-footer';
import { SiteNav } from '@/components/site-nav';

type MeResponse = {
  success: true;
  data: {
    user: {
      id: string;
      name: string | null;
      email: string;
      phone: string | null;
      country: string | null;
      createdAt?: string;
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
    property: {
      id: string;
      title: string;
      city: string;
    };
  }>;
};

function ProfilePageContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'saved' | 'verifications' | 'contact'>(
    searchParams.get('tab') === 'verifications' ? 'verifications' : 'saved',
  );
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<MeResponse['data']['user'] | null>(null);
  const [saved, setSaved] = useState<SavedResponse['data']>([]);
  const [orders, setOrders] = useState<VerificationOrdersResponse['data']>([]);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }
    Promise.all([
      apiFetch<MeResponse>('/users/me', undefined, true),
      apiFetch<SavedResponse>('/users/me/saved', undefined, true),
      apiFetch<VerificationOrdersResponse>('/verification/orders/me', undefined, true),
    ])
      .then(([me, list, orderList]) => {
        setUser(me.data.user);
        setSaved(list.data);
        setOrders(orderList.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const initials = useMemo(() => (user?.name?.[0] ?? user?.email?.[0] ?? 'U').toUpperCase(), [user]);

  async function removeSaved(propertyId: string) {
    try {
      await apiFetch<{ success: true }>(`/users/me/saved/${propertyId}`, { method: 'DELETE' }, true);
      setSaved((prev) => prev.filter((item) => item.propertyId !== propertyId));
    } catch {
      // noop
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f4f7]">
      <SiteNav />

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">My Profile</h1>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              clearAccessToken();
              window.location.href = '/login';
            }}
          >
            Log out
          </Button>
        </div>
        <Card>
          <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-2xl font-bold text-white">
              {initials}
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight text-slate-900">{user?.name ?? 'Guest User'}</p>
              <p className="text-sm text-slate-600">{user?.email ?? 'Sign in required'}</p>
              <p className="text-sm text-slate-500">
                {loading ? 'Loading account...' : user ? 'Authenticated account' : 'Please sign in to load profile'}
              </p>
            </div>
          </div>
          </CardContent>
        </Card>

        <Card className="mt-5">
          <div className="flex items-center justify-center gap-8 border-b border-slate-200 py-3 text-sm">
            <Button type="button" variant="ghost" size="sm" onClick={() => setActiveTab('saved')} className={activeTab === 'saved' ? 'bg-accent text-accent-foreground' : 'text-slate-500'}>
              Saved Properties
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setActiveTab('verifications')} className={activeTab === 'verifications' ? 'bg-accent text-accent-foreground' : 'text-slate-500'}>
              Verifications
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setActiveTab('contact')} className={activeTab === 'contact' ? 'bg-accent text-accent-foreground' : 'text-slate-500'}>
              Contact Info
            </Button>
          </div>

          {activeTab === 'saved' ? (
            <div className="min-h-[320px] px-4 py-6">
              {!user ? (
                <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                  <p className="text-sm text-slate-500">Sign in to view saved properties.</p>
                  <Button asChild className="mt-4">
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              ) : saved.length === 0 ? (
                <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                  <div className="text-6xl text-slate-300">♡</div>
                  <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">No Saved Properties</p>
                  <p className="mt-1 text-sm text-slate-500">Start saving properties to view them here</p>
                  <Button asChild className="mt-5">
                    <Link href="/properties">Browse Properties</Link>
                  </Button>
                </div>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {saved.map((item) => (
                    <li key={item.propertyId}>
                      <Card>
                        <CardContent className="p-3">
                          <p className="font-semibold text-slate-900">{item.property.title}</p>
                          <p className="text-sm text-slate-600">{item.property.city} · {item.property.type}</p>
                          <p className="mt-1 text-sm font-medium text-zip-primary">${item.property.price}/mo</p>
                          {item.property.verified ? (
                            <Badge variant="secondary" className="mt-2">Verified</Badge>
                          ) : null}
                          <div className="mt-2 flex gap-2">
                            <Button asChild size="sm">
                              <Link href={`/properties/${item.property.id}`}>View</Link>
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeSaved(item.propertyId)}
                            >
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}

          {activeTab === 'verifications' ? (
            <div className="min-h-[320px] p-6 text-sm text-slate-600">
              {!user ? (
                <p>Sign in to view your verification purchases.</p>
              ) : orders.length === 0 ? (
                <p>No verification purchases yet.</p>
              ) : (
                <ul className="space-y-3">
                  {orders.map((order) => (
                    <li key={order.id}>
                      <Card>
                        <CardContent className="p-3">
                          <p className="font-semibold text-slate-900">{order.property.title}</p>
                          <p className="text-xs text-slate-500">{order.property.city}</p>
                          <p className="mt-1 text-sm">
                            {order.packageType} · ${order.amount} {order.currency} · {order.status}
                          </p>
                          <p className="text-xs text-slate-500">
                            Purchased {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </CardContent>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}

          {activeTab === 'contact' ? (
            <div className="min-h-[320px] p-6 text-sm text-slate-600">
              <p>Email: {user?.email ?? '-'}</p>
              <p className="mt-1">Phone: {user?.phone ?? '-'}</p>
              <p className="mt-1">Country: {user?.country ?? '-'}</p>
            </div>
          ) : null}
        </Card>
      </div>
      <SiteFooter />
    </main>
  );
}

function ProfilePageFallback() {
  return (
    <main className="min-h-screen bg-[#f3f4f7]">
      <SiteNav />
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">My Profile</h1>
        </div>
        <Card>
          <CardContent className="p-8 text-center text-slate-500">Loading profile...</CardContent>
        </Card>
      </div>
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
