import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZIP Concierge – Verified Rentals for International Students',
  description: 'See it before you sign. Verified rental marketplace in Toronto.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
