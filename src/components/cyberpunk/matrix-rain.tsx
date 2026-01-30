"use client"

import { useEffect, useRef } from 'react'

interface MatrixRainProps {
  intensity?: 'low' | 'medium' | 'high'
  color?: 'green' | 'cyan' | 'purple'
  speed?: 'slow' | 'medium' | 'fast'
}

export const MatrixRain = ({
  intensity = 'medium',
  color = 'green',
  speed = 'medium'
}: MatrixRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Настройки
    const intensityMap = { low: 0.3, medium: 0.6, high: 1.0 }
    const speedMap = { slow: 50, medium: 100, fast: 200 }
    const colorMap = {
      green: '#00ff41',
      cyan: '#00ffff', 
      purple: '#bf00ff'
    }
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops: number[] = []
    
    // Инициализация капель
    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }
    
    const characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01'
    
    function draw() {
      if (!ctx || !canvas) return
      
      // Полупрозрачный фон для эффекта следа
      ctx.fillStyle = `rgba(0, 0, 0, ${0.05 * intensityMap[intensity]})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = colorMap[color]
      ctx.font = `${fontSize}px monospace`
      
      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }
    
    const interval = setInterval(draw, speedMap[speed])
    
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [intensity, color, speed])
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-20"
      style={{ zIndex: -1 }}
    />
  )
}