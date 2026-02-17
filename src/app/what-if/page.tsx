"use client";

import Link from 'next/link'
import { ArrowLeft, Wand2, User, AlertCircle, Sparkles, Zap } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useRouter } from 'next/navigation'
import { useState, Suspense } from 'react'
import { useAuth } from '@/components/auth-provider'
import { HologramCard, GlitchText, EnergyButton, AIBrainVisualization } from '@/components/cyberpunk';
import { QuestionLoader } from '@/components/question-loader';

export default function WhatIfPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [question, setQuestion] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Создаем уникальный ID сессии
    const sessionId = crypto.randomUUID();

    // Перенаправляем на чат с переданными параметрами в URL
    const encodedStory = encodeURIComponent(storyContent);
    const encodedQuestion = encodeURIComponent(question);
    router.push(`/chat/${sessionId}?story=${encodedStory}&question=${encodedQuestion}`);
  };

  return (
    <div className="min-h-screen font-serif relative overflow-hidden">
      {/* Загрузка вопроса из URL */}
      <Suspense fallback={null}>
        <QuestionLoader onQuestionLoad={setQuestion} />
      </Suspense>

      {/* Фон */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-ink-light/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-ink-light/10 to-transparent" />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-border bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="flex justify-between items-center px-6 py-4">
          <EnergyButton variant="secondary" size="sm">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Link>
          </EnergyButton>
          <div className="flex items-center gap-4">
            {!isAuthenticated && (
              <EnergyButton variant="primary" size="sm">
                <Link href="/auth" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Войти
                </Link>
              </EnergyButton>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <AIBrainVisualization size="lg" />
            </div>

            <GlitchText className="text-4xl md:text-6xl font-black uppercase mb-6 text-ink">
              What-If Device
            </GlitchText>

            <p className="text-ink/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-serif italic">
              Введите вашу историю и вопрос "что если" для создания альтернативного сценария
            </p>

            <div className="flex items-center justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2 text-primary uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                <span>Генерация</span>
              </div>
              <div className="flex items-center gap-2 text-primary uppercase tracking-widest">
                <Zap className="w-4 h-4" />
                <span>Быстро</span>
              </div>
            </div>
          </div>

          {/* Warning for non-authenticated users */}
          {!isAuthenticated && (
            <HologramCard variant="default" className="mb-10 p-6">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 border-2 border-primary flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <GlitchText className="text-lg font-bold uppercase mb-2 text-ink" intensity="low">
                    Гостевой режим
                  </GlitchText>
                  <p className="text-ink/60 mb-4 font-serif">
                    Вы можете создавать сценарии без регистрации, но они не будут сохранены.
                  </p>
                  <EnergyButton variant="secondary" size="sm">
                    <Link href="/auth" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Войти в аккаунт
                    </Link>
                  </EnergyButton>
                </div>
              </div>
            </HologramCard>
          )}

          {/* Form */}
          <HologramCard variant="default" glowIntensity="high" className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title field */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm uppercase tracking-widest text-primary font-sans">
                  <Sparkles className="w-4 h-4" />
                  Название {isAuthenticated ? 'сессии' : '(не сохраняется)'}
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Введите название сессии (необязательно)"
                  className="w-full p-4 bg-background/50 border-2 border-primary/20 focus:border-primary text-ink placeholder:text-ink/30 font-serif transition-all duration-300 outline-none book-input"
                />
              </div>

              {/* Story field */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm uppercase tracking-widest text-primary font-sans">
                  <Wand2 className="w-4 h-4" />
                  История *
                </label>
                <textarea
                  value={storyContent}
                  onChange={(e) => setStoryContent(e.target.value)}
                  placeholder="Расскажите вашу историю... Чем подробнее, тем интереснее будет альтернативный сценарий!"
                  rows={8}
                  required
                  className="w-full p-4 bg-background/50 border-2 border-primary/20 focus:border-primary text-ink placeholder:text-ink/30 font-serif transition-all duration-300 outline-none resize-none book-input"
                />
              </div>

              {/* Question field */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm uppercase tracking-widest text-primary font-sans">
                  <Zap className="w-4 h-4" />
                  Вопрос "что если" *
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Что было бы, если... (например: главный герой принял другое решение)"
                  rows={4}
                  required
                  className="w-full p-4 bg-background/50 border-2 border-primary/20 focus:border-primary text-ink placeholder:text-ink/30 font-serif transition-all duration-300 outline-none resize-none book-input"
                />
              </div>

              {/* Submit button */}
              <div className="pt-4">
                <EnergyButton type="submit" variant="primary" className="w-full py-6 text-lg">
                  <span className="flex items-center justify-center gap-3">
                    <Wand2 className="w-6 h-6" />
                    Создать сценарий
                    <Sparkles className="w-6 h-6" />
                  </span>
                </EnergyButton>
              </div>
            </form>
          </HologramCard>

          {/* Footer info */}
          <div className="mt-12 text-center">
            <HologramCard variant="default" className="p-6 inline-block">
              <p className="text-ink/60 text-sm font-serif max-w-lg">
                Создайте уникальный альтернативный сценарий на основе вашей истории
              </p>
              <div className="flex items-center justify-center gap-6 mt-4 text-xs uppercase tracking-widest text-primary">
                <span>Творчество</span>
                <span>•</span>
                <span>Скорость</span>
                <span>•</span>
                <span>Уникальность</span>
              </div>
            </HologramCard>
          </div>
        </div>
      </main>
    </div>
  )
}
