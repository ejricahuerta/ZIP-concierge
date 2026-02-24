'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AUTH_CHANGED_EVENT, clearAccessToken, getAccessToken } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { Menu, X } from 'lucide-react';

type SiteNavProps = {
  compact?: boolean;
  /** When true, nav is absolute over hero: transparent bg, light text */
  overlay?: boolean;
};

type MeResponse = {
  success: true;
  data: { user: { id: string; role?: string } };
};

export function SiteNav({ compact = false, overlay = false }: SiteNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthed, setIsAuthed] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navClass = compact ? 'text-sm' : '';
  const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);
  const isLandlord = userRole === 'PROPERTY_OWNER';

  useEffect(() => {
    const syncAuth = () => setIsAuthed(Boolean(getAccessToken()));
    syncAuth();
    setHasMounted(true);
    window.addEventListener('focus', syncAuth);
    window.addEventListener('storage', syncAuth);
    window.addEventListener(AUTH_CHANGED_EVENT, syncAuth as EventListener);

    return () => {
      window.removeEventListener('focus', syncAuth);
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener(AUTH_CHANGED_EVENT, syncAuth as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!hasMounted || !isAuthed) {
      setUserRole(null);
      return;
    }
    apiFetch<MeResponse>('/users/me', undefined, true)
      .then((res) => setUserRole(res.data.user.role ?? null))
      .catch(() => setUserRole(null));
  }, [hasMounted, isAuthed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function onLogout() {
    clearAccessToken();
    router.push('/login');
    router.refresh();
  }

  const linkStateClass = (path: string) =>
    cn(
      'transition-colors',
      isActive(path) && !overlay && 'bg-accent text-accent-foreground',
      overlay && 'text-white/90 hover:bg-white/10 hover:text-white',
      isActive(path) && overlay && 'bg-white/15 text-white',
      !overlay && !isActive(path) && 'hover:bg-accent hover:text-accent-foreground'
    );

  const navLinks = (
    <>
      <Button asChild variant="ghost" size="sm" className={cn('min-h-11 shrink-0 px-4', linkStateClass('/properties'))}>
        <Link href="/properties">Properties</Link>
      </Button>
      {!hasMounted || !isAuthed ? (
        <Button asChild variant="ghost" size="sm" className={cn('min-h-11 shrink-0 px-4', linkStateClass('/landlord'))}>
          <Link href="/landlord">For landlords</Link>
        </Button>
      ) : isLandlord ? (
        <Button asChild variant="ghost" size="sm" className={cn('min-h-11 shrink-0 px-4', linkStateClass('/landlord/dashboard'))}>
          <Link href="/landlord/dashboard">Dashboard</Link>
        </Button>
      ) : null}
      {!hasMounted || !isAuthed ? (
        <Button asChild variant="ghost" size="sm" className={cn('min-h-11 shrink-0 px-4', linkStateClass('/login'))}>
          <Link href="/login">Sign in</Link>
        </Button>
      ) : (
        <>
          <Button asChild variant="ghost" size="sm" className={cn('min-h-11 shrink-0 px-4', linkStateClass('/profile'))}>
            <Link href="/profile">My Profile</Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn('min-h-11 shrink-0 px-4', overlay && 'text-white/90 hover:bg-white/10 hover:text-white')}
            onClick={onLogout}
          >
            Log out
          </Button>
        </>
      )}
    </>
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-10 w-full',
        overlay
          ? 'border-0 bg-transparent'
          : 'border-b border-slate-200 bg-white'
      )}
    >
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:min-h-16 md:gap-8">
        <Link href="/" className="flex shrink-0 items-center py-1" aria-label="ZIP Home">
          <Image
            src="/zip-logo.png"
            alt="ZIP - See it Before You Sign"
            width={compact ? 140 : 260}
            height={56}
            className={cn('h-10 w-auto object-contain sm:h-14', overlay && 'brightness-0 invert')}
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        </Link>

        {/* Desktop nav: hidden on mobile */}
        <nav className={cn('hidden items-center gap-1 md:flex', navClass)}>
          {navLinks}
        </nav>

        {/* Mobile menu button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            'min-h-11 min-w-11 shrink-0 md:hidden',
            overlay && 'text-white hover:bg-white/10 hover:text-white'
          )}
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile menu panel */}
      <div
        className={cn(
          'border-t border-slate-200/80 md:hidden',
          overlay ? 'border-white/20 bg-slate-900/95 backdrop-blur' : 'bg-white',
          mobileOpen ? 'visible opacity-100' : 'invisible h-0 overflow-hidden opacity-0'
        )}
      >
        <nav className="flex flex-col gap-1 px-2 py-3" aria-label="Mobile navigation">
          <Link
            href="/properties"
            className={cn('flex min-h-11 w-full items-center rounded-lg px-4 text-base font-medium', linkStateClass('/properties'))}
          >
            Properties
          </Link>
          {!hasMounted || !isAuthed ? (
            <Link
              href="/landlord"
              className={cn('flex min-h-11 w-full items-center rounded-lg px-4 text-base font-medium', linkStateClass('/landlord'))}
            >
              For landlords
            </Link>
          ) : isLandlord ? (
            <Link
              href="/landlord/dashboard"
              className={cn('flex min-h-11 w-full items-center rounded-lg px-4 text-base font-medium', linkStateClass('/landlord/dashboard'))}
            >
              Dashboard
            </Link>
          ) : null}
          {!hasMounted || !isAuthed ? (
            <Link
              href="/login"
              className={cn('flex min-h-11 w-full items-center rounded-lg px-4 text-base font-medium', linkStateClass('/login'))}
            >
              Sign in
            </Link>
          ) : (
            <>
              <Link
                href="/profile"
                className={cn('flex min-h-11 w-full items-center rounded-lg px-4 text-base font-medium', linkStateClass('/profile'))}
              >
                My Profile
              </Link>
              <button
                type="button"
                className={cn(
                  'flex min-h-11 w-full items-center rounded-lg border-0 bg-transparent px-4 text-left text-base font-medium',
                  linkStateClass('')
                )}
                onClick={onLogout}
              >
                Log out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
