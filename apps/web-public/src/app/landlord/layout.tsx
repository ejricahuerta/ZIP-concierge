import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'List Your Property – ZIP Concierge',
  description:
    'Fill your vacancy faster with qualified international tenants. List free on ZIP, complete a Property Assessment, and connect with commitment-ready renters.',
};

export default function LandlordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
