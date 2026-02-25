'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AUTH_CHANGED_EVENT, clearAccessToken, getAccessToken } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, User, LogOut } from 'lucide-react';

type SiteNavProps = {
  compact?: boolean;
  /** When true, nav is absolute over hero: transparent bg, light text */
  overlay?: boolean;
};

type MeResponse = {
  success: true;
  data: {
    user: {
      id: string;
      name: string | null;
      email: string;
      role?: string;
    };
  };
};

export function SiteNav({ compact = false, overlay = false }: SiteNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthed, setIsAuthed] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<MeResponse['data']['user'] | null>(null);
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
      setUser(null);
      return;
    }
    apiFetch<MeResponse>('/users/me', undefined, true)
      .then((res) => {
        setUser(res.data.user);
        setUserRole(res.data.user.role ?? null);
      })
      .catch((err: Error & { status?: number }) => {
        setUserRole(null);
        setUser(null);
        if (err?.status === 401) clearAccessToken();
      });
  }, [hasMounted, isAuthed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function onLogout() {
    clearAccessToken();
    router.push('/tenant/login');
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

  const showProperties = !hasMounted || !isAuthed || !isLandlord;

  const navLinks = (
    <>
      {showProperties ? (
        <Button asChild variant="ghost" size="sm" className={cn('min-h-11 shrink-0 px-4', linkStateClass('/properties'))}>
          <Link href="/properties">Properties</Link>
        </Button>
      ) : null}
      {!hasMounted || !isAuthed ? (
        <Button asChild variant="ghost" size="sm" className={cn('min-h-11 shrink-0 px-4', linkStateClass('/landlord'))}>
          <Link href="/landlord">For landlords</Link>
        </Button>
      ) : isLandlord ? (
        <Button asChild variant="ghost" size="sm" className={cn('min-h-11 shrink-0 px-4', linkStateClass('/landlord/dashboard'))}>
          <Link href="/landlord/dashboard">Dashboard</Link>
        </Button>
      ) : (
        <Button asChild variant="ghost" size="sm" className={cn('min-h-11 shrink-0 px-4', linkStateClass('/tenant/dashboard'))}>
          <Link href="/tenant/dashboard">Dashboard</Link>
        </Button>
      )}
      {!hasMounted || !isAuthed ? (
        <Button asChild variant="ghost" size="sm" className={cn('min-h-11 shrink-0 px-4', linkStateClass('/tenant/login'))}>
          <Link href="/tenant/login">Sign in</Link>
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'min-h-11 shrink-0 px-3',
                overlay && 'text-white/90 hover:bg-white/10 hover:text-white'
              )}
              aria-label="Open account menu"
            >
              <span className="max-w-[140px] truncate text-sm font-medium md:max-w-[200px]">
                {user?.email || 'Account'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {user?.email && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground truncate border-b border-border mb-1">{user.email}</div>
            )}
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex cursor-pointer items-center gap-2">
                <User className="h-4 w-4" />
                My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onLogout}
              className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full',
        overlay
          ? 'border-0 bg-transparent'
          : 'border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95'
      )}
    >
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:min-h-16 md:gap-8">
        <Link
          href={isLandlord ? '/landlord/dashboard' : isAuthed ? '/tenant' : '/'}
          className="flex shrink-0 items-center py-1"
          aria-label={isLandlord ? 'ZIP Dashboard' : isAuthed ? 'ZIP Browse' : 'ZIP Home'}
        >
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
        {hasMounted && isAuthed && user?.email && (
          <div
            className={cn(
              'border-b px-4 py-3',
              overlay ? 'border-white/20' : 'border-slate-200/80'
            )}
          >
            <p className={cn('truncate text-sm font-medium', overlay ? 'text-white' : 'text-foreground')}>
              {user.email}
            </p>
          </div>
        )}
        <nav className="flex flex-col gap-1 px-2 py-3" aria-label="Mobile navigation">
          {showProperties ? (
            <Link
              href="/properties"
              className={cn('flex min-h-11 w-full items-center rounded-lg px-4 text-base font-medium', linkStateClass('/properties'))}
            >
              Properties
            </Link>
          ) : null}
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
          ) : (
            <Link
              href="/tenant/dashboard"
              className={cn('flex min-h-11 w-full items-center rounded-lg px-4 text-base font-medium', linkStateClass('/tenant/dashboard'))}
            >
              Dashboard
            </Link>
          )}
          {!hasMounted || !isAuthed ? (
            <Link
              href="/tenant/login"
              className={cn('flex min-h-11 w-full items-center rounded-lg px-4 text-base font-medium', linkStateClass('/tenant/login'))}
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
