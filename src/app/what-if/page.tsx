"use client";

import Link from 'next/link'
import { ArrowLeft, Wand2, User, AlertCircle, Sparkles, Stars, Zap } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/components/auth-provider'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-pink-500/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-cyan-500/5 rounded-full blur-2xl animate-pulse" />
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400/30 rounded-full animate-bounce" style={{animationDelay: '0s'}} />
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400/40 rounded-full animate-bounce" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-pink-400/35 rounded-full animate-bounce" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 right-20 w-1 h-1 bg-cyan-400/40 rounded-full animate-bounce" style={{animationDelay: '0.5s'}} />
      </div>

      {/* Header with glassmorphism */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <Link href="/" className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 group">
          <ArrowLeft className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
          <span className="text-white/80 group-hover:text-white transition-colors font-medium">Назад</span>
        </Link>
        <div className="flex items-center space-x-4">
          {!isAuthenticated && (
            <Link href="/auth" className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-300/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 group">
              <User className="w-4 h-4 text-purple-200 group-hover:text-white transition-colors" />
              <span className="text-purple-200 group-hover:text-white transition-colors text-sm font-medium">Войти для сохранения</span>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced title section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-purple-300/30 shadow-2xl">
                <Wand2 className="w-10 h-10 text-white animate-pulse" />
                <Sparkles className="w-4 h-4 text-purple-300 absolute -top-1 -right-1 animate-spin" />
                <Stars className="w-3 h-3 text-pink-300 absolute -bottom-1 -left-1 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent animate-pulse">
              Создать магический сценарий
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
              Введите вашу историю и вопрос "что если" для создания удивительного альтернативного сценария с помощью ИИ
            </p>
          </div>

          {/* Enhanced warning for non-authenticated users */}
          {!isAuthenticated && (
            <div className="max-w-2xl mx-auto mb-8 p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-md border border-yellow-400/30 rounded-2xl shadow-2xl">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-yellow-300 font-semibold mb-2 flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Гостевой режим
                  </h3>
                  <p className="text-yellow-100/80 text-sm leading-relaxed">
                    Вы можете создавать сценарии без регистрации, но они не будут сохранены. 
                    <Link href="/auth" className="inline-flex items-center ml-2 px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors font-medium text-yellow-200 hover:text-white">
                      Войти в аккаунт
                    </Link>
                    для сохранения истории.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced form container */}
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label htmlFor="title" className="block text-lg font-semibold text-white/90 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                    Название {isAuthenticated ? 'сессии' : '(не сохраняется)'}
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    placeholder="Введите название сессии (необязательно)"
                    className="w-full text-base bg-white/10 backdrop-blur-md border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:border-purple-400/50 focus:ring-purple-400/30 transition-all duration-300"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="content" className="block text-lg font-semibold text-white/90 flex items-center">
                    <Stars className="w-5 h-5 mr-2 text-blue-400" />
                    История *
                  </label>
                  <Textarea
                    id="content"
                    value={storyContent}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setStoryContent(e.target.value)}
                    placeholder="Расскажите вашу историю... Чем подробнее, тем интереснее будет альтернативный сценарий!"
                    rows={8}
                    required
                    className="w-full text-base bg-white/10 backdrop-blur-md border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:border-blue-400/50 focus:ring-blue-400/30 transition-all duration-300 min-h-[200px] resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="question" className="block text-lg font-semibold text-white/90 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-pink-400" />
                    Вопрос "что если" *
                  </label>
                  <Textarea
                    id="question"
                    value={question}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)}
                    placeholder="Что было бы, если... (например: главный герой принял другое решение, события происходили в другое время, или изменились обстоятельства)"
                    rows={4}
                    required
                    className="w-full text-base bg-white/10 backdrop-blur-md border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:border-pink-400/50 focus:ring-pink-400/30 transition-all duration-300 min-h-[120px] resize-none"
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg flex items-center justify-center space-x-2"
                  >
                    <Wand2 className="w-5 h-5" />
                    <span>Создать магический сценарий</span>
                    <Sparkles className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Additional decorative elements */}
          <div className="mt-12 text-center">
            <p className="text-white/50 text-sm max-w-md mx-auto">
              Искусственный интеллект создаст уникальный альтернативный сценарий на основе вашей истории
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}