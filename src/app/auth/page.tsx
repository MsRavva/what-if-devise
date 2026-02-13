"use client";

import { UserAuthForm } from '@/components/user-auth-form';

export default function AuthPage() {
  return (
    <div className="min-h-screen font-serif relative overflow-hidden">
      {/* Книжный фон */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-ink-light/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-ink-light/10 to-transparent" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
