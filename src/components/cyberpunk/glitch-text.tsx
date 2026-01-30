"use client"

import { ReactNode } from 'react'

interface GlitchTextProps {
  children: ReactNode
  className?: string
  intensity?: 'low' | 'medium' | 'high'
  color?: 'cyan' | 'pink' | 'green' | 'purple' | 'yellow'
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
    purple: 'text-purple-400',
    yellow: 'text-yellow-400'
  }

  return (
    <span
      className={`
        ${colors[color]}
        font-mono font-bold
        relative inline-block
        ${className}
      `}
    >
      {children}
    </span>
  )
}