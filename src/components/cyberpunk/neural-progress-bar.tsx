"use client"

interface NeuralProgressBarProps {
  progress: number
  label?: string
  showPercentage?: boolean
  variant?: 'default' | 'energy' | 'quantum'
}

export const NeuralProgressBar = ({ 
  progress, 
  label,
  showPercentage = true,
  variant = 'default'
}: NeuralProgressBarProps) => {
  const variants = {
    default: 'from-cyan-400 via-purple-500 to-pink-500',
    energy: 'from-green-400 via-yellow-500 to-red-500',
    quantum: 'from-blue-400 via-indigo-500 to-purple-600'
  }

  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex justify-between items-center text-sm font-mono">
          <span className="text-cyan-400 uppercase tracking-wider">{label}</span>
          {showPercentage && (
            <span className="text-white font-bold">{Math.round(progress)}%</span>
          )}
        </div>
      )}
      
      <div className="relative w-full h-4 bg-black/50 rounded-full overflow-hidden border border-cyan-400/30 neural-particles">
        {/* Основной прогресс */}
        <div 
          className={`h-full bg-gradient-to-r ${variants[variant]} transition-all duration-500 ease-out relative overflow-hidden`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        >
          {/* Энергетический поток */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-energy-flow" />
        </div>
        
        {/* Нейронные импульсы */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-hologram opacity-50" />
        
        {/* Частицы данных */}
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute top-1/2 w-1 h-1 bg-white rounded-full animate-bounce-subtle"
            style={{
              left: `${20 * i}%`,
              animationDelay: `${i * 0.2}s`,
              transform: 'translateY(-50%)'
            }}
          />
        ))}
        
        {/* Квантовое свечение на краю */}
        {progress > 0 && (
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white animate-quantum-flicker"
            style={{ left: `${Math.min(progress, 100)}%` }}
          />
        )}
      </div>
    </div>
  )
}