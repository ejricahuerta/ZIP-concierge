'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { apiFetch, API_URL } from '@/lib/api';
import { getAccessToken } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  createdAt?: string;
};

type SortValue = 'recommended' | 'price-low-high' | 'newest';

const DEFAULT_CITY = 'Toronto';
const DEFAULT_TYPE = 'all';
const DEFAULT_SORT: SortValue = 'recommended';

const parsePriceFilter = (value: string): number | null => {
  if (value.trim() === '') return null;
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue) || parsedValue < 0) return null;
  return parsedValue;
};

export default function PropertiesPage() {
  const [list, setList] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(DEFAULT_CITY);
  const [type, setType] = useState<string>(DEFAULT_TYPE);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<SortValue>(DEFAULT_SORT);
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
    setLoading(true);
    const query = new URLSearchParams();
    query.set('limit', '50');
    if (city && city !== 'ALL_CITIES') query.set('city', city);
    if (type !== DEFAULT_TYPE) query.set('type', type);
    fetch(`${API_URL}/properties?${query.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setList(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [city, type]);

  const minPriceValue = parsePriceFilter(minPrice);
  const maxPriceValue = parsePriceFilter(maxPrice);
  const isPriceRangeInvalid =
    minPriceValue !== null && maxPriceValue !== null && minPriceValue > maxPriceValue;

  const visibleProperties = useMemo(() => {
    if (isPriceRangeInvalid) return [];

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filteredProperties = list.filter((property) => {
      if (normalizedSearch) {
        const searchableText = `${property.title} ${property.city} ${property.type}`.toLowerCase();
        if (!searchableText.includes(normalizedSearch)) return false;
      }

      if (minPriceValue !== null && property.price < minPriceValue) return false;
      if (maxPriceValue !== null && property.price > maxPriceValue) return false;
      return true;
    });

    if (sortBy === 'recommended') return filteredProperties;

    const sortedProperties = [...filteredProperties];
    if (sortBy === 'price-low-high') {
      sortedProperties.sort((first, second) => first.price - second.price);
      return sortedProperties;
    }

    sortedProperties.sort((first, second) => {
      const secondDateValue = new Date(second.createdAt ?? 0).getTime();
      const firstDateValue = new Date(first.createdAt ?? 0).getTime();
      return secondDateValue - firstDateValue;
    });
    return sortedProperties;
  }, [isPriceRangeInvalid, list, maxPriceValue, minPriceValue, searchTerm, sortBy]);

  const hasActiveFilters =
    city !== DEFAULT_CITY ||
    type !== DEFAULT_TYPE ||
    searchTerm.trim() !== '' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    sortBy !== DEFAULT_SORT;

  const clearFilters = () => {
    setCity(DEFAULT_CITY);
    setType(DEFAULT_TYPE);
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy(DEFAULT_SORT);
  };

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
        <p className="mt-1 text-slate-700">Browse all listings and verify on demand.</p>

        <Card className="mt-5">
          <CardContent className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-6">
            <div className="space-y-1.5">
              <Label htmlFor="properties-city" className="text-xs uppercase tracking-wide text-slate-500">
                Location
              </Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger id="properties-city" className="h-10 rounded-lg bg-white px-3">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Toronto">Toronto</SelectItem>
                  <SelectItem value="Calgary">Calgary (coming soon)</SelectItem>
                  <SelectItem value="ALL_CITIES">All cities</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="properties-type" className="text-xs uppercase tracking-wide text-slate-500">
                Property type
              </Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="properties-type" className="h-10 rounded-lg bg-white px-3">
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
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="properties-min-price" className="text-xs uppercase tracking-wide text-slate-500">
                Price range
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  id="properties-min-price"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder="Min"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                  className="h-10 rounded-lg bg-white"
                />
                <Input
                  id="properties-max-price"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  className="h-10 rounded-lg bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="properties-sort" className="text-xs uppercase tracking-wide text-slate-500">
                Sort by
              </Label>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortValue)}>
                <SelectTrigger id="properties-sort" className="h-10 rounded-lg bg-white px-3">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low-high">Price low-&gt;high</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 md:col-span-2 lg:col-span-2">
              <Label htmlFor="property-keyword" className="text-xs uppercase tracking-wide text-slate-500">
                Search
              </Label>
              <Input
                id="property-keyword"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by neighborhood / keyword"
                className="h-10 rounded-lg bg-white"
              />
            </div>

            {hasActiveFilters ? (
              <div className="md:col-span-2 lg:col-span-6">
                <Button type="button" variant="outline" onClick={clearFilters} className="w-full sm:w-auto">
                  Clear filters
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {isPriceRangeInvalid ? (
          <p className="mt-4 text-sm text-rose-600">Minimum price must be lower than maximum price.</p>
        ) : null}

        {loading ? (
          <p className="mt-8 text-slate-500">Loading…</p>
        ) : visibleProperties.length === 0 ? (
          <p className="mt-8 text-slate-500">
            {hasActiveFilters
              ? 'No properties match your filters. Try adjusting your criteria.'
              : 'No properties yet. Run the API and add seed data.'}
          </p>
        ) : (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProperties.map((property) => (
              <li key={property.id}>
                <Card className="flex h-full flex-col overflow-hidden transition hover:shadow-md">
                  <Link href={`/properties/${property.id}`} className="block">
                    <div className="aspect-[4/3] bg-slate-200">
                      {property.images?.[0] ? (
                        <img src={property.images[0]} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold tracking-tight text-slate-900">{property.title}</span>
                        <Badge variant="secondary">{property.type}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {property.city} · {property.bedrooms} bed
                      </p>
                      <p className="mt-2 font-medium text-zip-primary">
                        ${property.price}
                        <span className="text-slate-500">/mo</span>
                      </p>
                      <p className="mt-1 text-xs text-slate-500">Verification starts at $149</p>
                    </div>
                  </Link>
                  <CardFooter className="mt-auto justify-end gap-2 p-4 pt-0">
                    <Button asChild size="sm">
                      <Link href={`/verify/packages?propertyId=${property.id}`}>
                        Verify
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant={savedIds.includes(property.id) ? 'secondary' : 'outline'}
                      size="sm"
                      disabled={!isAuthed}
                      onClick={() => toggleSaved(property.id)}
                      className={!isAuthed ? 'cursor-not-allowed' : ''}
                    >
                      {savedIds.includes(property.id) ? 'Saved' : 'Save'}
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
