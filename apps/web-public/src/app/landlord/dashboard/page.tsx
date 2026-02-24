'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Pencil, ExternalLink, Loader2 } from 'lucide-react';

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
      router.replace('/login?next=/landlord/dashboard');
      return;
    }
    apiFetch<MineResponse>('/properties/mine', { method: 'GET' }, true)
      .then((res) => {
        setListings(res.data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load listings');
        if (err instanceof Error && err.message.toLowerCase().includes('unauthorized')) {
          router.replace('/login?next=/landlord/dashboard');
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#f4f4f5]">
        <SiteNav />
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 px-4 py-16 sm:py-24">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" aria-hidden />
          <p className="text-sm text-slate-600">Loading your listings…</p>
        </div>
        <SiteFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f4f5] text-slate-900">
      <SiteNav />
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">My listings</h1>
            <p className="mt-1 text-sm text-slate-600">
              Add and manage your property listings for international students.
            </p>
          </div>
          <Button asChild size="default" className="min-h-11 w-full touch-manipulation sm:w-auto">
            <Link href="/landlord/listings/new" className="inline-flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" aria-hidden />
              Add listing
            </Link>
          </Button>
        </div>

        {error ? (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <p className="text-sm text-amber-800">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : listings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Building2 className="h-7 w-7" aria-hidden />
              </div>
              <CardTitle className="mt-4 text-lg">No listings yet</CardTitle>
              <CardDescription className="mt-2 max-w-sm">
                Create your first listing to reach international students looking for housing.
              </CardDescription>
              <Button asChild className="mt-6">
                <Link href="/landlord/listings/new" className="inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" aria-hidden />
                  Add your first listing
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-1">
            {listings.map((p) => (
              <li key={p.id}>
                <Card className="overflow-hidden transition-shadow hover:shadow-md">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-40 w-full shrink-0 overflow-hidden bg-slate-200 sm:h-auto sm:w-48">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">
                          <Building2 className="h-10 w-10" aria-hidden />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                      <div>
                        <CardHeader className="p-0">
                          <CardTitle className="text-lg">{p.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {p.city} · {p.type} · ${p.price}/mo
                          </CardDescription>
                        </CardHeader>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant="outline">{p.status}</Badge>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col gap-2 sm:mt-0 sm:flex-row">
                        <Button asChild variant="outline" size="sm" className="min-h-11 w-full touch-manipulation sm:w-auto">
                          <Link href={`/properties/${p.id}`} className="inline-flex items-center justify-center gap-1">
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                            View
                          </Link>
                        </Button>
                        <Button asChild size="sm" className="min-h-11 w-full touch-manipulation sm:w-auto">
                          <Link href={`/landlord/listings/${p.id}/edit`} className="inline-flex items-center justify-center gap-1">
                            <Pencil className="h-3.5 w-3.5" aria-hidden />
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
