'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';

const PROPERTY_TYPES = [
  { value: 'SHARED', label: 'Shared room' },
  { value: 'STUDIO', label: 'Studio' },
  { value: 'PRIVATE', label: 'Private unit' },
  { value: 'HOMESTAY', label: 'Homestay' },
  { value: 'HOUSE', label: 'House' },
] as const;

const PARKING_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'street', label: 'Street parking' },
  { value: 'included', label: 'Included' },
  { value: 'paid', label: 'Paid' },
] as const;

/** Shown when property type is "Shared room" – what else is shared with others */
const SHARED_SPACES_OPTIONS = [
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'living_room', label: 'Living room' },
  { value: 'bathroom_kitchen', label: 'Bathroom + Kitchen' },
  { value: 'kitchen_living', label: 'Kitchen + Living room' },
  { value: 'bathroom_kitchen_living', label: 'Bathroom + Kitchen + Living room' },
  { value: 'other', label: 'Other (describe in listing)' },
] as const;

const PROVINCES = [
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NU', label: 'Nunavut' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'YT', label: 'Yukon' },
] as const;

type FormState = {
  title: string;
  description: string;
  type: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: number | '';
  longitude: number | '';
  size: number | '';
  bedrooms: number | '';
  bathrooms: number | '';
  maxOccupants: number | '';
  price: number | '';
  currency: string;
  utilitiesIncluded: boolean;
  wifi: boolean;
  laundry: boolean;
  furnished: boolean;
  gym: boolean;
  parking: string;
  petFriendly: boolean;
  schoolZone: boolean;
  airConditioning: boolean;
  dishwasher: boolean;
  /** When type is SHARED: what else is shared (bathroom, kitchen, etc.) */
  sharedSpaces: string;
};

const initialForm: FormState = {
  title: '',
  description: '',
  type: 'STUDIO',
  address: '',
  city: '',
  province: 'ON',
  postalCode: '',
  latitude: '',
  longitude: '',
  size: '',
  bedrooms: '',
  bathrooms: '',
  maxOccupants: 1,
  price: '',
  currency: 'CAD',
  utilitiesIncluded: false,
  wifi: false,
  laundry: false,
  furnished: false,
  gym: false,
  parking: 'none',
  petFriendly: false,
  schoolZone: false,
  airConditioning: false,
  dishwasher: false,
  sharedSpaces: '',
};

