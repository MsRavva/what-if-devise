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
    primary: 'border-blue-700 text-blue-400 hover:bg-blue-900/40 hover:border-blue-600',
    secondary: 'border-slate-600 text-slate-300 hover:bg-slate-800/40 hover:border-slate-500',
    danger: 'border-red-800 text-red-400 hover:bg-red-900/30 hover:border-red-700'
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
        font-mono font-medium uppercase tracking-wider
        rounded-md
        relative overflow-hidden
        transition-all duration-200
        hover:translate-y-[-1px]
        active:translate-y-[1px]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {/* Контент */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {/* Тонкие угловые акценты */}
      <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-current opacity-30" />
      <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-current opacity-30" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-current opacity-30" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-current opacity-30" />
    </button>
  )
}
