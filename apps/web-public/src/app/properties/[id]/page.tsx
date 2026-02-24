'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { PropertyMap } from '@/components/property-map';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SiteFooter } from '@/components/site-footer';
import { apiFetch } from '@/lib/api';
import { getAccessToken } from '@/lib/auth';

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

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/properties/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setProperty(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!getAccessToken()) return;
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
          <Card>
            <div className="aspect-video overflow-hidden rounded-t-xl bg-slate-200 sm:rounded-t-2xl">
              {property.images?.[0] ? (
                <img
                  src={property.images[0]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  No image
                </div>
              )}
            </div>
            <CardContent className="p-4 pt-5 sm:pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">{property.title}</h1>
                  <p className="mt-1 text-sm text-slate-600 sm:text-base">
                    {property.address}, {property.city}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{property.type}</Badge>
                    <Badge variant={property.verified ? 'default' : 'outline'}>
                      {property.verified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                  {showVerifyCta && (
                    <p className="mt-3 text-sm text-slate-500">
                      Need confidence before signing? Verification is available starting at $149.
                    </p>
                  )}
                </div>
                <p className="shrink-0 text-2xl font-semibold tracking-tight text-zip-primary sm:text-3xl">
                  ${property.price}
                  <span className="text-base font-normal text-slate-500">/mo</span>
                </p>
              </div>
              <p className="mt-4 text-sm text-slate-700 sm:text-base">{property.description}</p>
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
              {showVerifyCta && (
                <Button asChild className="mt-5 min-h-11 w-full touch-manipulation sm:w-auto">
                  <Link href={`/verify/packages?propertyId=${property.id}`}>
                    Verify This Property
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
