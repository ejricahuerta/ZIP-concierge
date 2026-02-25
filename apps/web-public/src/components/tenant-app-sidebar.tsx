'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, FileCheck, Settings, User, LogOut, Search } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { clearAccessToken } from '@/lib/auth';

const NAV_ITEMS = [
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Saved', href: '/tenant/dashboard', icon: Heart },
  { label: 'Verification Order', href: '/tenant/dashboard?tab=verifications', icon: FileCheck },
  { label: 'Settings', href: '/tenant/dashboard?tab=settings', icon: Settings },
] as const;

export function TenantAppSidebar() {
  const pathname = usePathname();

  const isItemActive = (href: string, label: string) => {
    if (label === 'Profile') return pathname === '/profile';
    if (pathname !== '/tenant/dashboard') return false;
    if (label === 'Saved') return typeof window === 'undefined' || !window.location.search.includes('tab=');
    if (label === 'Verification Order') return typeof window !== 'undefined' && window.location.search.includes('tab=verifications');
    if (label === 'Settings') return typeof window !== 'undefined' && window.location.search.includes('tab=settings');
    return false;
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Link href="/tenant/dashboard">
                <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-semibold">
                  Z
                </span>
                <span className="truncate font-semibold">ZIP · Renter</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => {
              const isActive = isItemActive(item.href, item.label);
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                    <Link href={item.href}>
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Browse listing" className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground">
                <Link href="/properties">
                  <Search className="size-4" />
                  <span>Browse listing</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Log out" onClick={() => clearAccessToken()}>
              <Link href="/tenant/login">
                <LogOut className="size-4" />
                <span>Log out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
