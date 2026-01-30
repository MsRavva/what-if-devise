"use client"

import { ReactNode } from 'react'

interface GlitchTextProps {
  children: ReactNode
  className?: string
  intensity?: 'low' | 'medium' | 'high'
  color?: 'cyan' | 'pink' | 'green' | 'purple'
}

export const GlitchText = ({ 
  children, 
  className = '',
  intensity = 'medium',
  color = 'cyan'
}: GlitchTextProps) => {
  const colors = {
    cyan: 'text-cyan-400',
    pink: 'text-pink-400', 
    green: 'text-green-400',
    purple: 'text-purple-400'
  }
  
  const intensities = {
    low: 'animate-glitch',
    medium: 'animate-glitch hover:animate-quantum-flicker',
    high: 'animate-glitch animate-quantum-flicker'
  }

  return (
    <span 
      className={`
        glitch-text 
        ${colors[color]}
        ${intensities[intensity]}
        font-mono font-bold
        relative inline-block
        gpu-accelerated
        ${className}
      `}
      data-text={typeof children === 'string' ? children : ''}
    >
      {children}
    </span>
  )
}