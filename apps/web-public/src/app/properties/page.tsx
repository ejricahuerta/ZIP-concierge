'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { apiFetch, API_URL } from '@/lib/api';
import { getAccessToken } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { SiteFooter } from '@/components/site-footer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Property = {
  id: string;
  title: string;
  city: string;
  type: string;
  price: number;
  bedrooms: number;
  images: string[];
};

export default function PropertiesPage() {
  const [list, setList] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('Toronto');
  const [type, setType] = useState<string>('all');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    setIsAuthed(Boolean(token));
    if (token) {
      apiFetch<{ success: true; data: Array<{ propertyId: string }> }>('/users/me/saved', undefined, true)
        .then((json) => setSavedIds(json.data.map((item) => item.propertyId)))
        .catch(() => setSavedIds([]));
    }
  }, []);

  useEffect(() => {
    const query = new URLSearchParams();
    query.set('limit', '20');
    if (city && city !== 'ALL_CITIES') query.set('city', city);
    if (type !== 'all') query.set('type', type);
    fetch(`${API_URL}/properties?${query.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setList(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [city, type]);

  async function toggleSaved(propertyId: string) {
    if (!isAuthed) return;
    const isSaved = savedIds.includes(propertyId);
    try {
      if (isSaved) {
        await apiFetch<{ success: true }>(`/users/me/saved/${propertyId}`, { method: 'DELETE' }, true);
        setSavedIds((prev) => prev.filter((id) => id !== propertyId));
      } else {
        await apiFetch<{ success: true }>('/users/me/saved', {
          method: 'POST',
          body: JSON.stringify({ propertyId }),
        }, true);
        setSavedIds((prev) => [...prev, propertyId]);
      }
    } catch {
      // noop for MVP
    }
  }

  return (
    <main className="min-h-screen">
      <SiteNav />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Properties</h1>
        <p className="mt-1 text-slate-600">Browse all listings · verify on demand</p>

        <Card className="mt-5">
          <CardContent className="grid gap-3 p-4 md:grid-cols-2">
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Toronto">Toronto</SelectItem>
                <SelectItem value="Calgary">Calgary (coming soon)</SelectItem>
                <SelectItem value="ALL_CITIES">All cities</SelectItem>
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All property types</SelectItem>
                <SelectItem value="STUDIO">Studio</SelectItem>
                <SelectItem value="SHARED">Shared</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
                <SelectItem value="HOMESTAY">Homestay</SelectItem>
                <SelectItem value="HOUSE">House</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {loading ? (
          <p className="mt-8 text-slate-500">Loading…</p>
        ) : list.length === 0 ? (
          <p className="mt-8 text-slate-500">No properties yet. Run the API and add seed data.</p>
        ) : (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <li key={p.id}>
                <Card className="flex h-full flex-col overflow-hidden transition hover:shadow-md">
                  <Link href={`/properties/${p.id}`} className="block">
                  <div className="aspect-[4/3] bg-slate-200">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold tracking-tight text-slate-900">{p.title}</span>
                      <Badge variant="secondary">{p.type}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {p.city} · {p.bedrooms} bed
                    </p>
                    <p className="mt-2 font-medium text-zip-primary">
                      ${p.price}
                      <span className="text-slate-500">/mo</span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Verification starts at $149</p>
                  </div>
                  </Link>
                <CardFooter className="mt-auto justify-end gap-2 p-4 pt-0">
                    <Button asChild size="sm">
                      <Link href={`/verify/packages?propertyId=${p.id}`}>
                        Verify
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant={savedIds.includes(p.id) ? 'secondary' : 'outline'}
                      size="sm"
                      disabled={!isAuthed}
                      onClick={() => toggleSaved(p.id)}
                      className={!isAuthed ? 'cursor-not-allowed' : ''}
                    >
                      {savedIds.includes(p.id) ? 'Saved' : 'Save'}
                    </Button>
                </CardFooter>
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
