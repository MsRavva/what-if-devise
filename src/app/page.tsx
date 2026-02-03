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
import {
  AIBrainVisualization,
  HologramCard,
  EnergyButton,
  GlitchText
} from '@/components/cyberpunk'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, user, signOut } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono relative overflow-hidden">
      {/* Тёмный официальный фон */}
      <div className="absolute inset-0">
        {/* Приглушённые геометрические фигуры */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-slate-900 transform rotate-45 opacity-40" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-slate-800 transform -rotate-12 opacity-30" />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-slate-900 transform rotate-12 opacity-25" />
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-slate-800 transform -rotate-45 opacity-35" />

        {/* Сетка */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border border-slate-700/30" />
            ))}
          </div>
        </div>

        {/* Верхняя и нижняя линии */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
      </div>

      {/* Официальный хедер */}
      <header className="relative z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          {/* Top row */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <AIBrainVisualization size="sm" />
              </div>
              <div>
                <GlitchText className="text-2xl font-black uppercase tracking-wider">
                  What If Device
                </GlitchText>
                <p className="text-xs text-slate-400 uppercase tracking-widest">AI Scenario Generator</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="flex items-center space-x-2 bg-emerald-900/60 border border-emerald-700 px-3 py-1 text-emerald-400 font-medium text-sm uppercase rounded">
                  <User className="w-4 h-4" />
                  <span>Online</span>
                </div>
              ) : (
                <EnergyButton size="sm">
                  <Link href="/auth">Login</Link>
                </EnergyButton>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="border-t border-slate-800 pt-4">
            <div className="flex flex-wrap gap-4">
              <EnergyButton variant="primary" size="sm">
                <Link href="/what-if">Generate</Link>
              </EnergyButton>
              <EnergyButton variant="secondary" size="sm">
                <Link href="/templates">Templates</Link>
              </EnergyButton>
              <EnergyButton variant="primary" size="sm">
                <Link href="/chat">Chat</Link>
              </EnergyButton>
              <EnergyButton variant="secondary" size="sm">
                <Link href="/cyberpunk-demo">🚀 Demo</Link>
              </EnergyButton>
              {isAuthenticated && (
                <>
                  <EnergyButton variant="secondary" size="sm">
                    <Link href="/history">History</Link>
                  </EnergyButton>
                  <EnergyButton variant="secondary" size="sm">
                    <Link href="/profile">Profile</Link>
                  </EnergyButton>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Трехколоночный макет с голографическими карточками */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[calc(100vh-200px)]">

          {/* Левая колонка - Основные действия */}
          <div className="lg:col-span-1 space-y-8">
            <HologramCard variant="default" glowIntensity="high">
              <div className="mb-6">
                <AIBrainVisualization size="sm" />
                <GlitchText className="text-3xl font-black uppercase mb-2" color="cyan">
                  Create
                </GlitchText>
                <p className="text-cyan-400 uppercase text-sm tracking-wider">Generate New Scenario</p>
              </div>
              <EnergyButton variant="primary" className="w-full">
                <Link href="/what-if" className="flex items-center justify-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  Start Creating →
                </Link>
              </EnergyButton>
            </HologramCard>

            <HologramCard variant="energy" glowIntensity="medium">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-black" />
                </div>
                <GlitchText className="text-3xl font-black uppercase mb-2" color="pink">
                  Templates
                </GlitchText>
                <p className="text-pink-400 uppercase text-sm tracking-wider">64 Ready Examples</p>
              </div>
              <EnergyButton variant="secondary" className="w-full">
                <Link href="/templates" className="flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Browse Templates →
                </Link>
              </EnergyButton>
            </HologramCard>
          </div>

          {/* Центральная колонка - Герой контент */}
          <div className="lg:col-span-1 flex flex-col justify-center items-center text-center space-y-8">
            <div className="relative">
              <h1 className="text-6xl md:text-8xl font-black uppercase mb-4 leading-none">
                <GlitchText className="text-white" intensity="high">What</GlitchText>
                <br />
                <GlitchText className="text-cyan-400" color="cyan" intensity="high">If?</GlitchText>
              </h1>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 transform rotate-45" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 transform rotate-45" />
            </div>

            <HologramCard className="max-w-md">
              <p className="text-lg font-bold uppercase tracking-wide leading-tight">
                <GlitchText intensity="low">
                  Generate Alternative Scenarios with AI Power
                </GlitchText>
              </p>
            </HologramCard>

            <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
              <HologramCard variant="default" className="p-4 text-center">
                <Zap className="w-6 h-6 mx-auto mb-2" />
                <span className="text-xs font-bold uppercase">Fast</span>
              </HologramCard>
              <HologramCard variant="energy" className="p-4 text-center">
                <Stars className="w-6 h-6 mx-auto mb-2" />
                <span className="text-xs font-bold uppercase">Creative</span>
              </HologramCard>
              <HologramCard variant="neural" className="p-4 text-center">
                <Sparkles className="w-6 h-6 mx-auto mb-2" />
                <span className="text-xs font-bold uppercase">Free</span>
              </HologramCard>
            </div>
          </div>

          {/* Правая колонка - Пользовательские действия и информация */}
          <div className="lg:col-span-1 space-y-8">
            {isAuthenticated ? (
              <>
                <HologramCard variant="energy" glowIntensity="high">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-4">
                      <User className="w-8 h-8 text-black" />
                    </div>
                    <GlitchText className="text-3xl font-black uppercase mb-2" color="green">
                      Profile
                    </GlitchText>
                    <p className="text-green-400 uppercase text-sm tracking-wider truncate">{user?.email}</p>
                  </div>
                  <div className="space-y-3">
                    <EnergyButton variant="primary" className="w-full">
                      <Link href="/profile" className="flex items-center justify-center gap-2">
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                    </EnergyButton>
                    <EnergyButton
                      variant="danger"
                      className="w-full"
                      onClick={() => signOut()}
                    >
                      <LogIn className="w-4 h-4" />
                      Logout
                    </EnergyButton>
                  </div>
                </HologramCard>

                <HologramCard variant="neural" glowIntensity="medium">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4">
                      <History className="w-8 h-8 text-black" />
                    </div>
                    <GlitchText className="text-3xl font-black uppercase mb-2" color="purple">
                      History
                    </GlitchText>
                    <p className="text-yellow-400 uppercase text-sm tracking-wider">Your Scenarios</p>
                  </div>
                  <EnergyButton variant="secondary" className="w-full">
                    <Link href="/history" className="flex items-center justify-center gap-2">
                      <History className="w-4 h-4" />
                      View History →
                    </Link>
                  </EnergyButton>
                </HologramCard>
              </>
            ) : (
              <HologramCard variant="default" glowIntensity="high">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mb-4">
                    <LogIn className="w-8 h-8 text-black" />
                  </div>
                  <GlitchText className="text-3xl font-black uppercase mb-2" color="cyan">
                    Login
                  </GlitchText>
                  <p className="text-red-400 uppercase text-sm tracking-wider">Access Account</p>
                </div>
                <div className="space-y-4">
                  <EnergyButton variant="primary" className="w-full">
                    <Link href="/auth" className="flex items-center justify-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Login / Register →
                    </Link>
                  </EnergyButton>
                  <HologramCard className="p-4">
                    <p className="text-gray-400 text-sm uppercase font-bold mb-2">Guest Mode</p>
                    <p className="text-xs text-gray-500">Use without registration (no saving)</p>
                  </HologramCard>
                </div>
              </HologramCard>
            )}

            <HologramCard variant="neural" glowIntensity="medium">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-4">
                  <Settings className="w-8 h-8 text-black" />
                </div>
                <GlitchText className="text-3xl font-black uppercase mb-2" color="purple">
                  Docs
                </GlitchText>
                <p className="text-purple-400 uppercase text-sm tracking-wider">How To Use</p>
              </div>
              <EnergyButton variant="secondary" className="w-full">
                <Link href="/docs/HOW_TO_USE.docx" target="_blank" className="flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Read Guide →
                </Link>
              </EnergyButton>
            </HologramCard>

            <HologramCard variant="default" glowIntensity="high">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-black" />
                </div>
                <GlitchText className="text-3xl font-black uppercase mb-2" color="pink">
                  Chat
                </GlitchText>
                <p className="text-orange-400 uppercase text-sm tracking-wider">AI Assistant</p>
              </div>
              <EnergyButton variant="primary" className="w-full">
                <Link href="/chat" className="flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Start Chat →
                </Link>
              </EnergyButton>
            </HologramCard>
          </div>
        </div>
      </main>

      {/* Официальный футер */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-950/95 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Footer Section 1 - About */}
            <HologramCard variant="default">
              <GlitchText className="text-xl font-semibold uppercase mb-4" color="cyan">
                About
              </GlitchText>
              <p className="text-sm font-mono leading-relaxed mb-4 text-slate-400">
                What If Device - это мощный генератор альтернативных сценариев, использующий передовые технологии ИИ для создания уникального контента.
              </p>
              <div className="flex space-x-2">
                <div className="w-4 h-4 bg-blue-700 rounded-sm" />
                <div className="w-4 h-4 bg-slate-600 rounded-sm" />
                <div className="w-4 h-4 bg-indigo-700 rounded-sm" />
              </div>
            </HologramCard>

            {/* Footer Section 2 - Features */}
            <HologramCard variant="energy">
              <GlitchText className="text-xl font-semibold uppercase mb-4" color="pink">
                Features
              </GlitchText>
              <ul className="space-y-2 text-sm font-mono text-slate-400">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-slate-500 rounded-full" />
                  <span>AI-Powered Generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-slate-500 rounded-full" />
                  <span>64 Ready Templates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-slate-500 rounded-full" />
                  <span>Interactive Chat</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-slate-500 rounded-full" />
                  <span>Dark/Light Themes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-slate-500 rounded-full" />
                  <span>Responsive Design</span>
                </li>
              </ul>
            </HologramCard>

            {/* Footer Section 3 - Tech Stack */}
            <HologramCard variant="neural">
              <GlitchText className="text-xl font-semibold uppercase mb-4" color="green">
                Tech Stack
              </GlitchText>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-800 text-slate-300 p-2 text-center font-medium border border-slate-700 rounded">Next.js 14</div>
                <div className="bg-slate-800 text-slate-300 p-2 text-center font-medium border border-slate-700 rounded">TypeScript</div>
                <div className="bg-slate-800 text-slate-300 p-2 text-center font-medium border border-slate-700 rounded">Tailwind</div>
                <div className="bg-slate-800 text-slate-300 p-2 text-center font-medium border border-slate-700 rounded">Supabase</div>
                <div className="bg-slate-800 text-slate-300 p-2 text-center font-medium border border-slate-700 rounded">Hugging Face</div>
                <div className="bg-slate-800 text-slate-300 p-2 text-center font-medium border border-slate-700 rounded">Vercel</div>
              </div>
            </HologramCard>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <AIBrainVisualization size="sm" />
              <GlitchText className="font-semibold uppercase">
                What If Device © 2026
              </GlitchText>
            </div>
            <div className="flex space-x-4 text-sm font-mono">
              <span className="text-slate-500">Made with</span>
              <span className="text-red-400">❤️</span>
              <span className="text-slate-500">and</span>
              <GlitchText color="cyan">AI</GlitchText>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
