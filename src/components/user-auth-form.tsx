"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
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
    <Card className="w-full max-w-md mx-auto p-8 book-card">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
            <span className="text-2xl font-serif font-bold text-primary">W?</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold uppercase mb-2 text-ink font-serif">
          {isLogin ? 'Вход' : 'Регистрация'}
        </h1>
        <p className="text-ink/60 uppercase text-xs tracking-widest font-sans">
          {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 border border-red-400/50 bg-red-50 text-red-600 text-sm font-sans rounded-md">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-primary font-sans">Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full p-3 bg-background/50 border-2 border-primary/20 focus:border-primary text-ink placeholder:text-ink/30 font-serif transition-all duration-300 outline-none book-input"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-primary font-sans">Пароль</label>
          <input
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={isLoading}
            className="w-full p-3 bg-background/50 border-2 border-primary/20 focus:border-primary text-ink placeholder:text-ink/30 font-serif transition-all duration-300 outline-none book-input"
          />
        </div>
        <button
          type="submit"
          className="book-button w-full"
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
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-primary/20" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-4 text-xs uppercase tracking-widest text-ink/50 font-sans">или</span>
        </div>
      </div>

      {/* Google Auth */}
      <button
        className="book-button-secondary w-full mb-4"
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
      </button>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-primary/20 text-center">
        <p className="text-ink/50 text-xs font-serif italic mb-4">
          {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
        </p>
        <button
          className="book-button-secondary w-full mb-4"
          onClick={() => setIsLogin(!isLogin)}
          disabled={isLoading}
        >
          {isLogin ? 'Создать аккаунт' : 'Войти в существующий'}
        </button>
        <Link href="/" className="inline-flex items-center gap-2 text-primary/60 hover:text-primary text-xs uppercase tracking-widest font-sans transition-colors">
          <Home className="w-3 h-3" />
          Вернуться на главную
        </Link>
      </div>
    </Card>
  );
}
