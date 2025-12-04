"use client";

import { UserAuthForm } from '@/components/user-auth-form';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <UserAuthForm />
      </div>
    </div>
  );
}
