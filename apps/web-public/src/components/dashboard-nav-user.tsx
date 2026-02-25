'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAccessToken, clearAccessToken } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, User, LogOut } from 'lucide-react';
import type { DashboardVariant } from '@/components/dashboard-layout';

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

export function DashboardNavUser({ variant }: { variant: DashboardVariant }) {
  const router = useRouter();
  const [user, setUser] = useState<MeResponse['data']['user'] | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    apiFetch<MeResponse>('/users/me', undefined, true)
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  if (!user) {
    return null;
  }

  const loginPath = variant === 'landlord' ? '/landlord/login' : '/tenant/login';

  function onLogout() {
    clearAccessToken();
    router.push(loginPath);
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex min-h-9 items-center gap-2 pl-2 pr-2 text-left"
          aria-label="Open account menu"
        >
          <span className="max-w-[140px] truncate text-sm font-medium sm:max-w-[180px]">
            {user.email}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm text-muted-foreground truncate">
          {user.email}
        </div>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onLogout}
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
