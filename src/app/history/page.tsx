"use client";

import Link from 'next/link'
import { ArrowLeft, History, Plus, Loader2 } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { ProtectedRoute } from '@/components/protected-route'
import { useAuth } from '@/components/auth-provider'
import { getUserStories } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import HistoryList from '@/components/HistoryList';
import { HologramCard, GlitchText, EnergyButton, AIBrainVisualization } from '@/components/cyberpunk';

// Тип для истории
type Story = {
  id: string
  title: string
  content: string
  created_at: string
  scenarios_count: number
}

export default function HistoryPage() {
  const { user } = useAuth()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Загружаем истории пользователя при монтировании компонента
  useEffect(() => {
    if (user) {
      const loadStories = async () => {
        try {
          setLoading(true)
          setError(null)
          const userStories = await getUserStories(user.id)
          setStories(userStories)
        } catch (err) {
          console.error('Ошибка при загрузке историй:', err)
          setError('Не удалось загрузить историю')
        } finally {
          setLoading(false)
        }
      }

      loadStories()
    }
  }, [user])

  // Показываем сообщение о загрузке
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-950 text-slate-200 font-mono relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-20 w-32 h-32 bg-slate-900 transform rotate-45 opacity-40" />
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-slate-800 transform -rotate-12 opacity-30" />
          </div>
          <div className="text-center relative z-10">
            <div className="w-20 h-20 border-2 border-blue-700 flex items-center justify-center mx-auto mb-6 rounded-lg">
              <History className="w-10 h-10 text-blue-400 animate-pulse" />
            </div>
            <GlitchText className="text-lg uppercase tracking-widest" intensity="low">
              Загрузка истории...
            </GlitchText>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  // Показываем сообщение об ошибке
  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-950 text-slate-200 font-mono relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-20 w-32 h-32 bg-slate-900 transform rotate-45 opacity-40" />
          </div>
          <HologramCard variant="energy" className="max-w-md mx-auto p-8 text-center relative z-10">
            <div className="w-20 h-20 border-2 border-red-800 flex items-center justify-center mx-auto mb-6 rounded-lg">
              <History className="w-10 h-10 text-red-400" />
            </div>
            <GlitchText className="text-xl uppercase mb-4" color="pink">
              Ошибка
            </GlitchText>
            <p className="text-slate-400 mb-6 font-mono">{error}</p>
            <EnergyButton
              variant="primary"
              onClick={() => window.location.reload()}
            >
              Попробовать снова
            </EnergyButton>
          </HologramCard>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 text-slate-200 font-mono relative overflow-hidden">
        {/* Тёмный официальный фон */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-slate-900 transform rotate-45 opacity-40" />
          <div className="absolute top-60 right-20 w-24 h-24 bg-slate-800 transform -rotate-12 opacity-30" />
          <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-slate-900 transform rotate-12 opacity-25" />

          {/* Верхняя и нижняя линии */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        </div>

        {/* Header */}
        <header className="relative z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
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
        <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <AIBrainVisualization size="md" />
            </div>

            <GlitchText className="text-4xl font-semibold uppercase mb-4">
              История сценариев
            </GlitchText>
            <p className="text-slate-400 uppercase text-sm tracking-widest font-mono">
              Ваши созданные истории и альтернативные сценарии
            </p>
          </div>

          {/* Create new story button */}
          <div className="mb-10">
            <EnergyButton variant="primary" className="w-full">
              <Link href="/what-if" className="flex items-center justify-center gap-3 w-full">
                <Plus className="w-5 h-5" />
                Создать новую историю
              </Link>
            </EnergyButton>
          </div>

          {/* Stories list */}
          <HistoryList />
        </main>
      </div>
    </ProtectedRoute>
  )
}
