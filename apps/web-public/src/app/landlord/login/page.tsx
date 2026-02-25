import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { LoginForm } from '@/components/login-form';

function LoginFormFallback() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-20 animate-pulse rounded bg-muted" />
      <div className="h-10 animate-pulse rounded bg-muted" />
      <div className="h-10 animate-pulse rounded bg-muted" />
      <div className="h-10 animate-pulse rounded bg-muted" />
    </div>
  );
}

export default function LandlordLoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/landlord" className="flex items-center gap-2 font-medium">
            <Image src="/zip-logo.png" alt="ZIP" width={120} height={40} className="h-8 w-auto object-contain" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Suspense fallback={<LoginFormFallback />}>
              <LoginForm variant="landlord" />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" aria-hidden />
      </div>
    </div>
  );
}
