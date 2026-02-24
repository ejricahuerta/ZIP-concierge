'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { clearAccessToken, getAccessToken } from '@/lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
      role?: string;
      createdAt?: string;
    };
  };
};

type MineListingsResponse = {
  success: true;
  data: Array<{
    id: string;
    title: string;
    city: string;
    type: string;
    price: number;
    bedrooms: number;
    images: string[];
    verified: boolean;
    status: string;
  }>;
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

type ProfileTab = 'listings' | 'saved' | 'verifications' | 'contact';

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialTab: ProfileTab =
    tabParam === 'verifications'
      ? 'verifications'
      : tabParam === 'listings'
        ? 'listings'
        : tabParam === 'contact'
          ? 'contact'
          : 'saved';

  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<MeResponse['data']['user'] | null>(null);
  const [saved, setSaved] = useState<SavedResponse['data']>([]);
  const [orders, setOrders] = useState<VerificationOrdersResponse['data']>([]);
  const [myListings, setMyListings] = useState<MineListingsResponse['data']>([]);

  const isLandlord = user?.role === 'PROPERTY_OWNER';

  useEffect(() => {
    if (user?.role === 'PROPERTY_OWNER' && !tabParam && activeTab === 'saved') {
      setActiveTab('listings');
    }
  }, [user?.role, tabParam, activeTab]);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace('/login?next=' + encodeURIComponent('/profile'));
      return;
    }
    Promise.all([
      apiFetch<MeResponse>('/users/me', undefined, true),
      apiFetch<SavedResponse>('/users/me/saved', undefined, true),
      apiFetch<VerificationOrdersResponse>('/verification/orders/me', undefined, true),
    ])
      .then(async ([me, list, orderList]) => {
        setUser(me.data.user);
        setSaved(list.data);
        setOrders(orderList.data);
        if (me.data.user.role === 'PROPERTY_OWNER') {
          try {
            const mine = await apiFetch<MineListingsResponse>('/properties/mine', undefined, true);
            setMyListings(mine.data);
          } catch {
            setMyListings([]);
          }
        }
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

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">My Profile</h1>
          <div className="flex flex-wrap items-center gap-2">
            {isLandlord ? (
              <Button asChild size="sm" variant="outline" className="min-h-11 touch-manipulation">
                <Link href="/landlord/dashboard">Landlord dashboard</Link>
              </Button>
            ) : null}
            <Button
              type="button"
              size="sm"
              onClick={() => {
                clearAccessToken();
                window.location.href = '/login';
              }}
              className="min-h-11 w-full touch-manipulation sm:w-auto"
            >
              Log out
            </Button>
          </div>
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
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 py-3 px-2 sm:gap-8 sm:text-sm">
            {isLandlord ? (
              <Button type="button" variant="ghost" size="sm" onClick={() => setActiveTab('listings')} className={cn('min-h-11 touch-manipulation', activeTab === 'listings' ? 'bg-accent text-accent-foreground' : 'text-slate-500')}>
                My Listings
              </Button>
            ) : null}
            <Button type="button" variant="ghost" size="sm" onClick={() => setActiveTab('saved')} className={cn('min-h-11 touch-manipulation', activeTab === 'saved' ? 'bg-accent text-accent-foreground' : 'text-slate-500')}>
              Saved Properties
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setActiveTab('verifications')} className={cn('min-h-11 touch-manipulation', activeTab === 'verifications' ? 'bg-accent text-accent-foreground' : 'text-slate-500')}>
              Verifications
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setActiveTab('contact')} className={cn('min-h-11 touch-manipulation', activeTab === 'contact' ? 'bg-accent text-accent-foreground' : 'text-slate-500')}>
              Contact Info
            </Button>
          </div>

          {activeTab === 'listings' ? (
            <div className="min-h-[320px] px-4 py-6">
              {!user ? (
                <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                  <p className="text-sm text-slate-500">Sign in to view your listings.</p>
                  <Button asChild className="mt-4">
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              ) : myListings.length === 0 ? (
                <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                  <p className="text-2xl font-semibold tracking-tight text-slate-900">No listings yet</p>
                  <p className="mt-1 text-sm text-slate-500">Create your first property listing to reach renters.</p>
                  <Button asChild className="mt-5">
                    <Link href="/landlord/listings/new">Add a listing</Link>
                  </Button>
                  <Button asChild variant="outline" className="mt-3">
                    <Link href="/landlord/dashboard">Go to landlord dashboard</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">Your property listings. Manage them from the landlord dashboard.</p>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {myListings.map((listing) => (
                      <li key={listing.id}>
                        <Card>
                          <CardContent className="p-3">
                            <p className="font-semibold text-slate-900">{listing.title}</p>
                            <p className="text-sm text-slate-600">{listing.city} · {listing.type}</p>
                            <p className="mt-1 text-sm font-medium text-zip-primary">${listing.price}/mo</p>
                            <div className="mt-2 flex gap-2">
                              <Button asChild size="sm">
                                <Link href={`/properties/${listing.id}`}>View</Link>
                              </Button>
                              <Button asChild size="sm" variant="outline">
                                <Link href={`/landlord/listings/${listing.id}/edit`}>Edit</Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/landlord/dashboard">Manage all listings →</Link>
                  </Button>
                </div>
              )}
            </div>
          ) : null}

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
