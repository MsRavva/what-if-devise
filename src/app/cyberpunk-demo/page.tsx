"use client"

import { useState } from 'react'
import {
  AIBrainVisualization,
  HologramCard,
  EnergyButton,
  GlitchText,
  NeuralProgressBar,
  QuantumLoader,
  NeuralInput,
  DataStream,
  EnergyOrb,
  MatrixRain
} from '@/components/cyberpunk'
import { Zap, Brain, Cpu, Sparkles } from 'lucide-react'

export default function CyberpunkDemo() {
  const [progress, setProgress] = useState(65)
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Matrix Rain Background */}
      <MatrixRain intensity="low" color="green" speed="medium" />

      {/* Data Streams */}
      <DataStream direction="horizontal" speed="fast" density="low" color="cyan" />
      <DataStream direction="vertical" speed="medium" density="low" color="purple" />

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <GlitchText className="text-6xl font-black mb-4" intensity="high">
            CYBERPUNK DEMO
          </GlitchText>
          <p className="text-cyan-400 font-mono">Демонстрация всех киберпанк компонентов</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">

          {/* AI Brain Visualization */}
          <HologramCard variant="default" glowIntensity="high">
            <div className="text-center">
              <GlitchText className="text-2xl font-bold mb-4" color="cyan">
                AI Brain
              </GlitchText>
              <AIBrainVisualization size="lg" isActive={true} />
              <p className="text-sm text-gray-400 mt-4">Анимированный AI-мозг с орбитальными кольцами</p>
            </div>
          </HologramCard>

          {/* Energy Buttons */}
          <HologramCard variant="energy" glowIntensity="medium">
            <GlitchText className="text-2xl font-bold mb-4" color="green">
              Energy Buttons
            </GlitchText>
            <div className="space-y-4">
              <EnergyButton variant="primary" className="w-full">
                <Zap className="w-4 h-4" />
                Primary Button
              </EnergyButton>
              <EnergyButton variant="secondary" className="w-full">
                <Brain className="w-4 h-4" />
                Secondary Button
              </EnergyButton>
              <EnergyButton variant="danger" className="w-full">
                <Cpu className="w-4 h-4" />
                Danger Button
              </EnergyButton>
            </div>
          </HologramCard>

          {/* Neural Progress Bars */}
          <HologramCard variant="neural" glowIntensity="high">
            <GlitchText className="text-2xl font-bold mb-4" color="purple">
              Neural Progress
            </GlitchText>
            <div className="space-y-6">
              <NeuralProgressBar
                progress={progress}
                label="AI Processing"
                variant="default"
              />
              <NeuralProgressBar
                progress={85}
                label="Energy Level"
                variant="energy"
              />
              <NeuralProgressBar
                progress={42}
                label="Quantum State"
                variant="quantum"
              />
              <div className="flex gap-2">
                <EnergyButton
                  size="sm"
                  onClick={() => setProgress(Math.max(0, progress - 10))}
                >
                  -10%
                </EnergyButton>
                <EnergyButton
                  size="sm"
                  onClick={() => setProgress(Math.min(100, progress + 10))}
                >
                  +10%
                </EnergyButton>
              </div>
            </div>
          </HologramCard>

          {/* Quantum Loaders */}
          <HologramCard variant="default" glowIntensity="medium">
            <GlitchText className="text-2xl font-bold mb-4" color="cyan">
              Quantum Loaders
            </GlitchText>
            <div className="flex justify-around items-center">
              <div className="text-center">
                <QuantumLoader size="sm" variant="default" />
                <p className="text-xs mt-2">Small</p>
              </div>
              <div className="text-center">
                <QuantumLoader size="md" variant="energy" />
                <p className="text-xs mt-2">Medium</p>
              </div>
              <div className="text-center">
                <QuantumLoader size="lg" variant="neural" />
                <p className="text-xs mt-2">Large</p>
              </div>
            </div>
          </HologramCard>

          {/* Neural Input */}
          <HologramCard variant="energy" glowIntensity="high">
            <GlitchText className="text-2xl font-bold mb-4" color="green">
              Neural Input
            </GlitchText>
            <div className="space-y-4">
              <NeuralInput
                placeholder="Default neural input..."
                variant="default"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <NeuralInput
                placeholder="Energy neural input..."
                variant="energy"
              />
              <NeuralInput
                placeholder="Quantum neural input..."
                variant="quantum"
              />
            </div>
          </HologramCard>

          {/* Energy Orbs */}
          <HologramCard variant="neural" glowIntensity="medium">
            <GlitchText className="text-2xl font-bold mb-4" color="purple">
              Energy Orbs
            </GlitchText>
            <div className="grid grid-cols-2 gap-4 items-center justify-items-center">
              <div className="text-center">
                <EnergyOrb size="sm" color="cyan" intensity="high" />
                <p className="text-xs mt-2">Cyan</p>
              </div>
              <div className="text-center">
                <EnergyOrb size="md" color="purple" intensity="medium" />
                <p className="text-xs mt-2">Purple</p>
              </div>
              <div className="text-center">
                <EnergyOrb size="md" color="green" intensity="high" />
                <p className="text-xs mt-2">Green</p>
              </div>
              <div className="text-center">
                <EnergyOrb size="sm" color="pink" intensity="low" />
                <p className="text-xs mt-2">Pink</p>
              </div>
            </div>
          </HologramCard>

          {/* Glitch Text Showcase */}
          <HologramCard variant="default" className="lg:col-span-2 xl:col-span-3">
            <div className="text-center">
              <GlitchText className="text-4xl font-black mb-8" intensity="high">
                GLITCH TEXT SHOWCASE
              </GlitchText>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <GlitchText className="text-2xl font-bold" color="cyan" intensity="low">
                    CYAN LOW
                  </GlitchText>
                </div>
                <div className="text-center">
                  <GlitchText className="text-2xl font-bold" color="pink" intensity="medium">
                    PINK MEDIUM
                  </GlitchText>
                </div>
                <div className="text-center">
                  <GlitchText className="text-2xl font-bold" color="green" intensity="high">
                    GREEN HIGH
                  </GlitchText>
                </div>
                <div className="text-center">
                  <GlitchText className="text-2xl font-bold" color="purple" intensity="high">
                    PURPLE HIGH
                  </GlitchText>
                </div>
              </div>
            </div>
          </HologramCard>

        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <EnergyButton variant="primary" size="lg" href="/">
            <Sparkles className="w-5 h-5" />
            Вернуться на главную
          </EnergyButton>
        </div>
      </div>
    </div>
  )
}