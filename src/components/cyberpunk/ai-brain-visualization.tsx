"use client"

import { Brain } from 'lucide-react'

interface AIBrainVisualizationProps {
  size?: 'sm' | 'md' | 'lg'
  isActive?: boolean
}

export const AIBrainVisualization = ({ 
  size = 'md', 
  isActive = true 
}: AIBrainVisualizationProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32', 
    lg: 'w-48 h-48'
  }
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`relative ${sizeClasses[size]} mx-auto gpu-accelerated`}>
      {/* Центральное ядро */}
      <div className="absolute inset-4 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full animate-data-pulse">
        <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
          <Brain className={`${iconSizes[size]} text-cyan-400 ${isActive ? 'animate-quantum-spin' : ''}`} />
        </div>
      </div>
      
      {/* Орбитальные кольца */}
      {[...Array(3)].map((_, i) => (
        <div 
          key={i}
          className={`absolute inset-0 border-2 border-cyan-400/30 rounded-full ${isActive ? 'animate-quantum-spin' : ''}`}
          style={{
            animationDuration: `${3 + i}s`,
            animationDirection: i % 2 ? 'reverse' : 'normal'
          }}
        >
          <div className="absolute -top-1 left-1/2 w-2 h-2 bg-cyan-400 rounded-full transform -translate-x-1/2 animate-quantum-flicker" />
        </div>
      ))}
      
      {/* Энергетические импульсы */}
      <div className="absolute inset-0 animate-pulse-glow">
        <div className="w-full h-full border-4 border-purple-400/20 rounded-full" />
      </div>
      
      {/* Нейронные частицы */}
      <div className="absolute inset-0 neural-particles opacity-60" />
    </div>
  )
}