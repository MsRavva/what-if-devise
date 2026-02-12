"use client"

import { ReactNode } from 'react'
import Link from 'next/link'

interface EnergyButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  href?: string
}

export const EnergyButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  href
}: EnergyButtonProps) => {
  const variants = {
    primary: 'bg-primary text-primary-foreground border-primary hover:bg-primary/90',
    secondary: 'bg-transparent text-primary border-primary/40 hover:bg-primary/5 hover:border-primary',
    danger: 'bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const baseStyles = `
    energy-button
    ${variants[variant]}
    ${sizes[size]}
    font-serif font-medium
    rounded-md
    relative overflow-hidden
    transition-all duration-300
    hover:translate-y-[-2px]
    hover:shadow-soft
    active:translate-y-[0px]
    disabled:opacity-50 disabled:cursor-not-allowed
    inline-flex items-center justify-center gap-2
    ${className}
  `

  const content = (
    <>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {/* Элегантные угловые акценты */}
      <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-current opacity-20" />
      <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-current opacity-20" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-current opacity-20" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-current opacity-20" />
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className={baseStyles}
        onClick={onClick}
        aria-disabled={disabled}
        style={disabled ? { pointerEvents: 'none' } : undefined}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
    >
      {content}
    </button>
  )
}
