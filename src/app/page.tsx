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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Ultra Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/15 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-pink-500/8 to-purple-500/5 rounded-full blur-3xl animate-pulse" />
        
        {/* Secondary orbs */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-emerald-500/8 to-teal-500/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-orange-500/8 to-red-500/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
        
        {/* Floating magical particles */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-purple-400/50 rounded-full animate-bounce shadow-lg shadow-purple-400/30" style={{animationDelay: '0s'}} />
        <div className="absolute top-40 right-32 w-2 h-2 bg-blue-400/60 rounded-full animate-bounce shadow-lg shadow-blue-400/30" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-32 left-1/3 w-2.5 h-2.5 bg-pink-400/55 rounded-full animate-bounce shadow-lg shadow-pink-400/30" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 right-20 w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce shadow-lg shadow-cyan-400/30" style={{animationDelay: '0.5s'}} />
        <div className="absolute top-1/4 left-1/2 w-1.5 h-1.5 bg-yellow-400/50 rounded-full animate-bounce shadow-lg shadow-yellow-400/30" style={{animationDelay: '1.5s'}} />
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-green-400/50 rounded-full animate-bounce shadow-lg shadow-green-400/30" style={{animationDelay: '2.5s'}} />
        
        {/* Animated lines/connections */}
        <div className="absolute top-1/3 left-1/4 w-32 h-0.5 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent rotate-45 animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-0.5 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent -rotate-45 animate-pulse" style={{animationDelay: '1s'}} />
      </div>

      {/* Ultra Enhanced header with glassmorphism */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
            <div className="relative bg-gradient-to-br from-purple-500/30 to-pink-500/30 p-2 rounded-full backdrop-blur-md border border-white/20">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-ping" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
              What If Device
            </h1>
            <p className="text-xs text-white/50 font-medium">Магия альтернативных сценариев</p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Ultra Enhanced main content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="text-center mb-20 animate-fade-in">
          <div className="relative mb-10">
            <div className="absolute -inset-8 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 rounded-full blur-2xl animate-pulse" />
            <h2 className="relative text-6xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-pink-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent animate-pulse">
              What If?
            </h2>
            <div className="absolute -top-6 -right-6 w-12 h-12 text-yellow-400 animate-spin text-2xl">✨</div>
            <div className="absolute -bottom-6 -left-6 w-10 h-10 text-pink-400 animate-bounce text-xl">🌟</div>
            <div className="absolute top-1/2 -right-12 w-8 h-8 text-cyan-400 animate-pulse text-lg">💫</div>
            <div className="absolute top-1/4 -left-8 w-6 h-6 text-purple-400 animate-bounce text-sm">⭐</div>
          </div>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
            Создавайте уникальные альтернативные сценарии для ваших историй с помощью магии искусственного интеллекта
          </p>
          <div className="flex items-center justify-center space-x-4 text-purple-300/80 text-sm font-medium">
            <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-3 py-1">
              <span>✨</span>
              <span>Бесплатно</span>
            </div>
            <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-3 py-1">
              <span>🚀</span>
              <span>Без ограничений</span>
            </div>
            <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-3 py-1">
              <span>🎭</span>
              <span>Безграничная фантазия</span>
            </div>
          </div>
        </div>

        {/* Ultra Enhanced menu buttons with advanced glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl w-full animate-scale-in">
          {/* Ultra Enhanced What If Button */}
          <Link href="/what-if" className="group block">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
              <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-300/40 rounded-3xl p-10 hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-300/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30">
                <div className="flex flex-col items-center space-y-8">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                    <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded-full flex items-center justify-center group-hover:from-purple-500/60 group-hover:to-pink-500/60 transition-all duration-300 shadow-2xl border border-white/20">
                      <Wand2 className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-300" />
                      <Sparkles className="w-5 h-5 text-purple-300 absolute -top-2 -right-2 animate-spin" />
                      <Stars className="w-4 h-4 text-pink-300 absolute -bottom-1 -left-1 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white group-hover:text-purple-200 transition-colors">Что было бы, если...</h3>
                    <p className="text-white/80 group-hover:text-white/95 transition-colors leading-relaxed text-lg">Создать новый магический альтернативный сценарий</p>
                  </div>
                  <div className="flex items-center text-purple-300 group-hover:text-white transition-colors font-bold text-lg">
                    <Zap className="w-5 h-5 mr-2" />
                    Создать сценарий
                    <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Ultra Enhanced Templates Button */}
          <Link href="/templates" className="group block">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
              <div className="relative bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-300/40 rounded-3xl p-10 hover:from-blue-500/30 hover:to-cyan-500/30 hover:border-blue-300/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30">
                <div className="flex flex-col items-center space-y-8">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                    <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500/40 to-cyan-500/40 rounded-full flex items-center justify-center group-hover:from-blue-500/60 group-hover:to-cyan-500/60 transition-all duration-300 shadow-2xl border border-white/20">
                      <BookOpen className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-300" />
                      <Stars className="w-5 h-5 text-blue-300 absolute -top-2 -right-2 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white group-hover:text-blue-200 transition-colors">Шаблоны</h3>
                    <p className="text-white/80 group-hover:text-white/95 transition-colors leading-relaxed text-lg">Готовые примеры для вдохновения</p>
                  </div>
                  <div className="flex items-center text-blue-300 group-hover:text-white transition-colors font-bold text-lg">
                    <Sparkles className="w-5 h-5 mr-2" />
                    64 шаблона
                    <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Ultra Enhanced Login/Profile Button */}
          {isAuthenticated ? (
            <div className="group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
                <div className="relative bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-300/40 rounded-3xl p-10 hover:from-green-500/30 hover:to-emerald-500/30 hover:border-green-300/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/30">
                  <div className="flex flex-col items-center space-y-8">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                      <div className="relative w-24 h-24 bg-gradient-to-br from-green-500/40 to-emerald-500/40 rounded-full flex items-center justify-center group-hover:from-green-500/60 group-hover:to-emerald-500/60 transition-all duration-300 shadow-2xl border border-white/20">
                        <User className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-300" />
                        <div className="w-4 h-4 bg-green-400 rounded-full absolute -top-1 -right-1 animate-pulse border-2 border-white" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white group-hover:text-green-200 transition-colors">Профиль</h3>
                      <p className="text-white/80 group-hover:text-white/95 transition-colors truncate max-w-48 text-lg">{user?.email}</p>
                    </div>
                    <button 
                      onClick={() => signOut()}
                      className="flex items-center text-green-300 hover:text-white transition-colors font-bold text-lg"
                    >
                      Выйти
                      <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/auth" className="group block">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
                <div className="relative bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-orange-300/40 rounded-3xl p-10 hover:from-orange-500/30 hover:to-red-500/30 hover:border-orange-300/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30">
                  <div className="flex flex-col items-center space-y-8">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                      <div className="relative w-24 h-24 bg-gradient-to-br from-orange-500/40 to-red-500/40 rounded-full flex items-center justify-center group-hover:from-orange-500/60 group-hover:to-red-500/60 transition-all duration-300 shadow-2xl border border-white/20">
                        <LogIn className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white group-hover:text-orange-200 transition-colors">Войти</h3>
                      <p className="text-white/80 group-hover:text-white/95 transition-colors leading-relaxed text-lg">Доступ к личному кабинету</p>
                    </div>
                    <div className="flex items-center text-orange-300 group-hover:text-white transition-colors font-bold text-lg">
                      Вход / Регистрация
                      <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Remaining buttons with similar ultra enhancements... */}
          <Link href={isAuthenticated ? "/profile" : "/auth"} className={`group block ${
            isAuthenticated ? '' : 'opacity-80 hover:opacity-100'
          }`}>
            <div className="relative">
              <div className={`absolute -inset-2 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 ${
                isAuthenticated 
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20' 
                  : 'bg-gradient-to-r from-gray-500/20 to-slate-500/20'
              }`} />
              <div className={`relative backdrop-blur-xl border rounded-3xl p-10 transition-all duration-500 hover:scale-105 ${
                isAuthenticated 
                  ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-300/40 hover:from-indigo-500/30 hover:to-purple-500/30 hover:border-indigo-300/60 hover:shadow-2xl hover:shadow-indigo-500/30' 
                  : 'bg-gradient-to-br from-gray-500/20 to-slate-500/20 border-gray-300/40 hover:from-gray-500/30 hover:to-slate-500/30'
              }`}>
                <div className="flex flex-col items-center space-y-8">
                  <div className="relative">
                    <div className={`absolute -inset-4 rounded-full blur-lg group-hover:blur-xl transition-all duration-300 ${
                      isAuthenticated 
                        ? 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30' 
                        : 'bg-gradient-to-r from-gray-500/30 to-slate-500/30'
                    }`} />
                    <div className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl border border-white/20 ${
                      isAuthenticated 
                        ? 'bg-gradient-to-br from-indigo-500/40 to-purple-500/40 group-hover:from-indigo-500/60 group-hover:to-purple-500/60' 
                        : 'bg-gradient-to-br from-gray-500/40 to-slate-500/40'
                    }`}>
                      <User className={`w-12 h-12 group-hover:scale-110 transition-transform duration-300 ${
                        isAuthenticated ? 'text-white' : 'text-white/60'
                      }`} />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className={`text-2xl md:text-3xl font-bold mb-4 transition-colors ${
                      isAuthenticated ? 'text-white group-hover:text-indigo-200' : 'text-white/60'
                    }`}>Профиль</h3>
                    <p className="text-white/80 group-hover:text-white/95 transition-colors leading-relaxed text-lg">Управление аккаунтом</p>
                  </div>
                  <div className={`flex items-center font-bold text-lg ${
                    isAuthenticated ? 'text-indigo-300 group-hover:text-white' : 'text-white/50'
                  }`}>
                    {isAuthenticated ? 'Настройки' : 'Требует входа'}
                    {isAuthenticated && <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform duration-300" />}
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link href={isAuthenticated ? "/history" : "/auth"} className={`group block ${
            isAuthenticated ? '' : 'opacity-80 hover:opacity-100'
          }`}>
            <div className="relative">
              <div className={`absolute -inset-2 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 ${
                isAuthenticated 
                  ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20' 
                  : 'bg-gradient-to-r from-gray-500/20 to-slate-500/20'
              }`} />
              <div className={`relative backdrop-blur-xl border rounded-3xl p-10 transition-all duration-500 hover:scale-105 ${
                isAuthenticated 
                  ? 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border-violet-300/40 hover:from-violet-500/30 hover:to-fuchsia-500/30 hover:border-violet-300/60 hover:shadow-2xl hover:shadow-violet-500/30' 
                  : 'bg-gradient-to-br from-gray-500/20 to-slate-500/20 border-gray-300/40 hover:from-gray-500/30 hover:to-slate-500/30'
              }`}>
                <div className="flex flex-col items-center space-y-8">
                  <div className="relative">
                    <div className={`absolute -inset-4 rounded-full blur-lg group-hover:blur-xl transition-all duration-300 ${
                      isAuthenticated 
                        ? 'bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30' 
                        : 'bg-gradient-to-r from-gray-500/30 to-slate-500/30'
                    }`} />
                    <div className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl border border-white/20 ${
                      isAuthenticated 
                        ? 'bg-gradient-to-br from-violet-500/40 to-fuchsia-500/40 group-hover:from-violet-500/60 group-hover:to-fuchsia-500/60' 
                        : 'bg-gradient-to-br from-gray-500/40 to-slate-500/40'
                    }`}>
                      <History className={`w-12 h-12 group-hover:scale-110 transition-transform duration-300 ${
                        isAuthenticated ? 'text-white' : 'text-white/60'
                      }`} />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className={`text-2xl md:text-3xl font-bold mb-4 transition-colors ${
                      isAuthenticated ? 'text-white group-hover:text-violet-200' : 'text-white/60'
                    }`}>История</h3>
                    <p className="text-white/80 group-hover:text-white/95 transition-colors leading-relaxed text-lg">Ваши созданные сценарии</p>
                  </div>
                  <div className={`flex items-center font-bold text-lg ${
                    isAuthenticated ? 'text-violet-300 group-hover:text-white' : 'text-white/50'
                  }`}>
                    {isAuthenticated ? 'Просмотреть' : 'Требует входа'}
                    {isAuthenticated && <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform duration-300" />}
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/docs/HOW_TO_USE.md" className="group block" target="_blank">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
              <div className="relative bg-gradient-to-br from-teal-500/20 to-cyan-500/20 backdrop-blur-xl border border-teal-300/40 rounded-3xl p-10 hover:from-teal-500/30 hover:to-cyan-500/30 hover:border-teal-300/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/30">
                <div className="flex flex-col items-center space-y-8">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/30 to-cyan-500/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                    <div className="relative w-24 h-24 bg-gradient-to-br from-teal-500/40 to-cyan-500/40 rounded-full flex items-center justify-center group-hover:from-teal-500/60 group-hover:to-cyan-500/60 transition-all duration-300 shadow-2xl border border-white/20">
                      <Settings className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white group-hover:text-teal-200 transition-colors">Инструкция</h3>
                    <p className="text-white/80 group-hover:text-white/95 transition-colors leading-relaxed text-lg">Как пользоваться приложением</p>
                  </div>
                  <div className="flex items-center text-teal-300 group-hover:text-white transition-colors font-bold text-lg">
                    Открыть
                    <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Ultra Enhanced footer info */}
        <div className="mt-24 text-center max-w-3xl">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 rounded-3xl blur-2xl" />
            <div className="relative bg-white/8 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl">
              <p className="text-white/90 leading-relaxed mb-6 text-lg font-medium">
                Генерируйте альтернативные сценарии для ваших историй с помощью ИИ. 
                Полностью бесплатно и без ограничений.
              </p>
              <div className="flex items-center justify-center space-x-6 text-white/70">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="font-medium">Магия ИИ</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium">Мгновенно</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
                  <Stars className="w-5 h-5 text-cyan-400" />
                  <span className="font-medium">Уникально</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}