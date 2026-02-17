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
  Stars,
  Zap,
  MessageSquare,
  Film,
  Compass,
  DoorOpen,
  Skull
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AnimatedContainer, HoverScale } from '@/components/animations'
import { TypewriterText } from '@/components/typewriter'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, user, signOut } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen font-serif relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-ink-light/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-ink-light/10 to-transparent" />
      </div>

      <header className="relative z-20 border-b border-border bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-primary">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold italic tracking-tight text-ink">
                  What If Device
                </h1>
                <p className="text-xs text-ink/60 uppercase tracking-[0.2em] font-sans">Архив сценариев</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="flex items-center space-x-2 border border-primary/20 bg-primary/5 px-3 py-1 text-primary font-medium text-sm rounded-md">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-sans uppercase tracking-wider text-xs">Хранитель</span>
                </div>
              ) : (
                <Button asChild size="sm">
                  <Link href="/auth">
                    Войти
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <nav className="border-t border-border/50 pt-4">
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/what-if">
                  Новая история
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/templates">
                  Шаблоны
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/cinema">
                  Режим Кино
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-amber-500/40 hover:bg-amber-500/5">
                <Link href="/adventure">
                  <Compass className="w-4 h-4 mr-1" />
                  Приключение
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-red-900/50 hover:bg-red-950 text-red-600 hover:text-red-500">
                <Link href="/horror">
                  <Skull className="w-4 h-4 mr-1" />
                  Хоррор
                </Link>
              </Button>
              {isAuthenticated && (
                <>
                  <Button asChild variant="outline">
                    <Link href="/history">
                      История
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/profile">
                      Профиль
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-12 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-10">
            <AnimatedContainer delay={100} direction="left">
              <HoverScale scale={1.01}>
                <Card className="group hover-lift">
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <div className="w-12 h-12 border border-primary/20 rounded-full flex items-center justify-center mb-4 text-primary bg-primary/5 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
                        <Wand2 className="w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2 text-ink">Стол писателя</h2>
                      <p className="text-ink/60 text-sm italic leading-relaxed">
                        Создавайте альтернативные истории и исследуйте "что если" сценарии.
                      </p>
                    </div>
                    <Button asChild className="w-full transition-all duration-300 hover:shadow-lg">
                      <Link href="/what-if">
                        <Wand2 className="w-4 h-4 mr-2" />
                        Начать писать →
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </HoverScale>
            </AnimatedContainer>

            <AnimatedContainer delay={200} direction="left">
              <HoverScale scale={1.01}>
                <Card className="group hover-lift">
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <div className="w-12 h-12 border border-primary/20 rounded-full flex items-center justify-center mb-4 text-primary bg-primary/5 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2 text-ink">Библиотека</h2>
                      <p className="text-ink/60 text-sm italic leading-relaxed">
                        Просматривайте шаблоны и находите вдохновение для своих историй.
                      </p>
                    </div>
                    <Button asChild variant="outline" className="w-full transition-all duration-300 hover:shadow-lg hover:bg-primary/5">
                      <Link href="/templates">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Открыть архив →
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </HoverScale>
            </AnimatedContainer>

            <AnimatedContainer delay={250} direction="left">
              <HoverScale scale={1.01}>
                <Card className="group hover-lift border-red-900/50 bg-gradient-to-br from-slate-50 to-red-50/30">
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <div className="w-12 h-12 border border-red-800/50 rounded-full flex items-center justify-center mb-4 text-red-700 bg-red-900/10 group-hover:scale-110 transition-transform duration-300">
                        <Skull className="w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2 text-ink">Пробуждение</h2>
                      <p className="text-ink/60 text-sm italic leading-relaxed">
                        Хоррор-квест. Вы просыпаетесь в темноте среди свиней. Найдите выход...
                      </p>
                    </div>
                    <Button asChild variant="outline" className="w-full transition-all duration-300 hover:shadow-lg hover:bg-red-950 hover:text-red-400 border-red-900/50 hover:border-red-800">
                      <Link href="/horror">
                        <DoorOpen className="w-4 h-4 mr-2" />
                        Играть →
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </HoverScale>
            </AnimatedContainer>
          </div>

          <div className="lg:col-span-1 flex flex-col justify-center items-center text-center space-y-12">
            <AnimatedContainer delay={150}>
              <div className="relative">
                <div className="absolute -inset-x-20 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer" />
                <h1 className="text-7xl md:text-8xl font-bold mb-4 leading-none text-ink select-none">
                  What
                  <br />
                  <span className="italic text-primary animate-pulse-soft inline-block">If?</span>
                </h1>
                <div className="w-24 h-px bg-primary/30 mx-auto mt-4" />
              </div>
            </AnimatedContainer>

            {/* Suggestions */}
            <AnimatedContainer delay={300}>
              <div className="w-full max-w-md space-y-4">
                <p className="text-xs uppercase tracking-[0.2em] text-primary font-sans font-bold">Попробуйте спросить:</p>
                <div className="flex flex-col gap-2">
                  {[
                    "Что если люди могли бы слышать мысли друг друга?",
                    "Что если бы электричество никогда не было изобретено?",
                    "Что если бы коты правили миром?",
                  ].map((suggestion, i) => (
                    <Link 
                      key={i}
                      href={`/what-if?question=${encodeURIComponent(suggestion)}`}
                      className="group p-3 text-sm italic border border-primary/10 bg-card/50 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 rounded-md text-ink/70 hover:text-primary text-left hover-lift relative overflow-hidden"
                    >
                      <span className="relative z-10">"{suggestion}"</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </Link>
                  ))}
                </div>
              </div>
            </AnimatedContainer>

            <AnimatedContainer delay={400}>
              <div className="max-w-md italic text-ink/80 text-lg border-y border-primary/10 py-6">
                "У каждой истории есть начало, но путь зависит от вопросов, которые мы осмеливаемся задать."
              </div>
            </AnimatedContainer>

            <AnimatedContainer delay={500}>
              <div className="grid grid-cols-3 gap-6 w-full max-w-md">
                <div className="text-center p-2 group cursor-default">
                  <div className="w-10 h-10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-2 text-primary group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(92,75,55,0.2)]">
                    <Zap className="w-5 h-5 group-hover:animate-pulse" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-ink/60 group-hover:text-primary transition-colors">Быстро</span>
                </div>
                <div className="text-center p-2 group cursor-default">
                  <div className="w-10 h-10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-2 text-primary group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(92,75,55,0.2)]">
                    <Stars className="w-5 h-5 group-hover:animate-pulse" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-ink/60 group-hover:text-primary transition-colors">Творчески</span>
                </div>
                <div className="text-center p-2 group cursor-default">
                  <div className="w-10 h-10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-2 text-primary group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(92,75,55,0.2)]">
                    <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-ink/60 group-hover:text-primary transition-colors">Безгранично</span>
                </div>
              </div>
            </AnimatedContainer>
          </div>

          <div className="lg:col-span-1 space-y-10">
            <AnimatedContainer delay={250} direction="right">
              <HoverScale scale={1.01}>
                {isAuthenticated ? (
                  <Card className="border-primary/20 hover-lift">
                    <CardContent className="pt-6">
                      <div className="mb-6">
                        <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto animate-float">
                          <User className="w-8 h-8 text-primary" />
                        </div>
                      <h2 className="text-2xl font-bold text-center mb-1 text-ink">Летописец</h2>
                      <p className="text-ink/60 text-xs text-center uppercase tracking-widest font-sans truncate px-4">{user?.email}</p>
                      </div>
                      <div className="space-y-3">
                        <Button asChild className="w-full transition-all duration-300 hover:shadow-lg">
                          <Link href="/profile">
                            <Settings className="w-4 h-4 mr-2" />
                            Настройки
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full transition-all duration-300 hover:shadow-lg" onClick={() => signOut()}>
                          <LogIn className="w-4 h-4 mr-2" />
                          Выйти
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="hover-lift">
                    <CardContent className="pt-6">
                      <div className="mb-6">
                        <div className="w-12 h-12 border border-primary/20 rounded-full flex items-center justify-center mb-4 text-primary bg-primary/5 animate-float">
                          <LogIn className="w-6 h-6" />
                        </div>
                      <h2 className="text-2xl font-bold mb-2 text-ink">Присоединиться</h2>
                      <p className="text-ink/60 text-sm italic">
                        Создайте аккаунт, чтобы сохранять свои истории.
                      </p>
                      </div>
                      <div className="space-y-4">
                        <Button asChild className="w-full transition-all duration-300 hover:shadow-lg">
                          <Link href="/auth">
                            <LogIn className="w-4 h-4 mr-2" />
                            Войти в библиотеку →
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </HoverScale>
            </AnimatedContainer>

            <AnimatedContainer delay={325} direction="right">
              <HoverScale scale={1.01}>
                <Card className="group hover-lift">
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <div className="w-12 h-12 border border-primary/20 rounded-full flex items-center justify-center mb-4 text-primary bg-primary/5 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
                        <Film className="w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2 text-ink">Режим Кино</h2>
                      <p className="text-ink/60 text-sm italic leading-relaxed">
                        Интерактивные истории. Делайте выборы и делитесь кодом с друзьями.
                      </p>
                    </div>
                    <Button asChild variant="outline" className="w-full transition-all duration-300 hover:shadow-lg hover:bg-primary/5">
                      <Link href="/cinema">
                        <Film className="w-4 h-4 mr-2" />
                        Начать кино →
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </HoverScale>
            </AnimatedContainer>

            <AnimatedContainer delay={350} direction="right">
              <HoverScale scale={1.01}>
                <Card className="group hover-lift border-amber-500/30">
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <div className="w-12 h-12 border border-amber-500/30 rounded-full flex items-center justify-center mb-4 text-amber-600 bg-amber-500/5 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
                        <Compass className="w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2 text-ink">Приключение</h2>
                      <p className="text-ink/60 text-sm italic leading-relaxed">
                        Классический текстовый квест. Исследуйте локации и находите секреты.
                      </p>
                    </div>
                    <Button asChild variant="outline" className="w-full transition-all duration-300 hover:shadow-lg hover:bg-amber-500/5 border-amber-500/30 hover:border-amber-500/60">
                      <Link href="/adventure">
                        <Compass className="w-4 h-4 mr-2" />
                        Играть →
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </HoverScale>
            </AnimatedContainer>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-border bg-card/50 backdrop-blur-sm mt-32 font-serif">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-4">
              <h3 className="text-xl font-bold italic text-ink border-b border-primary/10 pb-2">Наша цель</h3>
              <p className="text-sm italic leading-relaxed text-ink/70">What If Device - инструмент для творчества и развития воображения.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold italic text-ink border-b border-primary/10 pb-2">Архивы</h3>
              <ul className="space-y-3 text-sm italic text-ink/60">
                <li className="hover:text-primary transition-colors cursor-pointer flex items-center gap-2">Инструменты писателя</li>
                <li className="hover:text-primary transition-colors cursor-pointer flex items-center gap-2">Шаблоны</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold italic text-ink border-b border-primary/10 pb-2">Технологии</h3>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'TypeScript', 'Tailwind', 'AI'].map(tech => (
                  <span key={tech} className="px-2 py-1 bg-card border border-border text-[10px] uppercase tracking-widest font-sans font-bold text-ink/40">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
