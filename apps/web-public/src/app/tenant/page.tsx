import { redirect } from 'next/navigation';

/**
 * Tenant default route: send to top-level property browsing.
 * Logged-in tenants use this as their "home"; unauthenticated visitors can browse too.
 */
export default function TenantPage() {
  redirect('/properties');
}
