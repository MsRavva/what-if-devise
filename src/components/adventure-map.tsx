'use client';

import React from 'react';
import { MapPin, Lock, Eye, Navigation } from 'lucide-react';
import { worldMap, MapNode } from '@/lib/adventure-game';

interface GameMapProps {
  visitedLocations: string[];
  currentLocationId: string;
  discoveredConnections: string[][];
}

export function GameMap({ visitedLocations, currentLocationId, discoveredConnections }: GameMapProps) {
  // Размеры SVG
  const width = 400;
  const height = 350;
  
  // Масштабирование координат
  const scaleX = (x: number) => (x / 100) * width;
  const scaleY = (y: number) => (y / 100) * height;
  
  // Проверка, открыта ли локация
  const isVisited = (id: string) => visitedLocations.includes(id);
  const isCurrent = (id: string) => id === currentLocationId;
  
  // Проверка, открыто ли соединение между двумя локациями
  const isConnectionDiscovered = (from: string, to: string) => {
    return discoveredConnections.some(
      conn => (conn[0] === from && conn[1] === to) || (conn[0] === to && conn[1] === from)
    );
  };
  
  // Получение цвета для типа локации
  const getNodeColor = (node: MapNode) => {
    if (isCurrent(node.id)) return '#5c4b37'; // Текущая - темно-коричневый
    if (isVisited(node.id)) {
      switch (node.type) {
        case 'secret': return '#d97706'; // Секретная - оранжевый
        case 'entrance': return '#16a34a'; // Вход - зеленый
        case 'outdoor': return '#0891b2'; // На улице - голубой
        default: return '#78716c'; // Комната - серый
      }
    }
    return '#e5e7eb'; // Неоткрытая - светло-серый
  };
  
  // Рендер линий соединений
  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    const drawn = new Set<string>();
    
    worldMap.forEach(node => {
      node.connections.forEach(targetId => {
        const target = worldMap.find(n => n.id === targetId);
        if (!target) return;
        
        // Уникальный ключ для соединения
        const connectionKey = [node.id, targetId].sort().join('-');
        if (drawn.has(connectionKey)) return;
        drawn.add(connectionKey);
        
        // Показываем соединение только если обе локации посещены ИЛИ
        // текущая локация соединена с посещенной
        const showConnection = 
          (isVisited(node.id) && isVisited(targetId)) ||
          (isCurrent(node.id) && isVisited(targetId)) ||
          (isVisited(node.id) && isCurrent(targetId));
        
        if (showConnection) {
          connections.push(
            <line
              key={connectionKey}
              x1={scaleX(node.x)}
              y1={scaleY(node.y)}
              x2={scaleX(target.x)}
              y2={scaleY(target.y)}
              stroke={isConnectionDiscovered(node.id, targetId) ? '#5c4b37' : '#d1d5db'}
              strokeWidth={isConnectionDiscovered(node.id, targetId) ? 2 : 1}
              strokeDasharray={isConnectionDiscovered(node.id, targetId) ? '0' : '4,4'}
              className="transition-all duration-500"
            />
          );
        }
      });
    });
    
    return connections;
  };
  
  return (
    <div className="bg-card border border-primary/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-ink flex items-center gap-2 text-sm">
          <Navigation className="w-4 h-4" />
          Карта мира
        </h3>
        <span className="text-xs text-ink/50">
          {visitedLocations.length} / {worldMap.length} локаций
        </span>
      </div>
      
      <div className="relative bg-primary/5 rounded-lg overflow-hidden" style={{ width, height }}>
        <svg width={width} height={height} className="absolute inset-0">
          {/* Соединения */}
          {renderConnections()}
          
          {/* Локации */}
          {worldMap.map(node => {
            const visited = isVisited(node.id);
            const current = isCurrent(node.id);
            
            return (
              <g key={node.id}>
                {/* Точка локации */}
                <circle
                  cx={scaleX(node.x)}
                  cy={scaleY(node.y)}
                  r={current ? 8 : 6}
                  fill={getNodeColor(node)}
                  stroke={current ? '#f4ecd8' : 'white'}
                  strokeWidth={current ? 3 : 2}
                  className="transition-all duration-300"
                />
                
                {/* Иконка для текущей локации */}
                {current && (
                  <foreignObject
                    x={scaleX(node.x) - 6}
                    y={scaleY(node.y) - 6}
                    width={12}
                    height={12}
                  >
                    <div className="flex items-center justify-center h-full">
                      <MapPin className="w-3 h-3 text-white" />
                    </div>
                  </foreignObject>
                )}
                
                {/* Подпись локации (только для посещенных) */}
                {visited && (
                  <text
                    x={scaleX(node.x)}
                    y={scaleY(node.y) + 18}
                    textAnchor="middle"
                    className="text-[8px] fill-ink/70 font-sans"
                  >
                    {node.label}
                  </text>
                )}
                
                {/* Иконка для секретных локаций */}
                {visited && node.type === 'secret' && (
                  <foreignObject
                    x={scaleX(node.x) + 8}
                    y={scaleY(node.y) - 10}
                    width={12}
                    height={12}
                  >
                    <Lock className="w-3 h-3 text-amber-600" />
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>
        
        {/* Легенда */}
        <div className="absolute bottom-2 left-2 bg-card/90 backdrop-blur-sm rounded p-2 text-[10px] space-y-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#16a34a]" />
            <span className="text-ink/60">Вход</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#78716c]" />
            <span className="text-ink/60">Комната</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#d97706]" />
            <span className="text-ink/60">Секрет</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#0891b2]" />
            <span className="text-ink/60">Улица</span>
          </div>
        </div>
      </div>
      
      {/* Прогресс */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-ink/50 mb-1">
          <span>Исследовано</span>
          <span>{Math.round((visitedLocations.length / worldMap.length) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(visitedLocations.length / worldMap.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
