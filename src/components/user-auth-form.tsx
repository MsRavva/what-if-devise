"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth-provider';
import Link from 'next/link';

export function UserAuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signIn, signUp } = useAuth();

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
        router.push('/'); // Перенаправляем на главную страницу после успешной аутентификации
        router.refresh(); // Обновляем, чтобы обновить состояние аутентификации
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при аутентификации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card border-0 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="text-center space-y-1 p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardTitle className="text-2xl font-bold">Добро пожаловать</CardTitle>
        <CardDescription className="text-muted-foreground">
          {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full text-sm sm:text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              placeholder="•••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
              className="w-full text-sm sm:text-base"
            />
          </div>
          <Button
            type="submit"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2"
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col p-6 bg-muted/10 border-t border-border/30">
        <p className="text-center text-sm text-muted-foreground mb-2">
          {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
        </p>
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          disabled={isLoading}
        >
          {isLogin ? 'Создать аккаунт' : 'Войти в существующий'}
        </Button>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:underline hover:text-primary">
            Вернуться на главную
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
