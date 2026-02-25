import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Ensures image URL is absolute (fixes Supabase URLs saved without protocol or path-only). */
export function ensureImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return ''
  const u = url.trim()
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  if (/^[a-z0-9-]+\.supabase\.co/i.test(u)) return `https://${u}`
  if (u.startsWith('/storage/')) {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    const baseNorm = base && !/^https?:\/\//i.test(base) ? `https://${base}` : base
    return baseNorm ? `${baseNorm.replace(/\/$/, '')}${u}` : u
  }
  return u
}
