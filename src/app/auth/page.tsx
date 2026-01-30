"use client";

import { UserAuthForm } from '@/components/user-auth-form';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden neural-particles">
      {/* Киберпанк фон */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 transform rotate-45 opacity-15 animate-hologram" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-400 to-red-500 transform -rotate-12 opacity-20 animate-energy-flow" />
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-green-400 to-emerald-500 transform rotate-12 opacity-10 animate-quantum-flicker" />
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-yellow-400 to-orange-500 transform -rotate-45 opacity-15 animate-data-pulse" />

        {/* Энергетические линии */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-energy-flow" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-400/30 to-transparent animate-energy-flow" style={{ animationDirection: 'reverse' }} />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
