'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SiteFooterProps = {
  dark?: boolean;
};

export function SiteFooter({ dark = false }: SiteFooterProps) {
  return (
    <footer
      className={cn(
        'mt-12 border-t px-4 py-10',
        dark ? 'border-white/10 bg-[#05070b] text-white/80' : 'border-slate-200 bg-white text-slate-600'
      )}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex justify-center">
            <Image
              src="/zip-logo.png"
              alt="ZIP - See it Before You Sign"
              width={180}
              height={56}
              className="h-14 w-auto object-contain"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
          <p className="text-sm">See it before you sign. Verified rentals for international students.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 py-2">
          <Button asChild variant="ghost" size="sm" className={cn('min-h-11 min-w-11 touch-manipulation', dark && 'text-white hover:bg-white/15 hover:text-white')}>
            <Link href="/properties">Properties</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className={cn('min-h-11 min-w-11 touch-manipulation', dark && 'text-white hover:bg-white/15 hover:text-white')}>
            <Link href="/landlord">For landlords</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className={cn('min-h-11 min-w-11 touch-manipulation', dark && 'text-white hover:bg-white/15 hover:text-white')}>
            <Link href="#">About</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className={cn('min-h-11 min-w-11 touch-manipulation', dark && 'text-white hover:bg-white/15 hover:text-white')}>
            <Link href="/#faq">FAQ</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className={cn('min-h-11 min-w-11 touch-manipulation', dark && 'text-white hover:bg-white/15 hover:text-white')}>
            <Link href="/privacy">Privacy</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className={cn('min-h-11 min-w-11 touch-manipulation', dark && 'text-white hover:bg-white/15 hover:text-white')}>
            <Link href="/terms">Terms</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className={cn('min-h-11 min-w-11 touch-manipulation', dark && 'text-white hover:bg-white/15 hover:text-white')}>
            <Link href="/cookies">Cookies</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className={cn('min-h-11 min-w-11 touch-manipulation', dark && 'text-white hover:bg-white/15 hover:text-white')}>
            <Link href="#">Contact</Link>
          </Button>
        </div>
        <p className={cn('mt-6 text-center text-sm', dark ? 'text-white/50' : 'text-slate-500')}>
          © {new Date().getFullYear()} ZIP Concierge. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
