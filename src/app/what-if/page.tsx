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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Ultra Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/15 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-gradient-to-br from-pink-500/8 to-purple-500/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-500/8 to-blue-500/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
        
        {/* Enhanced floating particles with glow */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-purple-400/60 rounded-full animate-bounce shadow-lg shadow-purple-400/40" style={{animationDelay: '0s'}} />
        <div className="absolute top-40 right-32 w-2 h-2 bg-blue-400/70 rounded-full animate-bounce shadow-lg shadow-blue-400/40" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-32 left-1/3 w-2.5 h-2.5 bg-pink-400/65 rounded-full animate-bounce shadow-lg shadow-pink-400/40" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 right-20 w-2 h-2 bg-cyan-400/70 rounded-full animate-bounce shadow-lg shadow-cyan-400/40" style={{animationDelay: '0.5s'}} />
        
        {/* Animated connection lines */}
        <div className="absolute top-1/4 left-1/3 w-40 h-0.5 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent rotate-12 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-32 h-0.5 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent -rotate-12 animate-pulse" style={{animationDelay: '1.5s'}} />
      </div>

      {/* Ultra Enhanced header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <Link href="/" className="group">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
            <div className="relative flex items-center space-x-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl hover:bg-white/20 transition-all duration-300">
              <ArrowLeft className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
              <span className="text-white/80 group-hover:text-white transition-colors font-semibold">Назад</span>
            </div>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          {!isAuthenticated && (
            <Link href="/auth" className="group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
                <div className="relative flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-300/40 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300">
                  <User className="w-4 h-4 text-purple-200 group-hover:text-white transition-colors" />
                  <span className="text-purple-200 group-hover:text-white transition-colors text-sm font-semibold">Войти для сохранения</span>
                </div>
              </div>
            </Link>
          )}
          <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Ultra Enhanced main content */}
      <main className="relative z-10 px-6 pb-6">
        <div className="max-w-5xl mx-auto">
          {/* Ultra Enhanced title section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="relative mb-8">
              <div className="absolute -inset-8 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="relative">
                <div className="w-28 h-28 bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-purple-300/40 shadow-2xl">
                  <Wand2 className="w-14 h-14 text-white animate-pulse" />
                  <Sparkles className="w-6 h-6 text-purple-300 absolute -top-2 -right-2 animate-spin" />
                  <Stars className="w-5 h-5 text-pink-300 absolute -bottom-2 -left-2 animate-pulse" />
                  <Zap className="w-4 h-4 text-cyan-300 absolute top-1 right-1 animate-bounce" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent animate-pulse">
              Создать магический сценарий
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
              Введите вашу историю и вопрос "что если" для создания удивительного альтернативного сценария с помощью ИИ
            </p>
            <div className="flex items-center justify-center space-x-4 text-purple-300/80 text-sm font-medium">
              <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4" />
                <span>Магия ИИ</span>
              </div>
              <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
                <Zap className="w-4 h-4" />
                <span>Мгновенно</span>
              </div>
            </div>
          </div>

          {/* Ultra Enhanced warning for non-authenticated users */}
          {!isAuthenticated && (
            <div className="max-w-3xl mx-auto mb-12">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-3xl blur-2xl" />
                <div className="relative p-8 bg-gradient-to-r from-yellow-500/15 to-orange-500/15 backdrop-blur-xl border border-yellow-400/40 rounded-3xl shadow-2xl">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-full flex items-center justify-center shadow-xl">
                        <AlertCircle className="w-7 h-7 text-yellow-300" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-yellow-200 font-bold mb-3 flex items-center text-xl">
                        <Zap className="w-5 h-5 mr-2" />
                        Гостевой режим
                      </h3>
                      <p className="text-yellow-100/90 leading-relaxed text-lg mb-4">
                        Вы можете создавать сценарии без регистрации, но они не будут сохранены.
                      </p>
                      <Link href="/auth" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 hover:from-yellow-500/40 hover:to-orange-500/40 rounded-xl transition-all duration-300 font-semibold text-yellow-100 hover:text-white border border-yellow-400/30 hover:border-yellow-400/50">
                        <User className="w-5 h-5 mr-2" />
                        Войти в аккаунт
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ultra Enhanced form container */}
          <div className="w-full max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 rounded-3xl blur-3xl" />
              <div className="relative bg-white/8 backdrop-blur-xl border border-white/30 rounded-3xl p-12 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="space-y-4">
                    <label htmlFor="title" className="block text-xl font-bold text-white/95 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full flex items-center justify-center mr-3">
                        <Sparkles className="w-5 h-5 text-purple-300" />
                      </div>
                      Название {isAuthenticated ? 'сессии' : '(не сохраняется)'}
                    </label>
                    <div className="relative">
                      <Input
                        id="title"
                        value={title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                        placeholder="Введите название сессии (необязательно)"
                        className="w-full text-lg bg-white/10 backdrop-blur-md border-white/40 rounded-xl px-6 py-4 text-white placeholder-white/60 focus:border-purple-400/60 focus:ring-purple-400/40 transition-all duration-300 shadow-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label htmlFor="content" className="block text-xl font-bold text-white/95 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full flex items-center justify-center mr-3">
                        <Stars className="w-5 h-5 text-blue-300" />
                      </div>
                      История *
                    </label>
                    <div className="relative">
                      <Textarea
                        id="content"
                        value={storyContent}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setStoryContent(e.target.value)}
                        placeholder="Расскажите вашу историю... Чем подробнее, тем интереснее будет альтернативный сценарий! Опишите персонажей, события, обстоятельства..."
                        rows={10}
                        required
                        className="w-full text-lg bg-white/10 backdrop-blur-md border-white/40 rounded-xl px-6 py-4 text-white placeholder-white/60 focus:border-blue-400/60 focus:ring-blue-400/40 transition-all duration-300 min-h-[250px] resize-none shadow-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label htmlFor="question" className="block text-xl font-bold text-white/95 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-500/30 to-red-500/30 rounded-full flex items-center justify-center mr-3">
                        <Zap className="w-5 h-5 text-pink-300" />
                      </div>
                      Вопрос "что если" *
                    </label>
                    <div className="relative">
                      <Textarea
                        id="question"
                        value={question}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)}
                        placeholder="Что было бы, если... (например: главный герой принял другое решение, события происходили в другое время, изменились обстоятельства, или появился новый персонаж)"
                        rows={5}
                        required
                        className="w-full text-lg bg-white/10 backdrop-blur-md border-white/40 rounded-xl px-6 py-4 text-white placeholder-white/60 focus:border-pink-400/60 focus:ring-pink-400/40 transition-all duration-300 min-h-[150px] resize-none shadow-lg"
                      />
                    </div>
                  </div>

                  <div className="pt-6">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-cyan-600/30 rounded-xl blur-lg" />
                      <Button 
                        type="submit" 
                        className="relative w-full sm:w-auto px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 text-xl flex items-center justify-center space-x-3 border border-white/20"
                      >
                        <Wand2 className="w-6 h-6" />
                        <span>Создать магический сценарий</span>
                        <Sparkles className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Enhanced decorative elements */}
          <div className="mt-16 text-center">
            <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-2xl mx-auto shadow-2xl">
              <p className="text-white/70 text-lg max-w-lg mx-auto leading-relaxed">
                Искусственный интеллект создаст уникальный альтернативный сценарий на основе вашей истории
              </p>
              <div className="flex items-center justify-center space-x-4 mt-4 text-white/50">
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm">Творчество</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Скорость</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Stars className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm">Уникальность</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}