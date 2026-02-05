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
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, user, signOut } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen font-serif relative overflow-hidden">
      {/* Мягкий фон с текстурой бумаги уже задан в body через globals.css */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-ink-light/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-ink-light/10 to-transparent" />
      </div>

      {/* Элегантный хедер в стиле старой книги */}
      <header className="relative z-20 border-b border-border bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-6 py-4">
          {/* Top row */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-primary">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold italic tracking-tight text-ink">
                  What If Device
                </h1>
                <p className="text-xs text-ink/60 uppercase tracking-[0.2em] font-sans">AI Scenario Archive</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="flex items-center space-x-2 border border-primary/20 bg-primary/5 px-3 py-1 text-primary font-medium text-sm rounded-md">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-sans uppercase tracking-wider text-xs">Keeper</span>
                </div>
              ) : (
                <Button asChild size="sm">
                  <Link href="/auth">
                    Enter Library
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="border-t border-border/50 pt-4">
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/what-if">
                  Write New Story
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/templates">
                  Manuscripts
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/chat">
                  Consult Oracle
                </Link>
              </Button>
              {isAuthenticated && (
                <>
                  <Button asChild variant="outline">
                    <Link href="/history">
                      Chronicles
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/profile">
                      Scholar Profile
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Трехколоночный макет в книжном стиле */}
      <main className="relative z-10 container mx-auto px-6 py-12 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Левая колонка - Основные действия */}
          <div className="lg:col-span-1 space-y-10">
            <Card className="group">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div className="w-12 h-12 border border-primary/20 rounded-full flex items-center justify-center mb-4 text-primary bg-primary/5 group-hover:scale-110 transition-transform">
                    <Wand2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-ink">The Scribe's Desk</h2>
                  <p className="text-ink/60 text-sm italic leading-relaxed">
                    Summon the powers of artificial intelligence to weave new threads of reality and explore alternative histories.
                  </p>
                </div>
                <Button asChild className="w-full">
                  <Link href="/what-if">
                    <Wand2 className="w-4 h-4 mr-2" />
                    Begin Writing →
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div className="w-12 h-12 border border-primary/20 rounded-full flex items-center justify-center mb-4 text-primary bg-primary/5 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-ink">Great Library</h2>
                  <p className="text-ink/60 text-sm italic leading-relaxed">
                    Browse through 64 ancient manuscripts and templates to find inspiration for your own journey.
                  </p>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/templates">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Enter Archives →
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Центральная колонка - Герой контент */}
          <div className="lg:col-span-1 flex flex-col justify-center items-center text-center space-y-12">
            <div className="relative">
              <div className="absolute -inset-x-20 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              <h1 className="text-7xl md:text-8xl font-bold mb-4 leading-none text-ink select-none">
                What
                <br />
                <span className="italic text-primary">If?</span>
              </h1>
              <div className="w-24 h-px bg-primary/30 mx-auto mt-4" />
            </div>

            <div className="max-w-md italic text-ink/80 text-lg border-y border-primary/10 py-6">
              "Every story has a beginning, but the path it takes depends on the questions we dare to ask."
            </div>

            <div className="grid grid-cols-3 gap-6 w-full max-w-md">
              <div className="text-center p-2">
                <div className="w-10 h-10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-ink/60">Swift</span>
              </div>
              <div className="text-center p-2">
                <div className="w-10 h-10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                  <Stars className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-ink/60">Creative</span>
              </div>
              <div className="text-center p-2">
                <div className="w-10 h-10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-ink/60">Limitless</span>
              </div>
            </div>
          </div>

          {/* Правая колонка - Пользовательские действия и информация */}
          <div className="lg:col-span-1 space-y-10">
            {isAuthenticated ? (
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-1 text-ink">Chronicler</h2>
                    <p className="text-ink/60 text-xs text-center uppercase tracking-widest font-sans truncate px-4">{user?.email}</p>
                  </div>
                  <div className="space-y-3">
                    <Button asChild className="w-full">
                      <Link href="/profile">
                        <Settings className="w-4 h-4 mr-2" />
                        Library Settings
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => signOut()}>
                      <LogIn className="w-4 h-4 mr-2" />
                      Close Journal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <div className="w-12 h-12 border border-primary/20 rounded-full flex items-center justify-center mb-4 text-primary bg-primary/5">
                      <LogIn className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-ink">Join the Guild</h2>
                    <p className="text-ink/60 text-sm italic">
                      Create an account to preserve your stories in the eternal archives and access them from anywhere.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Button asChild className="w-full">
                      <Link href="/auth">
                        <LogIn className="w-4 h-4 mr-2" />
                        Enter the Library →
                      </Link>
                    </Button>
                    <div className="p-4 border border-dashed border-border rounded-md bg-primary/5">
                      <p className="text-ink/60 text-xs uppercase font-sans font-bold mb-1 tracking-wider">Guest Passage</p>
                      <p className="text-[10px] italic text-ink/40">Transient exploration (not preserved in archives)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="group">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div className="w-12 h-12 border border-primary/20 rounded-full flex items-center justify-center mb-4 text-primary bg-primary/5 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-ink">Oracle's Sanctum</h2>
                  <p className="text-ink/60 text-sm italic leading-relaxed">
                    Engage in dialogue with the AI Oracle to refine your visions or seek guidance on complex scenarios.
                  </p>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/chat">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Consult Oracle →
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Элегантный футер */}
      <footer className="relative z-10 border-t border-border bg-card/50 backdrop-blur-sm mt-32 font-serif">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">

            {/* Footer Section 1 - About */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold italic text-ink border-b border-primary/10 pb-2">
                Our Purpose
              </h3>
              <p className="text-sm italic leading-relaxed text-ink/70">
                What If Device is a repository of human imagination, augmented by the wisdom of silicon minds. We provide the tools to explore the infinite "what ifs" of existence.
              </p>
              <div className="flex space-x-3 opacity-30">
                <div className="w-5 h-5 bg-ink rounded-full" />
                <div className="w-5 h-5 bg-ink/70 rounded-full" />
                <div className="w-5 h-5 bg-ink/40 rounded-full" />
              </div>
            </div>

            {/* Footer Section 2 - Collections */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold italic text-ink border-b border-primary/10 pb-2">
                Archives
              </h3>
              <ul className="space-y-3 text-sm italic text-ink/60">
                <li className="hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary/40 rounded-full" />
                  The Scribe's Tools
                </li>
                <li className="hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary/40 rounded-full" />
                  Historical Manuscripts
                </li>
                <li className="hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary/40 rounded-full" />
                  Dialogue with the Oracle
                </li>
                <li className="hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary/40 rounded-full" />
                  The Scholar's Path
                </li>
              </ul>
            </div>

            {/* Footer Section 3 - Scholarly Tech */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold italic text-ink border-b border-primary/10 pb-2">
                The Foundation
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'Vercel', 'AI'].map(tech => (
                  <span key={tech} className="px-2 py-1 bg-card border border-border text-[10px] uppercase tracking-widest font-sans font-bold text-ink/40">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-border/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center opacity-60">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <BookOpen className="w-5 h-5 text-ink/40" />
              <p className="text-xs uppercase tracking-[0.2em] font-sans text-ink/60">
                What If Device — Anno 2026
              </p>
            </div>
            <div className="flex space-x-6 text-[10px] uppercase tracking-widest font-sans">
              <span className="text-ink/40">Crafted with patience</span>
              <span className="text-ink/40">For the curious mind</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
