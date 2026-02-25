'use client';

import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { LandlordAppSidebar } from '@/components/landlord-app-sidebar';
import { TenantAppSidebar } from '@/components/tenant-app-sidebar';
import { DashboardNavUser } from '@/components/dashboard-nav-user';

export type DashboardVariant = 'landlord' | 'tenant';

export function DashboardLayout({
  variant,
  breadcrumb,
  children,
}: {
  variant: DashboardVariant;
  breadcrumb: { label: string; href?: string }[];
  children: React.ReactNode;
}) {
  const Sidebar = variant === 'landlord' ? LandlordAppSidebar : TenantAppSidebar;

  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger className="-ml-1 shrink-0" />
            <Separator orientation="vertical" className="mr-2 h-4 shrink-0" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumb.map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {i === breadcrumb.length - 1 || !item.href ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={item.href}>{item.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </span>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <DashboardNavUser variant={variant} />
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
