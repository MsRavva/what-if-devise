"use client"

import { useState } from 'react'
import { Zap, Sparkles, Heart, Briefcase, MapPin, Clock } from 'lucide-react'

interface QuickAction {
  id: string
  icon: React.ReactNode
  label: string
  suggestion: string
  category: 'personal' | 'career' | 'relationship' | 'adventure'
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: '1',
    icon: <Heart className="w-4 h-4" />,
    label: 'Отношения',
    suggestion: 'что если бы я сказал то, что думаю на самом деле?',
    category: 'relationship'
  },
  {
    id: '2',
    icon: <Briefcase className="w-4 h-4" />,
    label: 'Карьера',
    suggestion: 'что если бы я выбрал работу мечты вместо стабильности?',
    category: 'career'
  },
  {
    id: '3',
    icon: <MapPin className="w-4 h-4" />,
    label: 'Путешествия',
    suggestion: 'что если бы я решился на спонтанное путешествие?',
    category: 'adventure'
  },
  {
    id: '4',
    icon: <Sparkles className="w-4 h-4" />,
    label: 'Мечты',
    suggestion: 'что если бы я поверил в свою самую безумную мечту?',
    category: 'personal'
  },
  {
    id: '5',
    icon: <Clock className="w-4 h-4" />,
    label: 'Прошлое',
    suggestion: 'что если бы я мог изменить одно решение из прошлого?',
    category: 'personal'
  },
  {
    id: '6',
    icon: <Zap className="w-4 h-4" />,
    label: 'Действие',
    suggestion: 'что если бы я действовал импульсивно?',
    category: 'personal'
  }
]

interface QuickActionsProps {
  onSelect: (suggestion: string) => void
  className?: string
}

export function QuickActions({ onSelect, className = '' }: QuickActionsProps) {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null)

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Zap className="w-4 h-4" />
        <span>Быстрые идеи для вопросов:</span>
      </div>
      
      <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => onSelect(action.suggestion)}
            onMouseEnter={() => setHoveredAction(action.id)}
            onMouseLeave={() => setHoveredAction(null)}
            className={`
              group relative p-3 rounded-lg border border-border/50 bg-background/30 
              hover:bg-primary/5 hover:border-primary/30 transition-all duration-300
              text-left space-y-2 overflow-hidden
              ${hoveredAction === action.id ? 'scale-[1.02] shadow-lg' : ''}
            `}
          >
            {/* Анимированный фон */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Иконка и лейбл */}
            <div className="relative z-10 flex items-center space-x-2">
              <div className={`
                p-1 rounded-md transition-colors duration-300
                ${getCategoryColor(action.category)}
              `}>
                {action.icon}
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {action.label}
              </span>
            </div>
            
            {/* Предпросмотр вопроса */}
            {hoveredAction === action.id && (
              <div className="relative z-10 text-xs text-muted-foreground bg-background/80 p-2 rounded border border-border/30 animate-fade-in">
                "{action.suggestion}"
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Подсказка */}
      <div className="text-xs text-muted-foreground/70 flex items-center space-x-1">
        <Sparkles className="w-3 h-3" />
        <span>Наведите курсор для предпросмотра вопроса</span>
      </div>
    </div>
  )
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'relationship':
      return 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
    case 'career':
      return 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
    case 'adventure':
      return 'bg-green-500/20 text-green-600 dark:text-green-400'
    case 'personal':
      return 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
    default:
      return 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
  }
}