import { redirect } from 'next/server';

/** Default login is tenant; redirect to tenant login (no role chooser). */
export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const next = typeof searchParams?.next === 'string' ? searchParams.next : '';
  const nextQuery = next ? `?next=${encodeURIComponent(next)}` : '';
  redirect(`/tenant/login${nextQuery}`);
}
