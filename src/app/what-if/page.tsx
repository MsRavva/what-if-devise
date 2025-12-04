"use client";

import Link from 'next/link'
import { ArrowLeft, Wand2 } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ProtectedRoute } from '@/components/protected-route'

export default function WhatIfPage() {
  const router = useRouter();
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
            <span>Назад</span>
          </Link>
          <ThemeToggle />
        </header>

        {/* Main content */}
        <main className="relative z-10 px-6 pb-6">
          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <div className="text-center mb-8 animate-fade-in">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2 className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Начать сессию чата
              </h1>
              <p className="text-lg text-muted-foreground">
                Введите вашу историю и "what-if" вопрос для начала чата с нейросетью
              </p>
            </div>

            <div className="w-full max-w-4xl mx-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Название сессии
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    placeholder="Введите название сессии (необязательно)"
                    className="w-full text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-2">
                    История
                  </label>
                  <Textarea
                    id="content"
                    value={storyContent}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setStoryContent(e.target.value)}
                    placeholder="Введите вашу историю"
                    rows={6}
                    required
                    className="w-full text-sm sm:text-base h-64 min-h-[16rem]"
                  />
                </div>

                <div>
                  <label htmlFor="question" className="block text-sm font-medium mb-2">
                    Что-если вопрос
                  </label>
                  <Textarea
                    id="question"
                    value={question}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)}
                    placeholder="Введите ваш 'what-if' вопрос"
                    rows={3}
                    required
                    className="w-full text-sm sm:text-base h-40 min-h-[10rem]"
                  />
                </div>

                <Button type="submit" className="w-full sm:w-auto">
                  Начать чат
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}