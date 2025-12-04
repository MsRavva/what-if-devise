"use client";

import Link from 'next/link'
import { ArrowLeft, History, BookOpen, Wand2, Plus, Calendar, Trash2 } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { ProtectedRoute } from '@/components/protected-route'
import { useAuth } from '@/components/auth-provider'
import { getUserStories } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import HistoryList from '@/components/HistoryList';

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
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 relative overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
              <History className="w-10 h-10 text-white" />
            </div>
            <p className="text-lg text-muted-foreground">Загрузка истории...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  // Показываем сообщение об ошибке
  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 relative overflow-hidden flex items-center justify-center">
          <div className="text-center p-6 max-w-md mx-auto">
            <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <History className="w-10 h-10 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Ошибка</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()} // Перезагружаем страницу для повторной попытки
              className="gaming-button"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </ProtectedRoute>
    )
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
        <main className="relative z-10 max-w-4xl mx-auto px-6 pb-12">
          <div className="text-center mb-8 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <History className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              История сценариев
            </h1>
            <p className="text-muted-foreground">
              Ваши созданные истории и альтернативные сценарии
            </p>
          </div>

          {/* Create new story button */}
          <div className="mb-8 animate-scale-in">
            <Link href="/what-if" className="gaming-button w-full flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Создать новую историю</span>
            </Link>
          </div>

          {/* Stories list */}
          <HistoryList />
        </main>
      </div>
    </ProtectedRoute>
  )
}