"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import Link from 'next/link';
import { HologramCard, GlitchText, EnergyButton, AIBrainVisualization } from '@/components/cyberpunk';
import { LogIn, UserPlus, Home, Loader2 } from 'lucide-react';

export function UserAuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password);
      }

      if (result.error) {
        setError(result.error.message);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при аутентификации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HologramCard variant="default" glowIntensity="high" className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <AIBrainVisualization size="sm" />
        </div>
        <GlitchText className="text-3xl font-black uppercase mb-2" color="cyan">
          {isLogin ? 'Вход' : 'Регистрация'}
        </GlitchText>
        <p className="text-cyan-400/60 uppercase text-xs tracking-widest font-mono animate-quantum-flicker">
          {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 border-2 border-red-500/50 bg-red-500/10 text-red-400 text-sm font-mono">
          <span className="animate-glitch">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-cyan-400 font-mono">Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full p-3 bg-black/80 border-2 border-cyan-400/30 focus:border-cyan-400 text-white placeholder:text-gray-500 font-mono transition-all duration-300 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-cyan-400 font-mono">Пароль</label>
          <input
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={isLoading}
            className="w-full p-3 bg-black/80 border-2 border-cyan-400/30 focus:border-cyan-400 text-white placeholder:text-gray-500 font-mono transition-all duration-300 outline-none"
          />
        </div>
        <EnergyButton
          variant="primary"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Загрузка...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </span>
          )}
        </EnergyButton>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t-2 border-cyan-400/20" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-black px-4 text-xs uppercase tracking-widest text-gray-500 font-mono">или</span>
        </div>
      </div>

      {/* Google Auth */}
      <EnergyButton
        variant="secondary"
        className="w-full"
        onClick={async () => {
          setIsLoading(true);
          setError(null);
          try {
            const result = await signInWithGoogle();
            if (result.error) {
              setError(result.error.message);
            } else {
              router.push('/');
              router.refresh();
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка при входе через Google');
          } finally {
            setIsLoading(false);
          }
        }}
        disabled={isLoading}
      >
        <span className="flex items-center justify-center gap-2">
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M2.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.7h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.9 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Войти через Google
        </span>
      </EnergyButton>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t-2 border-cyan-400/20 text-center">
        <p className="text-gray-500 text-xs font-mono mb-4">
          {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
        </p>
        <EnergyButton
          variant="secondary"
          onClick={() => setIsLogin(!isLogin)}
          disabled={isLoading}
          className="w-full mb-4"
        >
          {isLogin ? 'Создать аккаунт' : 'Войти в существующий'}
        </EnergyButton>
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-400/60 hover:text-cyan-400 text-xs uppercase tracking-widest font-mono transition-colors">
          <Home className="w-3 h-3" />
          Вернуться на главную
        </Link>
      </div>
    </HologramCard>
  );
}
