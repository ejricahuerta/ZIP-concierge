import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant-garamond',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'ZIP Home Rental Verification | Private Due Diligence for Overseas Tenants',
  description: 'Before you send a deposit, have someone you trust on the ground. Private viewings, live or 4K walkthroughs, and honest same-day reports for Toronto rentals. Contact info@ziphvs.com.',
  keywords: ['rental verification', 'Toronto rental', 'overseas tenants', 'rental due diligence', 'property verification', 'international students', 'Toronto housing'],
  authors: [{ name: 'ZIP Home Rental Verification', url: 'https://ziphvs.com' }],
  openGraph: {
    title: 'ZIP Home Rental Verification | Private Due Diligence for Overseas Tenants',
    description: 'Before you send a deposit, have someone you trust on the ground. Private viewings and honest same-day reports for Toronto rentals.',
    type: 'website',
  },
  icons: { icon: '/icon' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 antialiased" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
