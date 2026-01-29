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
  ChevronRight,
  Stars,
  Zap
} from 'lucide-react'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, user, signOut } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-3xl animate-pulse" />
        
        {/* Floating magical elements */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-purple-400/40 rounded-full animate-bounce" style={{animationDelay: '0s'}} />
        <div className="absolute top-40 right-32 w-2 h-2 bg-blue-400/50 rounded-full animate-bounce" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-32 left-1/3 w-2.5 h-2.5 bg-pink-400/45 rounded-full animate-bounce" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 right-20 w-2 h-2 bg-cyan-400/50 rounded-full animate-bounce" style={{animationDelay: '0.5s'}} />
        <div className="absolute top-1/4 left-1/2 w-1.5 h-1.5 bg-yellow-400/40 rounded-full animate-bounce" style={{animationDelay: '1.5s'}} />
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-green-400/40 rounded-full animate-bounce" style={{animationDelay: '2.5s'}} />
      </div>

      {/* Enhanced header with glassmorphism */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Sparkles className="w-10 h-10 text-purple-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-ping" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
            What If Device
          </h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Enhanced main content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="text-center mb-16 animate-fade-in">
          <div className="relative mb-8">
            <h2 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-pink-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent animate-pulse">
              What If?
            </h2>
            <div className="absolute -top-4 -right-4 w-8 h-8 text-yellow-400 animate-spin">✨</div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 text-pink-400 animate-bounce">🌟</div>
          </div>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Создавайте уникальные альтернативные сценарии для ваших историй с помощью магии искусственного интеллекта
          </p>
          <div className="flex items-center justify-center space-x-2 text-purple-300/60 text-sm">
            <span>✨ Бесплатно</span>
            <span>•</span>
            <span>🚀 Без ограничений</span>
            <span>•</span>
            <span>🎭 Безграничная фантазия</span>
          </div>
        </div>

        {/* Enhanced menu buttons with glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full animate-scale-in">
          {/* Enhanced What If Button */}
          <Link href="/what-if" className="group block">
            <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-300/30 rounded-3xl p-8 hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-300/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full flex items-center justify-center group-hover:from-purple-500/50 group-hover:to-pink-500/50 transition-all duration-300 shadow-xl">
                  <Wand2 className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                  <Sparkles className="w-4 h-4 text-purple-300 absolute -top-1 -right-1 animate-spin" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-purple-200 transition-colors">Что было бы, если...</h3>
                  <p className="text-white/70 group-hover:text-white/90 transition-colors leading-relaxed">Создать новый магический альтернативный сценарий</p>
                </div>
                <div className="flex items-center text-purple-300 group-hover:text-white transition-colors font-semibold">
                  <Zap className="w-4 h-4 mr-2" />
                  Создать сценарий
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Enhanced Templates Button */}
          <Link href="/templates" className="group block">
            <div className="relative bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-300/30 rounded-3xl p-8 hover:from-blue-500/30 hover:to-cyan-500/30 hover:border-blue-300/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full flex items-center justify-center group-hover:from-blue-500/50 group-hover:to-cyan-500/50 transition-all duration-300 shadow-xl">
                  <BookOpen className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                  <Stars className="w-4 h-4 text-blue-300 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-200 transition-colors">Шаблоны</h3>
                  <p className="text-white/70 group-hover:text-white/90 transition-colors leading-relaxed">Готовые примеры для вдохновения</p>
                </div>
                <div className="flex items-center text-blue-300 group-hover:text-white transition-colors font-semibold">
                  <Sparkles className="w-4 h-4 mr-2" />
                  64 шаблона
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Enhanced Login/Profile Button */}
          {isAuthenticated ? (
            <div className="group">
              <div className="relative bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-300/30 rounded-3xl p-8 hover:from-green-500/30 hover:to-emerald-500/30 hover:border-green-300/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative w-20 h-20 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full flex items-center justify-center group-hover:from-green-500/50 group-hover:to-emerald-500/50 transition-all duration-300 shadow-xl">
                    <User className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                    <div className="w-3 h-3 bg-green-400 rounded-full absolute -top-1 -right-1 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-green-200 transition-colors">Профиль</h3>
                    <p className="text-white/70 group-hover:text-white/90 transition-colors truncate max-w-40">{user?.email}</p>
                  </div>
                  <button 
                    onClick={() => signOut()}
                    className="flex items-center text-green-300 hover:text-white transition-colors font-semibold"
                  >
                    Выйти
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/auth" className="group block">
              <div className="relative bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-orange-300/30 rounded-3xl p-8 hover:from-orange-500/30 hover:to-red-500/30 hover:border-orange-300/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-full flex items-center justify-center group-hover:from-orange-500/50 group-hover:to-red-500/50 transition-all duration-300 shadow-xl">
                    <LogIn className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-orange-200 transition-colors">Войти</h3>
                    <p className="text-white/70 group-hover:text-white/90 transition-colors leading-relaxed">Доступ к личному кабинету</p>
                  </div>
                  <div className="flex items-center text-orange-300 group-hover:text-white transition-colors font-semibold">
                    Вход / Регистрация
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Enhanced Profile Button */}
          <Link href={isAuthenticated ? "/profile" : "/auth"} className={`group block ${
            isAuthenticated ? '' : 'opacity-70 hover:opacity-100'
          }`}>
            <div className={`relative backdrop-blur-xl border rounded-3xl p-8 transition-all duration-500 hover:scale-105 ${
              isAuthenticated 
                ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-300/30 hover:from-indigo-500/30 hover:to-purple-500/30 hover:border-indigo-300/50 hover:shadow-2xl hover:shadow-indigo-500/25' 
                : 'bg-gradient-to-br from-gray-500/20 to-slate-500/20 border-gray-300/30 hover:from-gray-500/30 hover:to-slate-500/30'
            }`}>
              <div className="flex flex-col items-center space-y-6">
                <div className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                  isAuthenticated 
                    ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/30 group-hover:from-indigo-500/50 group-hover:to-purple-500/50' 
                    : 'bg-gradient-to-br from-gray-500/30 to-slate-500/30'
                }`}>
                  <User className={`w-10 h-10 group-hover:scale-110 transition-transform duration-300 ${
                    isAuthenticated ? 'text-white' : 'text-white/60'
                  }`} />
                </div>
                <div className="text-center">
                  <h3 className={`text-2xl font-bold mb-3 transition-colors ${
                    isAuthenticated ? 'text-white group-hover:text-indigo-200' : 'text-white/60'
                  }`}>Профиль</h3>
                  <p className="text-white/70 group-hover:text-white/90 transition-colors leading-relaxed">Управление аккаунтом</p>
                </div>
                <div className={`flex items-center font-semibold ${
                  isAuthenticated ? 'text-indigo-300 group-hover:text-white' : 'text-white/50'
                }`}>
                  {isAuthenticated ? 'Настройки' : 'Требует входа'}
                  {isAuthenticated && <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                </div>
              </div>
            </div>
          </Link>

          {/* Enhanced History Button */}
          <Link href={isAuthenticated ? "/history" : "/auth"} className={`group block ${
            isAuthenticated ? '' : 'opacity-70 hover:opacity-100'
          }`}>
            <div className={`relative backdrop-blur-xl border rounded-3xl p-8 transition-all duration-500 hover:scale-105 ${
              isAuthenticated 
                ? 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border-violet-300/30 hover:from-violet-500/30 hover:to-fuchsia-500/30 hover:border-violet-300/50 hover:shadow-2xl hover:shadow-violet-500/25' 
                : 'bg-gradient-to-br from-gray-500/20 to-slate-500/20 border-gray-300/30 hover:from-gray-500/30 hover:to-slate-500/30'
            }`}>
              <div className="flex flex-col items-center space-y-6">
                <div className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                  isAuthenticated 
                    ? 'bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 group-hover:from-violet-500/50 group-hover:to-fuchsia-500/50' 
                    : 'bg-gradient-to-br from-gray-500/30 to-slate-500/30'
                }`}>
                  <History className={`w-10 h-10 group-hover:scale-110 transition-transform duration-300 ${
                    isAuthenticated ? 'text-white' : 'text-white/60'
                  }`} />
                </div>
                <div className="text-center">
                  <h3 className={`text-2xl font-bold mb-3 transition-colors ${
                    isAuthenticated ? 'text-white group-hover:text-violet-200' : 'text-white/60'
                  }`}>История</h3>
                  <p className="text-white/70 group-hover:text-white/90 transition-colors leading-relaxed">Ваши созданные сценарии</p>
                </div>
                <div className={`flex items-center font-semibold ${
                  isAuthenticated ? 'text-violet-300 group-hover:text-white' : 'text-white/50'
                }`}>
                  {isAuthenticated ? 'Просмотреть' : 'Требует входа'}
                  {isAuthenticated && <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                </div>
              </div>
            </div>
          </Link>

          {/* Enhanced Settings Button */}
          <Link href="/docs/HOW_TO_USE.md" className="group block" target="_blank">
            <div className="relative bg-gradient-to-br from-teal-500/20 to-cyan-500/20 backdrop-blur-xl border border-teal-300/30 rounded-3xl p-8 hover:from-teal-500/30 hover:to-cyan-500/30 hover:border-teal-300/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/25">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative w-20 h-20 bg-gradient-to-br from-teal-500/30 to-cyan-500/30 rounded-full flex items-center justify-center group-hover:from-teal-500/50 group-hover:to-cyan-500/50 transition-all duration-300 shadow-xl">
                  <Settings className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-teal-200 transition-colors">Инструкция</h3>
                  <p className="text-white/70 group-hover:text-white/90 transition-colors leading-relaxed">Как пользоваться приложением</p>
                </div>
                <div className="flex items-center text-teal-300 group-hover:text-white transition-colors font-semibold">
                  Открыть
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Enhanced footer info */}
        <div className="mt-20 text-center max-w-2xl">
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
            <p className="text-white/80 leading-relaxed mb-4">
              Генерируйте альтернативные сценарии для ваших историй с помощью ИИ. 
              Полностью бесплатно и без ограничений.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-white/60">
              <span className="flex items-center"><Sparkles className="w-4 h-4 mr-1" /> Магия ИИ</span>
              <span>•</span>
              <span className="flex items-center"><Zap className="w-4 h-4 mr-1" /> Мгновенно</span>
              <span>•</span>
              <span className="flex items-center"><Stars className="w-4 h-4 mr-1" /> Уникально</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}