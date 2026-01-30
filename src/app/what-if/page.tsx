"use client";

import Link from 'next/link'
import { ArrowLeft, Wand2, User, AlertCircle, Sparkles, Zap, Home } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { HologramCard, GlitchText, EnergyButton, AIBrainVisualization } from '@/components/cyberpunk';

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
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden neural-particles">
      {/* Киберпанк фон */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-cyan-400 to-blue-500 transform rotate-45 opacity-15 animate-hologram" />
        <div className="absolute top-60 right-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-red-500 transform -rotate-12 opacity-20 animate-energy-flow" />
        <div className="absolute bottom-40 left-1/4 w-48 h-48 bg-gradient-to-br from-purple-400 to-violet-500 transform rotate-12 opacity-10 animate-quantum-flicker" />
        <div className="absolute bottom-20 right-1/4 w-36 h-36 bg-gradient-to-br from-green-400 to-emerald-500 transform -rotate-45 opacity-15 animate-data-pulse" />

        {/* Энергетические линии */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-energy-flow" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-400/40 to-transparent animate-energy-flow" style={{ animationDirection: 'reverse' }} />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b-2 border-cyan-400/30 bg-black/90 backdrop-blur-sm">
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

            <GlitchText className="text-4xl md:text-6xl font-black uppercase mb-6">
              What-If Device
            </GlitchText>

            <p className="text-cyan-400/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Введите вашу историю и вопрос "что если" для создания альтернативного сценария с помощью ИИ
            </p>

            <div className="flex items-center justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2 text-cyan-400/60 uppercase tracking-widest">
                <Sparkles className="w-4 h-4 animate-quantum-flicker" />
                <span>AI Powered</span>
              </div>
              <div className="flex items-center gap-2 text-pink-400/60 uppercase tracking-widest">
                <Zap className="w-4 h-4 animate-data-pulse" />
                <span>Instant</span>
              </div>
            </div>
          </div>

          {/* Warning for non-authenticated users */}
          {!isAuthenticated && (
            <HologramCard variant="energy" className="mb-10 p-6">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 border-2 border-yellow-400 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-7 h-7 text-yellow-400" />
                </div>
                <div>
                  <GlitchText className="text-lg font-bold uppercase mb-2" color="pink" intensity="low">
                    Гостевой режим
                  </GlitchText>
                  <p className="text-gray-400 mb-4 font-mono">
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
                <label className="flex items-center gap-3 text-sm uppercase tracking-widest text-cyan-400 font-mono">
                  <Sparkles className="w-4 h-4" />
                  Название {isAuthenticated ? 'сессии' : '(не сохраняется)'}
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Введите название сессии (необязательно)"
                  className="w-full p-4 bg-black/80 border-2 border-cyan-400/30 focus:border-cyan-400 text-white placeholder:text-gray-500 font-mono transition-all duration-300 outline-none"
                />
              </div>

              {/* Story field */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm uppercase tracking-widest text-pink-400 font-mono">
                  <Wand2 className="w-4 h-4" />
                  История *
                </label>
                <textarea
                  value={storyContent}
                  onChange={(e) => setStoryContent(e.target.value)}
                  placeholder="Расскажите вашу историю... Чем подробнее, тем интереснее будет альтернативный сценарий!"
                  rows={8}
                  required
                  className="w-full p-4 bg-black/80 border-2 border-pink-400/30 focus:border-pink-400 text-white placeholder:text-gray-500 font-mono transition-all duration-300 outline-none resize-none"
                />
              </div>

              {/* Question field */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm uppercase tracking-widest text-green-400 font-mono">
                  <Zap className="w-4 h-4" />
                  Вопрос "что если" *
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Что было бы, если... (например: главный герой принял другое решение)"
                  rows={4}
                  required
                  className="w-full p-4 bg-black/80 border-2 border-green-400/30 focus:border-green-400 text-white placeholder:text-gray-500 font-mono transition-all duration-300 outline-none resize-none"
                />
              </div>

              {/* Submit button */}
              <div className="pt-4">
                <EnergyButton variant="primary" className="w-full py-6 text-lg">
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
            <HologramCard variant="neural" className="p-6 inline-block">
              <p className="text-gray-400 text-sm font-mono max-w-lg">
                Искусственный интеллект создаст уникальный альтернативный сценарий на основе вашей истории
              </p>
              <div className="flex items-center justify-center gap-6 mt-4 text-xs uppercase tracking-widest">
                <span className="text-cyan-400/60">Творчество</span>
                <span className="text-gray-600">•</span>
                <span className="text-pink-400/60">Скорость</span>
                <span className="text-gray-600">•</span>
                <span className="text-green-400/60">Уникальность</span>
              </div>
            </HologramCard>
          </div>
        </div>
      </main>
    </div>
  )
}