export default function NewListingPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getAccessToken();
    if (!token) router.replace('/landlord/login?next=/landlord/listings/new');
  }, [router]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const lat = form.latitude === '' ? NaN : Number(form.latitude);
    const lng = form.longitude === '' ? NaN : Number(form.longitude);
    if (!form.title.trim() || !form.description.trim() || !form.address.trim() || !form.city.trim() || !form.province.trim() || !form.postalCode.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setError('Please enter valid latitude and longitude.');
      return;
    }
    const size = form.size === '' ? NaN : Number(form.size);
    const bedrooms = form.bedrooms === '' ? NaN : Number(form.bedrooms);
    const bathrooms = form.bathrooms === '' ? NaN : Number(form.bathrooms);
    const maxOccupants = form.maxOccupants === '' ? NaN : Number(form.maxOccupants);
    const price = form.price === '' ? NaN : Number(form.price);
    if (!Number.isFinite(size) || size < 0 || !Number.isFinite(bedrooms) || bedrooms < 0 || !Number.isFinite(bathrooms) || bathrooms < 0 || !Number.isFinite(maxOccupants) || maxOccupants < 1 || !Number.isFinite(price) || price < 0) {
      setError('Please enter valid numbers for size, bedrooms, bathrooms, max occupants, and price.');
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch<{ success: true; data: { id: string } }>(
        '/properties',
        {
          method: 'POST',
          body: JSON.stringify({
            title: form.title.trim(),
            description: form.description.trim(),
            type: form.type,
            address: form.address.trim(),
            city: form.city.trim(),
            province: form.province.trim(),
            postalCode: form.postalCode.trim(),
            latitude: lat,
            longitude: lng,
            size,
            bedrooms,
            bathrooms,
            maxOccupants,
            price,
            currency: form.currency,
            utilitiesIncluded: form.utilitiesIncluded,
            images: [],
            videos: [],
            amenities: {
              wifi: form.wifi,
              laundry: form.laundry,
              furnished: form.furnished,
              gym: form.gym,
              parking: form.parking,
              petFriendly: form.petFriendly,
              schoolZone: form.schoolZone,
              airConditioning: form.airConditioning,
              dishwasher: form.dishwasher,
              ...(form.type === 'SHARED' && form.sharedSpaces
                ? { sharedSpaces: form.sharedSpaces }
                : {}),
            },
          }),
        },
        true,
      );
      router.push(`/landlord/listings/${res.data.id}/edit`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout variant="landlord" breadcrumb={[{ label: 'Landlord', href: '/landlord/dashboard' }, { label: 'Add listing' }]}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight">Add listing</h1>
          <p className="text-sm text-slate-600">Add your property to start receiving inquiries</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {error ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-4 text-sm text-red-800">{error}</CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Basics</CardTitle>
              <CardDescription>Give your listing a title and choose the property type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="e.g. Bright downtown studio, walk to transit"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="min-h-[100px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Describe the space, neighbourhood, and what makes it a great fit for renters."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Property type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => {
                    update('type', v);
                    if (v !== 'SHARED') update('sharedSpaces', '');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {form.type === 'SHARED' ? (
                <div className="space-y-2">
                  <Label htmlFor="sharedSpaces">What else is shared?</Label>
                  <Select
                    value={form.sharedSpaces || ''}
                    onValueChange={(v) => update('sharedSpaces', v)}
                  >
                    <SelectTrigger id="sharedSpaces">
                      <SelectValue placeholder="Select what else is shared" />
                    </SelectTrigger>
                    <SelectContent>
                      {SHARED_SPACES_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>Full address — coordinates are used for search and map display</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  placeholder="123 Main St"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => update('city', e.target.value)}
                    placeholder="Toronto"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <Select value={form.province} onValueChange={(v) => update('province', v)}>
                    <SelectTrigger id="province">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal code</Label>
                <Input
                  id="postalCode"
                  value={form.postalCode}
                  onChange={(e) => update('postalCode', e.target.value)}
                  placeholder="M5V 1A1"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={form.latitude === '' ? '' : form.latitude}
                    onChange={(e) => update('latitude', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="43.65"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={form.longitude === '' ? '' : form.longitude}
                    onChange={(e) => update('longitude', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="-79.38"
                    required
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Get coordinates from Google Maps: right‑click the map → click the coordinates to copy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details & pricing</CardTitle>
              <CardDescription>Size, capacity, and monthly rent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size (sq ft)</Label>
                  <Input
                    id="size"
                    type="number"
                    min={0}
                    value={form.size === '' ? '' : form.size}
                    onChange={(e) => update('size', e.target.value === '' ? '' : Number(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min={0}
                    value={form.bedrooms === '' ? '' : form.bedrooms}
                    onChange={(e) => update('bedrooms', e.target.value === '' ? '' : Number(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min={0}
                    value={form.bathrooms === '' ? '' : form.bathrooms}
                    onChange={(e) => update('bathrooms', e.target.value === '' ? '' : Number(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxOccupants">Max occupants</Label>
                  <Input
                    id="maxOccupants"
                    type="number"
                    min={1}
                    value={form.maxOccupants === '' ? '' : form.maxOccupants}
                    onChange={(e) => update('maxOccupants', e.target.value === '' ? '' : Number(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="price">Monthly rent</Label>
                    <Input
                      id="price"
                      type="number"
                      min={0}
                      step={0.01}
                      value={form.price === '' ? '' : form.price}
                      onChange={(e) => update('price', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="w-28 space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={form.currency} onValueChange={(v) => update('currency', v)}>
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <Checkbox
                    id="utilitiesIncluded"
                    checked={form.utilitiesIncluded}
                    onCheckedChange={(c) => update('utilitiesIncluded', c === true)}
                  />
                  <Label htmlFor="utilitiesIncluded" className="font-normal text-sm">
                    Utilities included in rent
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
              <CardDescription>Select what’s included — helps renters find the right fit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  { key: 'wifi' as const, label: 'Wi‑Fi' },
                  { key: 'laundry' as const, label: 'Laundry' },
                  { key: 'furnished' as const, label: 'Furnished' },
                  { key: 'gym' as const, label: 'Gym' },
                  { key: 'petFriendly' as const, label: 'Pet friendly' },
                  { key: 'schoolZone' as const, label: 'Near schools' },
                  { key: 'airConditioning' as const, label: 'Air conditioning' },
                  { key: 'dishwasher' as const, label: 'Dishwasher' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={form[key] as boolean}
                      onCheckedChange={(c) => update(key, c === true)}
                    />
                    <Label htmlFor={key} className="font-normal text-sm">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label>Parking</Label>
                <Select value={form.parking} onValueChange={(v) => update('parking', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PARKING_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" asChild className="order-2 min-h-11 w-full touch-manipulation sm:order-1 sm:w-auto">
              <Link href="/landlord/dashboard">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading} className="order-1 min-h-11 w-full touch-manipulation sm:order-2 sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating…
                </>
              ) : (
                'Create listing'
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
