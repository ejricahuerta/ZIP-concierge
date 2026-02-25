import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const PROPERTY_FILES_BUCKET = 'property.files';

function normalizeSupabaseUrl(url: string): string {
  if (!url) return url;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

@Injectable()
export class SupabaseService {
  private client: SupabaseClient | null = null;

  getClient(): SupabaseClient {
    if (!this.client) {
      const rawUrl = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!rawUrl || !key) {
        throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
      }
      const url = normalizeSupabaseUrl(rawUrl);
      this.client = createClient(url, key);
    }
    return this.client;
  }

  /** Get the public URL for an object in property.files (for public bucket). */
  getPublicUrl(path: string): string {
    const rawUrl = process.env.SUPABASE_URL;
    if (!rawUrl) throw new Error('SUPABASE_URL must be set');
    const url = normalizeSupabaseUrl(rawUrl);
    return `${url}/storage/v1/object/public/${PROPERTY_FILES_BUCKET}/${path}`;
  }

  /** Create a signed upload URL for the property.files bucket. Returns path and token for client uploadToSignedUrl. */
  async createSignedUploadUrl(path: string): Promise<{ path: string; token: string }> {
    const { data, error } = await this.getClient()
      .storage.from(PROPERTY_FILES_BUCKET)
      .createSignedUploadUrl(path);
    if (error) throw new Error(error.message);
    if (!data?.path || !data?.token) throw new Error('Invalid signed upload response');
    return { path: data.path, token: data.token };
  }
}
