'use client';

import React from 'react';
import { MapPin, Lock, Navigation } from 'lucide-react';
import { horrorWorldMap, MapNode, HorrorGameState } from '@/lib/horror-game';

interface HorrorMapProps {
  gameState: HorrorGameState;
  locations: Record<string, { visited: boolean; exits: { direction: string; targetLocationId: string }[] }>;
}

export function HorrorMap({ gameState, locations }: HorrorMapProps) {
  const width = 350;
  const height = 400;
  
  const scaleX = (x: number) => (x / 100) * width;
  const scaleY = (y: number) => (y / 100) * height;
  
  const isVisited = (id: string) => gameState.visitedLocations.includes(id);
  const isCurrent = (id: string) => id === gameState.currentLocationId;
  
  const getNodeColor = (node: MapNode) => {
    if (isCurrent(node.id)) return '#dc2626';
    if (isVisited(node.id)) {
      switch (node.type) {
        case 'exit': return '#16a34a';
        case 'secret': return '#d97706';
        case 'danger': return '#991b1b';
        default: return '#78716c';
      }
    }
    return '#374151';
  };
  
  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    const drawn = new Set<string>();
    
    horrorWorldMap.forEach(node => {
      const loc = locations[node.id];
      if (!loc) return;
      
      loc.exits?.forEach(exit => {
        const target = horrorWorldMap.find(n => n.id === exit.targetLocationId);
        if (!target) return;
        
        const connectionKey = [node.id, exit.targetLocationId].sort().join('-');
        if (drawn.has(connectionKey)) return;
        drawn.add(connectionKey);
        
        const showConnection = 
          (isVisited(node.id) && isVisited(exit.targetLocationId)) ||
          (isCurrent(node.id) && isVisited(exit.targetLocationId)) ||
          (isVisited(node.id) && isCurrent(exit.targetLocationId));
        
        if (showConnection) {
          connections.push(
            <line
              key={connectionKey}
              x1={scaleX(node.x)}
              y1={scaleY(node.y)}
              x2={scaleX(target.x)}
              y2={scaleY(target.y)}
              stroke="#4b5563"
              strokeWidth={1}
              strokeDasharray="4,4"
            />
          );
        }
      });
    });
    
    return connections;
  };
  
  // Показываем карту только если есть свет
  const hasLight = gameState.isDaytime || gameState.hasLight;
  
  return (
    <div className="bg-slate-900 border border-red-900/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-red-400 flex items-center gap-2 text-sm">
          <Navigation className="w-4 h-4" />
          План здания
        </h3>
        <span className="text-xs text-slate-400">
          {gameState.visitedLocations.length} / {horrorWorldMap.length}
        </span>
      </div>
      
      <div className="relative bg-slate-950 rounded-lg overflow-hidden border border-slate-800" style={{ width, height }}>
        {!hasLight && (
          <div className="absolute inset-0 bg-black z-10 flex items-center justify-center">
            <p className="text-slate-600 text-sm">Слишком темно для карты...</p>
          </div>
        )}
        
        <svg width={width} height={height} className="absolute inset-0">
          {renderConnections()}
          
          {horrorWorldMap.map(node => {
            const visited = isVisited(node.id);
            const current = isCurrent(node.id);
            
            if (!hasLight && !visited && !current) return null;
            
            return (
              <g key={node.id}>
                <circle
                  cx={scaleX(node.x)}
                  cy={scaleY(node.y)}
                  r={current ? 8 : 6}
                  fill={getNodeColor(node)}
                  stroke={current ? '#fbbf24' : '#1f2937'}
                  strokeWidth={current ? 3 : 2}
                />
                
                {current && (
                  <foreignObject x={scaleX(node.x) - 6} y={scaleY(node.y) - 6} width={12} height={12}>
                    <div className="flex items-center justify-center h-full">
                      <MapPin className="w-3 h-3 text-white" />
                    </div>
                  </foreignObject>
                )}
                
                {visited && (
                  <text x={scaleX(node.x)} y={scaleY(node.y) + 18} textAnchor="middle" className="text-[8px] fill-slate-400 font-sans">
                    {node.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        
        <div className="absolute bottom-2 left-2 bg-slate-900/90 rounded p-2 text-[10px] space-y-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#78716c]" />
            <span className="text-slate-400">Комната</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#d97706]" />
            <span className="text-slate-400">Секрет</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#16a34a]" />
            <span className="text-slate-400">Выход</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#991b1b]" />
            <span className="text-slate-400">Опасно</span>
          </div>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Исследовано</span>
          <span>{Math.round((gameState.visitedLocations.length / horrorWorldMap.length) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${(gameState.visitedLocations.length / horrorWorldMap.length) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
