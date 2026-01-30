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
  Zap
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
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden neural-particles">
      {/* Киберпанк фон с улучшенными эффектами */}
      <div className="absolute inset-0">
        {/* Голографические геометрические фигуры */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 transform rotate-45 opacity-20 animate-hologram" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-400 to-red-500 transform -rotate-12 opacity-30 animate-energy-flow" />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-green-400 to-emerald-500 transform rotate-12 opacity-15 animate-quantum-flicker" />
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-gradient-to-br from-yellow-400 to-orange-500 transform -rotate-45 opacity-25 animate-data-pulse" />
        
        {/* Нейронная сетка */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border border-cyan-400/30 animate-quantum-flicker" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
        
        {/* Энергетические потоки */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-energy-flow" />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-pink-400/50 to-transparent animate-energy-flow" style={{ animationDirection: 'reverse' }} />
      </div>

      {/* Киберпанк хедер с голографическими эффектами */}
      <header className="relative z-20 border-b-4 border-cyan-400 bg-black/90 backdrop-blur-sm hologram-card">
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
                <p className="text-xs text-cyan-400 uppercase tracking-widest animate-quantum-flicker">AI Scenario Generator</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="flex items-center space-x-2 bg-green-500 px-3 py-1 text-black font-bold text-sm uppercase animate-data-pulse">
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
          <nav className="border-t-2 border-cyan-400/50 pt-4">
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
                <p className="text-cyan-400 uppercase text-sm tracking-wider animate-quantum-flicker">Generate New Scenario</p>
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
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center mb-4 animate-data-pulse">
                  <BookOpen className="w-8 h-8 text-black" />
                </div>
                <GlitchText className="text-3xl font-black uppercase mb-2" color="pink">
                  Templates
                </GlitchText>
                <p className="text-pink-400 uppercase text-sm tracking-wider animate-quantum-flicker">64 Ready Examples</p>
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
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 transform rotate-45 animate-quantum-flicker" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 transform rotate-45 animate-data-pulse" />
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
                <Zap className="w-6 h-6 mx-auto mb-2 animate-energy-flow" />
                <span className="text-xs font-bold uppercase">Fast</span>
              </HologramCard>
              <HologramCard variant="energy" className="p-4 text-center">
                <Stars className="w-6 h-6 mx-auto mb-2 animate-quantum-flicker" />
                <span className="text-xs font-bold uppercase">Creative</span>
              </HologramCard>
              <HologramCard variant="neural" className="p-4 text-center">
                <Sparkles className="w-6 h-6 mx-auto mb-2 animate-data-pulse" />
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
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-4 animate-data-pulse">
                      <User className="w-8 h-8 text-black" />
                    </div>
                    <GlitchText className="text-3xl font-black uppercase mb-2" color="green">
                      Profile
                    </GlitchText>
                    <p className="text-green-400 uppercase text-sm tracking-wider truncate animate-quantum-flicker">{user?.email}</p>
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
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4 animate-energy-flow">
                      <History className="w-8 h-8 text-black" />
                    </div>
                    <GlitchText className="text-3xl font-black uppercase mb-2" color="purple">
                      History
                    </GlitchText>
                    <p className="text-yellow-400 uppercase text-sm tracking-wider animate-quantum-flicker">Your Scenarios</p>
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
                  <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mb-4 animate-data-pulse">
                    <LogIn className="w-8 h-8 text-black" />
                  </div>
                  <GlitchText className="text-3xl font-black uppercase mb-2" color="cyan">
                    Login
                  </GlitchText>
                  <p className="text-red-400 uppercase text-sm tracking-wider animate-quantum-flicker">Access Account</p>
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
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-4 animate-quantum-flicker">
                  <Settings className="w-8 h-8 text-black" />
                </div>
                <GlitchText className="text-3xl font-black uppercase mb-2" color="purple">
                  Docs
                </GlitchText>
                <p className="text-purple-400 uppercase text-sm tracking-wider animate-energy-flow">How To Use</p>
              </div>
              <EnergyButton variant="secondary" className="w-full">
                <Link href="/docs/HOW_TO_USE.md" target="_blank" className="flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Read Guide →
                </Link>
              </EnergyButton>
            </HologramCard>
          </div>
        </div>
      </main>

      {/* Киберпанк футер с голографическими секциями */}
      <footer className="relative z-10 border-t-4 border-cyan-400 bg-black/90 backdrop-blur-sm mt-20 neural-particles">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Footer Section 1 - About */}
            <HologramCard variant="default">
              <GlitchText className="text-xl font-black uppercase mb-4" color="cyan">
                About
              </GlitchText>
              <p className="text-sm font-mono leading-relaxed mb-4">
                What If Device - это мощный генератор альтернативных сценариев, использующий передовые технологии ИИ для создания уникального контента.
              </p>
              <div className="flex space-x-2">
                <div className="w-4 h-4 bg-cyan-400 animate-data-pulse" />
                <div className="w-4 h-4 bg-pink-400 animate-quantum-flicker" />
                <div className="w-4 h-4 bg-green-400 animate-energy-flow" />
              </div>
            </HologramCard>

            {/* Footer Section 2 - Features */}
            <HologramCard variant="energy">
              <GlitchText className="text-xl font-black uppercase mb-4" color="pink">
                Features
              </GlitchText>
              <ul className="space-y-2 text-sm font-mono">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-400 animate-quantum-flicker" />
                  <span>AI-Powered Generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-400 animate-data-pulse" />
                  <span>64 Ready Templates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-400 animate-energy-flow" />
                  <span>Interactive Chat</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-400 animate-quantum-flicker" />
                  <span>Dark/Light Themes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-400 animate-hologram" />
                  <span>Responsive Design</span>
                </li>
              </ul>
            </HologramCard>

            {/* Footer Section 3 - Tech Stack */}
            <HologramCard variant="neural">
              <GlitchText className="text-xl font-black uppercase mb-4" color="green">
                Tech Stack
              </GlitchText>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-green-500 text-black p-2 text-center font-bold animate-data-pulse">Next.js 14</div>
                <div className="bg-blue-500 text-black p-2 text-center font-bold animate-quantum-flicker">TypeScript</div>
                <div className="bg-cyan-500 text-black p-2 text-center font-bold animate-energy-flow">Tailwind</div>
                <div className="bg-purple-500 text-black p-2 text-center font-bold animate-hologram">Supabase</div>
                <div className="bg-yellow-500 text-black p-2 text-center font-bold animate-data-pulse">Hugging Face</div>
                <div className="bg-red-500 text-black p-2 text-center font-bold animate-quantum-flicker">Vercel</div>
              </div>
            </HologramCard>
          </div>

          {/* Footer Bottom */}
          <div className="border-t-2 border-cyan-400/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <AIBrainVisualization size="sm" />
              <GlitchText className="font-black uppercase">
                What If Device © 2026
              </GlitchText>
            </div>
            <div className="flex space-x-4 text-sm font-mono">
              <span className="text-gray-400">Made with</span>
              <span className="text-red-400 animate-data-pulse">❤️</span>
              <span className="text-gray-400">and</span>
              <GlitchText className="text-cyan-400" color="cyan">AI</GlitchText>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}