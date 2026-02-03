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
    cyan: 'text-blue-400',
    pink: 'text-slate-300',
    green: 'text-emerald-500',
    purple: 'text-indigo-400',
    yellow: 'text-amber-500'
  }

  return (
    <span
      className={`
        ${colors[color]}
        font-mono font-semibold
        relative inline-block
        ${className}
      `}
    >
      {children}
    </span>
  )
}
