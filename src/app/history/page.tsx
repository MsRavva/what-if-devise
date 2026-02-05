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
        <div className="min-h-screen font-serif relative overflow-hidden flex items-center justify-center">
          <div className="text-center relative z-10 animate-fade-in">
            <div className="w-20 h-20 border border-primary/20 flex items-center justify-center mx-auto mb-6 rounded-full bg-primary/5">
              <History className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <h2 className="text-xl italic text-ink">
              Opening the Chronicles...
            </h2>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  // Показываем сообщение об ошибке
  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen font-serif relative overflow-hidden flex items-center justify-center">
          <div className="book-card max-w-md mx-auto p-12 text-center relative z-10 border-destructive/20">
            <div className="w-20 h-20 border border-destructive/20 flex items-center justify-center mx-auto mb-8 rounded-full bg-destructive/5">
              <History className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold italic mb-4 text-ink">
              Fragmented History
            </h2>
            <p className="text-ink/60 mb-8 italic">{error}</p>
            <button
              className="book-button w-full"
              onClick={() => window.location.reload()}
            >
              Try to Restore →
            </button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen font-serif relative overflow-hidden flex flex-col">
        {/* Header */}
        <header className="relative z-20 border-b border-border bg-card/80 backdrop-blur-sm shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <Link href="/" className="book-button-secondary py-1 px-3 text-xs flex items-center gap-2">
              <ArrowLeft className="w-3 h-3" />
              Library
            </Link>
            <ThemeToggle />
          </div>
        </header>

        {/* Main content */}
        <main className="relative z-10 max-w-4xl mx-auto px-6 py-16 animate-fade-in flex-1 w-full">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 border border-primary/20 rounded-full flex items-center justify-center text-primary bg-primary/5">
                <History className="w-12 h-12" />
              </div>
            </div>

            <h1 className="text-5xl font-bold italic text-ink mb-4">
              The Chronicles
            </h1>
            <p className="text-ink/60 italic text-lg border-y border-primary/10 py-4 max-w-md mx-auto">
              A collection of your past visions and alternative realities.
            </p>
          </div>

          {/* Create new story button */}
          <div className="mb-16">
            <Link href="/what-if" className="book-button w-full flex items-center justify-center gap-3 py-4">
              <Plus className="w-5 h-5" />
              Scribe a New Manuscript
            </Link>
          </div>

          {/* Stories list */}
          <div className="space-y-12 pb-20">
            <HistoryList />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
