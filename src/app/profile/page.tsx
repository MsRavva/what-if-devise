"use client"

import Link from 'next/link'
import { ArrowLeft, User, Mail, Calendar, LogOut, Settings, History } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { ProtectedRoute } from '@/components/protected-route'
import { useAuth } from '@/components/auth-provider'

export default function ProfilePage() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Header */}
        <header className="relative z-10 flex justify-between items-center p-6">
          <Link href="/" className="flex items-center space-x-2 gaming-button-secondary">
            <ArrowLeft className="w-5 h-5" />
            <span>На главную</span>
          </Link>
          <ThemeToggle />
        </header>

        {/* Main content */}
        <main className="relative z-10 max-w-2xl mx-auto px-6 pb-12">
          <div className="text-center mb-8 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Профиль пользователя
            </h1>
            <p className="text-muted-foreground">
              Управление аккаунтом и настройки
            </p>
          </div>

          {/* Profile info */}
          <div className="gaming-card mb-6 animate-scale-in">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Информация о пользователе</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Дата регистрации</p>
                  <p className="font-medium text-foreground">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : 'Неизвестно'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link href="/history" className="gaming-card group hover:scale-105 transition-all duration-300 block">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <History className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">История</h3>
                  <p className="text-sm text-muted-foreground">Ваши сценарии</p>
                </div>
              </div>
            </Link>

            <Link href="/settings" className="gaming-card group hover:scale-105 transition-all duration-300 block">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <Settings className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Настройки</h3>
                  <p className="text-sm text-muted-foreground">Конфигурация</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Sign out */}
          <div className="gaming-card">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Выход из системы</h2>
            <p className="text-muted-foreground mb-4">
              Нажмите кнопку ниже, чтобы выйти из аккаунта
            </p>
            <button
              onClick={handleSignOut}
              className="w-full gaming-button-secondary text-destructive border-destructive/50 hover:bg-destructive/10 flex items-center justify-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Выйти из аккаунта</span>
            </button>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}