"use client"

import Link from 'next/link'
import { ArrowLeft, User, Mail, Calendar, LogOut, Settings, History, BookOpen } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { ProtectedRoute } from '@/components/protected-route'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AnimatedContainer, HoverScale } from '@/components/animations'

export default function ProfilePage() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen font-serif relative overflow-hidden">
        {/* Фон как на главной */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-ink-light/10 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-ink-light/10 to-transparent" />
        </div>

        {/* Header как на главной */}
        <header className="relative z-20 border-b border-border bg-card/80 backdrop-blur-sm shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Button asChild variant="outline" size="sm">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  На главную
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="relative z-10 container mx-auto px-6 py-12 max-w-2xl">
          <AnimatedContainer delay={100}>
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl font-bold italic mb-4 text-ink">Профиль</h1>
              <p className="text-ink/60 text-sm uppercase tracking-widest font-sans">
                Управление аккаунтом и настройки
              </p>
            </div>
          </AnimatedContainer>

          {/* Profile info */}
          <AnimatedContainer delay={200}>
            <HoverScale scale={1.01}>
              <Card className="mb-6 border-primary/20">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-6 text-ink border-b border-primary/10 pb-2">
                    Информация о пользователе
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border border-primary/10 bg-primary/5 rounded-lg">
                      <div className="w-12 h-12 border border-primary/20 rounded-full flex items-center justify-center bg-card">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-widest text-ink/50 font-sans">Email</p>
                        <p className="font-mono text-ink break-all">{user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 border border-primary/10 bg-primary/5 rounded-lg">
                      <div className="w-12 h-12 border border-primary/20 rounded-full flex items-center justify-center bg-card">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-ink/50 font-sans">Дата регистрации</p>
                        <p className="font-mono text-ink">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : 'Неизвестно'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </HoverScale>
          </AnimatedContainer>

          {/* Quick actions */}
          <AnimatedContainer delay={300}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <HoverScale scale={1.01}>
                <Link href="/history">
                  <Card className="group cursor-pointer hover:border-primary/40 transition-all duration-300 border-primary/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 border border-primary/20 rounded-full flex items-center justify-center bg-primary/5 group-hover:bg-primary/10 transition-all">
                          <History className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-ink">История</h3>
                          <p className="text-xs text-ink/50 uppercase tracking-wider font-sans">Ваши сценарии</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </HoverScale>

              <HoverScale scale={1.01}>
                <Link href="/settings">
                  <Card className="group cursor-pointer hover:border-primary/40 transition-all duration-300 border-primary/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 border border-primary/20 rounded-full flex items-center justify-center bg-primary/5 group-hover:bg-primary/10 transition-all">
                          <Settings className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-ink">Настройки</h3>
                          <p className="text-xs text-ink/50 uppercase tracking-wider font-sans">Конфигурация</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </HoverScale>
            </div>
          </AnimatedContainer>

          {/* Sign out */}
          <AnimatedContainer delay={400}>
            <Card className="border-red-900/20">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4 text-ink border-b border-red-900/10 pb-2">
                  Выход из системы
                </h2>
                <p className="text-ink/60 mb-6 font-mono text-sm">
                  Нажмите кнопку ниже, чтобы выйти из аккаунта
                </p>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full border-red-900/30 text-red-700 hover:bg-red-950/10 hover:border-red-900/50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти из аккаунта
                </Button>
              </CardContent>
            </Card>
          </AnimatedContainer>
        </main>
      </div>
    </ProtectedRoute>
  )
}
