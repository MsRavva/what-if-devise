"use client"

import { forwardRef, InputHTMLAttributes } from 'react'

interface NeuralInputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'energy' | 'quantum'
  glowIntensity?: 'low' | 'medium' | 'high'
}

export const NeuralInput = forwardRef<HTMLInputElement, NeuralInputProps>(
  ({ variant = 'default', glowIntensity = 'medium', className = '', ...props }, ref) => {
    const variants = {
      default: 'border-cyan-400/30 focus:border-cyan-400 focus:shadow-cyan-400/30',
      energy: 'border-green-400/30 focus:border-green-400 focus:shadow-green-400/30',
      quantum: 'border-purple-400/30 focus:border-purple-400 focus:shadow-purple-400/30'
    }
    
    const glowLevels = {
      low: 'focus:shadow-sm',
      medium: 'focus:shadow-lg',
      high: 'focus:shadow-xl'
    }

    return (
      <div className="relative">
        <input
          ref={ref}
          className={`
            neural-input
            w-full px-4 py-3
            bg-black/80 text-white
            font-mono
            rounded-lg
            transition-all duration-300
            placeholder:text-gray-500
            ${variants[variant]}
            ${glowLevels[glowIntensity]}
            ${className}
          `}
          {...props}
        />
        
        {/* Квантовые углы */}
        <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-current opacity-30 animate-quantum-flicker" />
        <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-current opacity-30 animate-quantum-flicker" />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-current opacity-30 animate-quantum-flicker" />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-current opacity-30 animate-quantum-flicker" />
      </div>
    )
  }
)

NeuralInput.displayName = 'NeuralInput'