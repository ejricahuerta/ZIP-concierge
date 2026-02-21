'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SiteFooter } from '@/components/site-footer';

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
  owner?: { id: string; name: string | null };
};

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="min-h-screen">
      <SiteNav />

      <div className="mx-auto max-w-4xl px-4 py-8">
        {loading ? (
          <p className="text-slate-500">Loading…</p>
        ) : !property ? (
          <p className="text-slate-500">Property not found.</p>
        ) : (
          <Card>
            <div className="aspect-video overflow-hidden rounded-t-xl bg-slate-200">
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
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{property.title}</h1>
                  <p className="mt-1 text-slate-600">
                    {property.address}, {property.city}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary">{property.type}</Badge>
                    <Badge variant={property.verified ? 'default' : 'outline'}>
                      {property.verified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">
                    Need confidence before signing? Verification is available starting at $149.
                  </p>
                </div>
                <p className="text-3xl font-semibold tracking-tight text-zip-primary">
                  ${property.price}
                  <span className="text-base font-normal text-slate-500">/mo</span>
                </p>
              </div>
              <p className="mt-4 text-slate-700">{property.description}</p>
              <ul className="mt-4 flex gap-6 text-sm text-slate-600">
                <li>{property.bedrooms} bed</li>
                <li>{property.bathrooms} bath</li>
                <li>{property.type}</li>
              </ul>
              <Button asChild className="mt-5">
                <Link href={`/verify/packages?propertyId=${property.id}`}>
                  Verify This Property (Paid)
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
