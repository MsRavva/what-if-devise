"use client"

interface DataStreamProps {
  direction?: 'horizontal' | 'vertical'
  speed?: 'slow' | 'medium' | 'fast'
  density?: 'low' | 'medium' | 'high'
  color?: 'cyan' | 'green' | 'purple' | 'pink'
}

export const DataStream = ({
  direction = 'horizontal',
  speed = 'medium',
  density = 'medium',
  color = 'cyan'
}: DataStreamProps) => {
  const colors = {
    cyan: 'text-cyan-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400'
  }
  
  const speeds = {
    slow: '20s',
    medium: '10s', 
    fast: '5s'
  }
  
  const densities = {
    low: 20,
    medium: 40,
    high: 60
  }
  
  const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
  
  return (
    <div className={`
      absolute inset-0 overflow-hidden pointer-events-none
      ${direction === 'vertical' ? 'flex flex-col' : 'flex flex-row'}
    `}>
      {Array.from({ length: densities[density] }).map((_, i) => (
        <div
          key={i}
          className={`
            ${colors[color]}
            font-mono text-xs opacity-30
            animate-neural-flow
            ${direction === 'vertical' ? 'writing-mode-vertical' : ''}
          `}
          style={{
            animationDuration: speeds[speed],
            animationDelay: `${i * 0.1}s`,
            [direction === 'vertical' ? 'left' : 'top']: `${(i / densities[density]) * 100}%`
          }}
        >
          {Array.from({ length: 20 }).map((_, j) => (
            <span key={j} className="animate-quantum-flicker" style={{ animationDelay: `${j * 0.05}s` }}>
              {characters[Math.floor(Math.random() * characters.length)]}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}