'use client';

import { useRef, useState } from 'react';
import { getSupabase, PROPERTY_FILES_BUCKET } from '@/lib/supabase';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';

const MAX_IMAGES = 15;
const MAX_FILE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

type UploadUrlResponse = {
  success: true;
  data: { path: string; token: string; publicUrl: string };
};

type ListingPhotoUploadProps = {
  propertyId: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
  disabled?: boolean;
};

export function ListingPhotoUpload({
  propertyId,
  images,
  onImagesChange,
  disabled = false,
}: ListingPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (images.length >= MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} photos allowed.`);
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`File must be under ${MAX_FILE_MB} MB.`);
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please use JPEG, PNG, or WebP.');
      return;
    }
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeName = `photo.${ext}`;
    setError('');
    setUploading(true);
    try {
      const res = await apiFetch<UploadUrlResponse>(
        `/properties/${propertyId}/upload-url`,
        {
          method: 'POST',
          body: JSON.stringify({ filename: safeName }),
        },
        true,
      );
      const { path, token, publicUrl } = res.data;
      const supabase = getSupabase();
      const { error: uploadError } = await supabase.storage
        .from(PROPERTY_FILES_BUCKET)
        .uploadToSignedUrl(path, token, file, { contentType: file.type });
      if (uploadError) throw new Error(uploadError.message);
      onImagesChange([...images, publicUrl]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    onImagesChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled || uploading || images.length >= MAX_IMAGES}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || uploading || images.length >= MAX_IMAGES}
          onClick={() => inputRef.current?.click()}
          className="min-h-11 touch-manipulation"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <>
              <ImagePlus className="mr-1 h-4 w-4" aria-hidden />
              Add photo
            </>
          )}
        </Button>
        <span className="text-xs text-slate-500">
          {images.length} / {MAX_IMAGES} · JPEG, PNG or WebP, max {MAX_FILE_MB} MB
        </span>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {images.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((url, i) => (
            <li key={`${url}-${i}`} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover"
              />
              {!disabled ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-1 top-1 h-9 w-9 min-h-9 min-w-9 touch-manipulation"
                  onClick={() => removeImage(i)}
                  aria-label="Remove photo"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
