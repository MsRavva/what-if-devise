"use client"

interface EnergyOrbProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'cyan' | 'purple' | 'green' | 'pink'
  intensity?: 'low' | 'medium' | 'high'
  pulsing?: boolean
}

export const EnergyOrb = ({
  size = 'md',
  color = 'cyan',
  intensity = 'medium',
  pulsing = true
}: EnergyOrbProps) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }
  
  const colors = {
    cyan: 'from-cyan-400 to-cyan-600',
    purple: 'from-purple-400 to-purple-600',
    green: 'from-green-400 to-green-600',
    pink: 'from-pink-400 to-pink-600'
  }
  
  const intensities = {
    low: 'opacity-60',
    medium: 'opacity-80',
    high: 'opacity-100'
  }

  return (
    <div className={`relative ${sizes[size]} gpu-accelerated`}>
      {/* Основная сфера */}
      <div className={`
        absolute inset-0 rounded-full
        bg-gradient-radial ${colors[color]}
        ${intensities[intensity]}
        ${pulsing ? 'animate-data-pulse' : ''}
      `} />
      
      {/* Внутреннее свечение */}
      <div className={`
        absolute inset-2 rounded-full
        bg-gradient-radial from-white/50 to-transparent
        animate-quantum-flicker
      `} />
      
      {/* Энергетические кольца */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`
            absolute inset-0 rounded-full border-2 border-current
            ${colors[color].includes('cyan') ? 'border-cyan-400/30' : ''}
            ${colors[color].includes('purple') ? 'border-purple-400/30' : ''}
            ${colors[color].includes('green') ? 'border-green-400/30' : ''}
            ${colors[color].includes('pink') ? 'border-pink-400/30' : ''}
            animate-energy-rotate
          `}
          style={{
            animationDuration: `${2 + i}s`,
            animationDirection: i % 2 ? 'reverse' : 'normal',
            transform: `scale(${1 + i * 0.2})`
          }}
        />
      ))}
      
      {/* Частицы вокруг */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-quantum-flicker"
          style={{
            top: '50%',
            left: '50%',
            transform: `
              translate(-50%, -50%) 
              rotate(${i * 45}deg) 
              translateY(-${size === 'sm' ? '20' : size === 'md' ? '32' : '48'}px)
            `,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  )
}