"use client"

import Link from 'next/link'

import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/components/auth-provider'
import { 
  Wand2, 
  BookOpen, 
  LogIn, 
  User, 
  History,
  Settings,
  Sparkles,
  ChevronRight
} from 'lucide-react'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, user, signOut } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header with theme toggle */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            What If Device
          </h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
            What If?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Создавайте уникальные альтернативные сценарии для ваших историй с помощью искусственного интеллекта
          </p>
        </div>

        {/* Menu buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full animate-scale-in">
          {/* What If Button */}
          <Link href="/what-if" className="gaming-card group hover:scale-105 transition-all duration-300 neon-glow block">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Wand2 className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2 text-foreground">Что было бы, если...</h3>
                <p className="text-sm text-muted-foreground">Создать новый альтернативный сценарий</p>
              </div>
              <div className="flex items-center text-sm text-primary group-hover:text-primary-foreground transition-colors">
                Создать сценарий
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          {/* Templates Button */}
          <Link href="/templates" className="gaming-card group hover:scale-105 transition-all duration-300 block">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                <BookOpen className="w-8 h-8 text-secondary-foreground" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2 text-foreground">Шаблоны</h3>
                <p className="text-sm text-muted-foreground">Готовые примеры для вдохновения</p>
              </div>
              <div className="flex items-center text-sm text-secondary-foreground transition-colors">
                8 шаблонов
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          {/* Login/Profile Button */}
          {isAuthenticated ? (
            <div className="gaming-card group hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <User className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Профиль</h3>
                  <p className="text-sm text-muted-foreground truncate max-w-32">{user?.email}</p>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="flex items-center text-sm text-green-400 hover:text-green-300 transition-colors"
                >
                  Выйти
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ) : (
            <Link href="/auth" className="gaming-card group hover:scale-105 transition-all duration-300 block">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <LogIn className="w-8 h-8 text-accent" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Войти</h3>
                  <p className="text-sm text-muted-foreground">Доступ к личному кабинету</p>
                </div>
                <div className="flex items-center text-sm text-accent transition-colors">
                  Вход / Регистрация
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          )}

          {/* Profile Button */}
          <Link href={isAuthenticated ? "/profile" : "/auth"} className={`gaming-card group hover:scale-105 transition-all duration-300 block ${
            isAuthenticated ? '' : 'opacity-60'
          }`}>
            <div className="flex flex-col items-center space-y-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isAuthenticated 
                  ? 'bg-blue-500/20 group-hover:bg-blue-500/30' 
                  : 'bg-muted/20'
              } transition-colors`}>
                <User className={`w-8 h-8 ${
                  isAuthenticated ? 'text-blue-400' : 'text-muted-foreground'
                }`} />
              </div>
              <div className="text-center">
                <h3 className={`text-xl font-semibold mb-2 ${
                  isAuthenticated ? 'text-foreground' : 'text-muted-foreground'
                }`}>Профиль</h3>
                <p className="text-sm text-muted-foreground">Управление аккаунтом</p>
              </div>
              <div className={`flex items-center text-sm ${
                isAuthenticated ? 'text-blue-400' : 'text-muted-foreground'
              }`}>
                {isAuthenticated ? 'Настройки' : 'Требует входа'}
                {isAuthenticated && <ChevronRight className="w-4 h-4 ml-1" />}
              </div>
            </div>
          </Link>

          {/* History Button */}
          <Link href={isAuthenticated ? "/history" : "/auth"} className={`gaming-card group hover:scale-105 transition-all duration-300 block ${
            isAuthenticated ? '' : 'opacity-60'
          }`}>
            <div className="flex flex-col items-center space-y-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isAuthenticated 
                  ? 'bg-purple-500/20 group-hover:bg-purple-500/30' 
                  : 'bg-muted/20'
              } transition-colors`}>
                <History className={`w-8 h-8 ${
                  isAuthenticated ? 'text-purple-400' : 'text-muted-foreground'
                }`} />
              </div>
              <div className="text-center">
                <h3 className={`text-xl font-semibold mb-2 ${
                  isAuthenticated ? 'text-foreground' : 'text-muted-foreground'
                }`}>История</h3>
                <p className="text-sm text-muted-foreground">Ваши созданные сценарии</p>
              </div>
              <div className={`flex items-center text-sm ${
                isAuthenticated ? 'text-purple-400' : 'text-muted-foreground'
              }`}>
                {isAuthenticated ? 'Просмотреть' : 'Требует входа'}
                {isAuthenticated && <ChevronRight className="w-4 h-4 ml-1" />}
              </div>
            </div>
          </Link>

          {/* Settings Button */}
          <Link href="/docs/HOW_TO_USE.md" className="gaming-card group hover:scale-105 transition-all duration-300 block" target="_blank">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center group-hover:bg-muted/30 transition-colors">
                <Settings className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2 text-foreground">Инструкция</h3>
                <p className="text-sm text-muted-foreground">Как пользоваться приложением</p>
              </div>
              <div className="flex items-center text-sm text-muted-foreground transition-colors">
                Открыть
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center text-sm text-muted-foreground max-w-md">
          <p>
            Генерируйте альтернативные сценарии для ваших историй с помощью ИИ. 
            Полностью бесплатно и без ограничений.
          </p>
        </div>
      </main>
    </div>
  )
}