"use client"

import { ReactNode } from 'react'

interface EnergyButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export const EnergyButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button'
}: EnergyButtonProps) => {
  const variants = {
    primary: 'border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 hover:text-cyan-100',
    secondary: 'border-purple-400 text-purple-400 hover:bg-purple-400/20 hover:text-purple-100',
    danger: 'border-red-400 text-red-400 hover:bg-red-400/20 hover:text-red-100'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        energy-button
        ${variants[variant]}
        ${sizes[size]}
        font-mono font-bold uppercase tracking-wider
        rounded-lg
        relative overflow-hidden
        transition-all duration-300
        hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        gpu-accelerated
        ${className}
      `}
    >
      {/* Энергетическое поле */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current/10 to-transparent animate-energy-flow opacity-0 hover:opacity-100 transition-opacity duration-300" />

      {/* Квантовые частицы */}
      <div className="absolute inset-0 neural-particles opacity-30" />

      {/* Контент */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {/* Голографические углы */}
      <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-current opacity-50" />
      <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-current opacity-50" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-current opacity-50" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-current opacity-50" />
    </button>
  )
}