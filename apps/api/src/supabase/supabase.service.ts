import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const PROPERTY_FILES_BUCKET = 'property.files';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient | null = null;

  getClient(): SupabaseClient {
    if (!this.client) {
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!url || !key) {
        throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
      }
      this.client = createClient(url, key);
    }
    return this.client;
  }

  /** Get the public URL for an object in property.files (for public bucket). */
  getPublicUrl(path: string): string {
    const url = process.env.SUPABASE_URL;
    if (!url) throw new Error('SUPABASE_URL must be set');
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
