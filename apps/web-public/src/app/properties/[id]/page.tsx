'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { PropertyMap } from '@/components/property-map';
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
import { SiteFooter } from '@/components/site-footer';
import { apiFetch } from '@/lib/api';
import { getAccessToken } from '@/lib/auth';
import { cn, ensureImageUrl } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

type Property = {
  id: string;
  title: string;
  description: string;
  city: string;
  address: string;
  type: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  verified: boolean;
  images: string[];
  latitude?: number;
  longitude?: number;
  owner?: { id: string; name: string | null };
};

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    if (!id) return;
    const ac = new AbortController();
    setLoading(true);
    setProperty(null);
    fetch(`${API_URL}/properties/${id}`, { signal: ac.signal })
      .then((res) => res.json())
      .then((json) => {
        if (ac.signal.aborted) return;
        if (json.success && json.data) setProperty(json.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err?.name === 'AbortError' || ac.signal.aborted) return;
        setLoading(false);
      });
    return () => ac.abort();
  }, [id]);

  useEffect(() => {
    const token = getAccessToken();
    setIsAuthed(Boolean(token));
    if (!token) return;
    apiFetch<{ success: true; data: { user: { id: string } } }>('/users/me', undefined, true)
      .then((json) => setCurrentUserId(json.data.user.id))
      .catch(() => setCurrentUserId(null));
  }, []);

  const isOwner = Boolean(property?.owner && currentUserId && property.owner.id === currentUserId);
  const showVerifyCta = !isOwner;

  return (
    <main className="min-h-screen overflow-x-hidden">
      <SiteNav />

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        {loading ? (
          <p className="text-slate-500">Loading…</p>
        ) : !property ? (
          <p className="text-slate-500">Property not found.</p>
        ) : (
          <div className="relative">
            <Card
              className={cn(
                'relative pt-0',
                !isAuthed && 'pointer-events-none select-none'
              )}
            >
              <div className={cn(!isAuthed && 'blur-md')}>
                <div className="relative aspect-video overflow-hidden rounded-t-xl bg-slate-200 sm:rounded-t-2xl">
                  <div className="absolute inset-0 z-30 bg-black/35" aria-hidden />
                  {property.images?.[0] ? (
                    <img
                      src={ensureImageUrl(property.images[0])}
                      alt=""
                      className="relative z-20 h-full w-full object-cover brightness-60 dark:brightness-40"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      No image
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardAction>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{property.type}</Badge>
                      <Badge variant={property.verified ? 'default' : 'outline'}>
                        {property.verified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </div>
                  </CardAction>
                  <CardTitle className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
                    {property.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600 sm:text-base">
                    {property.address}, {property.city}
                  </CardDescription>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      {showVerifyCta && (
                        <p className="mt-2 text-sm text-slate-500">
                          Need confidence before signing? Verification is available starting at $149.
                        </p>
                      )}
                    </div>
                    <p className="shrink-0 text-2xl font-semibold tracking-tight text-zip-primary sm:text-3xl">
                      ${property.price}
                      <span className="text-base font-normal text-slate-500">/mo</span>
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-slate-700 sm:text-base">{property.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600 sm:gap-6">
                    <li>{property.bedrooms} bed</li>
                    <li>{property.bathrooms} bath</li>
                    <li>{property.type}</li>
                  </ul>
                  {typeof property.latitude === 'number' &&
                    typeof property.longitude === 'number' && (
                      <div className="mt-6">
                        <h2 className="mb-3 text-lg font-semibold tracking-tight text-slate-900">
                          Location & nearby
                        </h2>
                        <PropertyMap
                          latitude={property.latitude}
                          longitude={property.longitude}
                          address={`${property.address}, ${property.city}`}
                          title={property.title}
                        />
                      </div>
                    )}
                </CardContent>
                {showVerifyCta && (
                  <CardFooter>
                    <Button asChild className="min-h-11 w-full touch-manipulation sm:w-auto">
                      <Link href={`/verify/packages?propertyId=${property.id}`}>
                        Verify This Property
                      </Link>
                    </Button>
                  </CardFooter>
                )}
              </div>
            </Card>
            {!isAuthed && (
              <div
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50/95 p-6 backdrop-blur-sm sm:rounded-2xl"
                aria-hidden="false"
              >
                <p className="text-center text-sm font-medium text-slate-700">Sign in to view this listing</p>
                <Button asChild size="sm" className="min-h-11 touch-manipulation">
                  <Link href={`/tenant/login?next=${encodeURIComponent(`/properties/${id}`)}`}>Log in</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
