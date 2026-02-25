'use client';

import { useEffect, useRef, useState } from 'react';

const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-script';
const NEARBY_RADIUS_M = 1500;
const DEFAULT_ZOOM = 15;

export type NearbyPlace = {
  name: string;
  vicinity: string;
  type: 'grocery' | 'school';
};

type PropertyMapProps = {
  latitude: number;
  longitude: number;
  address?: string;
  title?: string;
};

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Window undefined'));
  const existing = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
  if (existing && window.google?.maps) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
}

export function PropertyMap({ latitude, longitude, address, title }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !mapRef.current) {
      if (!apiKey) setMapError('Google Maps API key is not configured.');
      return;
    }

    const center: google.maps.LatLngLiteral = { lat: latitude, lng: longitude };

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (!mapRef.current || !window.google?.maps) return;
        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom: DEFAULT_ZOOM,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        });
        mapInstanceRef.current = map;

        const propertyMarker = new google.maps.Marker({
          position: center,
          map,
          title: title ?? address ?? 'Property',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#0f172a',
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 2,
          },
        });
        markersRef.current.push(propertyMarker);

        const placesService = new google.maps.places.PlacesService(map);

        const handleResults = (
          results: google.maps.places.PlaceResult[] | null,
          type: 'grocery' | 'school'
        ) => {
          if (!results || !mapInstanceRef.current) return;
          const newPlaces: NearbyPlace[] = [];
          results.forEach((place) => {
            if (!place.name || !place.geometry?.location) return;
            const loc = place.geometry.location;
            newPlaces.push({
              name: place.name,
              vicinity: place.vicinity ?? place.formatted_address ?? '',
              type,
            });
            const marker = new google.maps.Marker({
              position: loc,
              map: mapInstanceRef.current,
              title: place.name,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 6,
                fillColor: type === 'grocery' ? '#15803d' : '#1d4ed8',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 1,
              },
            });
            markersRef.current.push(marker);
          });
          setNearbyPlaces((prev) => [...prev, ...newPlaces]);
        };

        placesService.nearbySearch(
          {
            location: center,
            radius: NEARBY_RADIUS_M,
            type: 'grocery_or_supermarket',
          },
          (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              handleResults(results, 'grocery');
            }
          }
        );

        placesService.nearbySearch(
          {
            location: center,
            radius: NEARBY_RADIUS_M,
            type: 'school',
          },
          (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              handleResults(results, 'school');
            }
          }
        );

        setMapLoaded(true);
      })
      .catch((err) => {
        setMapError(err instanceof Error ? err.message : 'Failed to load map');
      });

    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      mapInstanceRef.current = null;
    };
  }, [latitude, longitude, title, address]);

  if (mapError) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
        {mapError}
      </div>
    );
  }

  const groceries = nearbyPlaces.filter((p) => p.type === 'grocery');
  const schools = nearbyPlaces.filter((p) => p.type === 'school');

  return (
    <div className="space-y-4">
      <div
        ref={mapRef}
        className="h-[280px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:h-[320px]"
        aria-label="Map showing property location and nearby places"
      />
      {!mapLoaded && (
        <p className="text-center text-sm text-slate-500">Loading map…</p>
      )}
      {(groceries.length > 0 || schools.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {groceries.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Nearby groceries
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                {groceries.slice(0, 8).map((p, i) => (
                  <li key={`g-${i}`}>
                    <span className="font-medium text-slate-900">{p.name}</span>
                    {p.vicinity && (
                      <span className="block text-slate-500">{p.vicinity}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {schools.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Nearby schools
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                {schools.slice(0, 8).map((p, i) => (
                  <li key={`s-${i}`}>
                    <span className="font-medium text-slate-900">{p.name}</span>
                    {p.vicinity && (
                      <span className="block text-slate-500">{p.vicinity}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
