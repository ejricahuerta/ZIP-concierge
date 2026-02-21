'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AUTH_CHANGED_EVENT, clearAccessToken, getAccessToken } from '@/lib/auth';

type SiteNavProps = {
  compact?: boolean;
  /** When true, nav is absolute over hero: transparent bg, light text */
  overlay?: boolean;
};

export function SiteNav({ compact = false, overlay = false }: SiteNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthed, setIsAuthed] = useState(false);
  const navClass = compact ? 'text-sm' : '';
  const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

  useEffect(() => {
    const syncAuth = () => setIsAuthed(Boolean(getAccessToken()));

    syncAuth();
    window.addEventListener('focus', syncAuth);
    window.addEventListener('storage', syncAuth);
    window.addEventListener(AUTH_CHANGED_EVENT, syncAuth as EventListener);

    return () => {
      window.removeEventListener('focus', syncAuth);
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener(AUTH_CHANGED_EVENT, syncAuth as EventListener);
    };
  }, []);

  function onLogout() {
    clearAccessToken();
    router.push('/login');
    router.refresh();
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-10 w-full',
        overlay
          ? 'border-0 bg-transparent'
          : 'border-b border-slate-200 bg-white'
      )}
    >
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-8 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center py-1">
          <Image
            src="/zip-logo.png"
            alt="ZIP - See it Before You Sign"
            width={compact ? 140 : 260}
            height={56}
            className={cn('h-14 w-auto object-contain', overlay && 'brightness-0 invert')}
            priority
          />
        </Link>
        <nav className={cn('flex items-center gap-2', navClass)}>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={cn(
              isActive('/properties') && !overlay && 'bg-accent text-accent-foreground',
              overlay && 'text-white/90 hover:bg-white/10 hover:text-white',
              isActive('/properties') && overlay && 'bg-white/15 text-white'
            )}
          >
            <Link href="/properties">Properties</Link>
          </Button>
          {isAuthed ? (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  isActive('/profile') && !overlay && 'bg-accent text-accent-foreground',
                  overlay && 'text-white/90 hover:bg-white/10 hover:text-white',
                  isActive('/profile') && overlay && 'bg-white/15 text-white'
                )}
              >
                <Link href="/profile">My Profile</Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className={cn(overlay && 'text-white/90 hover:bg-white/10 hover:text-white')}
              >
                Log out
              </Button>
            </>
          ) : (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                isActive('/login') && !overlay && 'bg-accent text-accent-foreground',
                overlay && 'text-white/90 hover:bg-white/10 hover:text-white',
                isActive('/login') && overlay && 'bg-white/15 text-white'
              )}
            >
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
