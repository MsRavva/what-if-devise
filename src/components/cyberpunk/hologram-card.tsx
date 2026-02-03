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
    default: 'border-slate-700/50',
    energy: 'border-slate-600/50',
    neural: 'border-slate-600/50'
  }

  const glowLevels = {
    low: 'hover:shadow-md',
    medium: 'hover:shadow-lg',
    high: 'hover:shadow-xl'
  }

  return (
    <div className={`
      hologram-card 
      ${variants[variant]}
      ${glowLevels[glowIntensity]}
      rounded-lg p-6 
      backdrop-blur-sm 
      border 
      bg-slate-900/60
      transition-all duration-200
      ${className}
    `}>
      {/* Тонкая верхняя граница */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-600/30 to-transparent" />

      {/* Угловые акценты */}
      <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-slate-600/40" />
      <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-slate-600/40" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-slate-600/40" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-slate-600/40" />

      {/* Контент */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
