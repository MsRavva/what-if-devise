"use client"

import Link from 'next/link'
import { ArrowLeft, User, Mail, Calendar, LogOut, Settings, History } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { ProtectedRoute } from '@/components/protected-route'
import { useAuth } from '@/components/auth-provider'
import { HologramCard, GlitchText, EnergyButton, AIBrainVisualization } from '@/components/cyberpunk';

export default function ProfilePage() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden neural-particles">
        {/* Киберпанк фон */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 transform rotate-45 opacity-15 animate-hologram" />
          <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 transform -rotate-12 opacity-20 animate-energy-flow" />
          <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-pink-400 to-purple-500 transform rotate-12 opacity-10 animate-quantum-flicker" />

          {/* Энергетические линии */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/30 to-transparent animate-energy-flow" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-energy-flow" style={{ animationDirection: 'reverse' }} />
        </div>

        {/* Header */}
        <header className="relative z-20 border-b-2 border-cyan-400/30 bg-black/90 backdrop-blur-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <EnergyButton variant="secondary" size="sm">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                На главную
              </Link>
            </EnergyButton>
            <ThemeToggle />
          </div>
        </header>

        {/* Main content */}
        <main className="relative z-10 max-w-2xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <AIBrainVisualization size="md" />
            </div>

            <GlitchText className="text-4xl font-black uppercase mb-4">
              Профиль
            </GlitchText>
            <p className="text-cyan-400/60 uppercase text-sm tracking-widest font-mono animate-quantum-flicker">
              Управление аккаунтом и настройки
            </p>
          </div>

          {/* Profile info */}
          <HologramCard variant="default" className="mb-6 p-6">
            <GlitchText className="text-xl font-bold uppercase mb-6" intensity="low">
              Информация о пользователе
            </GlitchText>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border border-cyan-400/30 bg-black/50">
                <div className="w-12 h-12 border-2 border-cyan-400 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500">Email</p>
                  <p className="font-mono text-white">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 border border-green-400/30 bg-black/50">
                <div className="w-12 h-12 border-2 border-green-400 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500">Дата регистрации</p>
                  <p className="font-mono text-white">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : 'Неизвестно'}
                  </p>
                </div>
              </div>
            </div>
          </HologramCard>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link href="/history">
              <HologramCard variant="neural" className="p-6 group cursor-pointer hover:border-purple-400 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 border-2 border-purple-400 flex items-center justify-center group-hover:bg-purple-400/20 transition-all">
                    <History className="w-7 h-7 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase text-white">История</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Ваши сценарии</p>
                  </div>
                </div>
              </HologramCard>
            </Link>

            <Link href="/settings">
              <HologramCard variant="neural" className="p-6 group cursor-pointer hover:border-blue-400 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 border-2 border-blue-400 flex items-center justify-center group-hover:bg-blue-400/20 transition-all">
                    <Settings className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase text-white">Настройки</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Конфигурация</p>
                  </div>
                </div>
              </HologramCard>
            </Link>
          </div>

          {/* Sign out */}
          <HologramCard variant="energy" className="p-6">
            <GlitchText className="text-xl font-bold uppercase mb-4" color="pink" intensity="low">
              Выход из системы
            </GlitchText>
            <p className="text-gray-400 mb-6 font-mono text-sm">
              Нажмите кнопку ниже, чтобы выйти из аккаунта
            </p>
            <button
              onClick={handleSignOut}
              className="w-full p-4 border-2 border-red-500/50 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500 text-red-400 font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-3"
            >
              <LogOut className="w-5 h-5" />
              Выйти из аккаунта
            </button>
          </HologramCard>
        </main>
      </div>
    </ProtectedRoute>
  )
}