"use client"

interface QuantumLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'energy' | 'neural'
}

export const QuantumLoader = ({ 
  size = 'md',
  variant = 'default'
}: QuantumLoaderProps) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }
  
  const variants = {
    default: 'border-cyan-400',
    energy: 'border-green-400',
    neural: 'border-purple-400'
  }

  return (
    <div className="flex items-center justify-center">
      <div className={`quantum-loader ${sizes[size]} gpu-accelerated`}>
        {/* Внешнее кольцо */}
        <div className={`absolute inset-0 border-2 border-transparent border-t-2 ${variants[variant]} rounded-full animate-quantum-spin`} />
        
        {/* Среднее кольцо */}
        <div className={`absolute inset-2 border-2 border-transparent border-t-2 border-pink-400 rounded-full animate-quantum-spin`} 
             style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        
        {/* Внутреннее кольцо */}
        <div className={`absolute inset-4 border-2 border-transparent border-t-2 border-yellow-400 rounded-full animate-quantum-spin`}
             style={{ animationDuration: '0.6s' }} />
        
        {/* Центральная точка */}
        <div className="absolute inset-1/2 w-2 h-2 bg-white rounded-full animate-quantum-flicker transform -translate-x-1/2 -translate-y-1/2" />
        
        {/* Энергетические импульсы */}
        <div className="absolute inset-0 border-2 border-transparent animate-pulse-glow rounded-full" />
      </div>
    </div>
  )
}