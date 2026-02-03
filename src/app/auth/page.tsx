"use client";

import { UserAuthForm } from '@/components/user-auth-form';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono relative overflow-hidden">
      {/* Тёмный официальный фон */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-slate-900 transform rotate-45 opacity-40" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-slate-800 transform -rotate-12 opacity-30" />
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-slate-900 transform rotate-12 opacity-25" />
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-slate-800 transform -rotate-45 opacity-35" />

        {/* Верхняя и нижняя линии */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
