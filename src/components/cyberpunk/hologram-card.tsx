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
  const glowLevels = {
    low: 'hover:shadow-soft',
    medium: 'hover:shadow-card',
    high: 'hover:shadow-card hover:-translate-y-1'
  }

  return (
    <div className={`
      hologram-card 
      ${glowLevels[glowIntensity]}
      rounded-lg p-6 
      backdrop-blur-sm 
      border border-border/60
      bg-card/50
      transition-all duration-500
      relative
      ${className}
    `}>
      {/* Тонкая верхняя граница */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Элегантные угловые акценты */}
      <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-primary/20" />
      <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-primary/20" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-primary/20" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-primary/20" />

      {/* Контент */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
