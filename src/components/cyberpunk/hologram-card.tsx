"use client"

import { ReactNode } from 'react'

interface HologramCardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'energy' | 'neural'
  glowIntensity?: 'low' | 'medium' | 'high'
}

export const HologramCard = ({ 
  children, 
  className = '',
  variant = 'default',
  glowIntensity = 'medium'
}: HologramCardProps) => {
  const variants = {
    default: 'border-cyan-400/30 shadow-cyan-400/20',
    energy: 'border-green-400/30 shadow-green-400/20', 
    neural: 'border-purple-400/30 shadow-purple-400/20'
  }
  
  const glowLevels = {
    low: 'hover:shadow-lg',
    medium: 'hover:shadow-xl hover:shadow-current/30',
    high: 'hover:shadow-2xl hover:shadow-current/50'
  }

  return (
    <div className={`
      hologram-card 
      neural-particles
      magnetic-hover
      ${variants[variant]}
      ${glowLevels[glowIntensity]}
      rounded-lg p-6 
      backdrop-blur-md 
      border 
      transition-all duration-300
      gpu-accelerated
      ${className}
    `}>
      {/* Голографический слой */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-hologram rounded-lg pointer-events-none" />
      
      {/* Энергетические углы */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400/50 animate-quantum-flicker" />
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400/50 animate-quantum-flicker" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400/50 animate-quantum-flicker" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400/50 animate-quantum-flicker" />
      
      {/* Контент */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}