'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Compass, 
  Backpack, 
  MapPin, 
  Send, 
  RotateCcw,
  HelpCircle,
  Terminal,
  History,
  Scroll,
  Eye,
  Hand
} from 'lucide-react';
import { GameLogEntry, Location, Item } from '@/types/adventure';
import { 
  createInitialGameState, 
  createInitialLocations, 
  resetLocations,
  currentLocations,
  MapNode,
  worldMap
} from '@/lib/adventure-game';
import { useToast } from '@/components/toast-provider';
import { GameMap } from '@/components/adventure-map';

// Расширенное состояние игры
interface ExtendedGameState {
  currentLocationId: string;
  inventory: Item[];
  visitedLocations: string[];
  gameLog: GameLogEntry[];
  flags: Record<string, boolean>;
  turn: number;
  discoveredConnections: string[][]; // [from, to]
}

// Разбор команд игрока
const parseCommand = (input: string): { verb: string; noun: string; fullText: string } => {
  const normalized = input.toLowerCase().trim();
  const words = normalized.split(/\s+/);
  
  return {
    verb: words[0] || '',
    noun: words.slice(1).join(' ') || '',
    fullText: normalized
  };
};

// Компонент для отображения текста с markdown-разметкой
const FormattedText = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        
        return (
          <div key={i} className={line.startsWith('•') ? 'ml-4' : ''}>
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className="font-bold text-ink">{part.slice(2, -2)}</strong>;
              }
              return <span key={j}>{part}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
};

// Компонент игрового лога
const GameLog = ({ entries }: { entries: GameLogEntry[] }) => {
  const logEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);
  
  const getEntryIcon = (type: GameLogEntry['type']) => {
    switch (type) {
      case 'command': return <Terminal className="w-4 h-4" />;
      case 'location': return <MapPin className="w-4 h-4" />;
      case 'item': return <Hand className="w-4 h-4" />;
      case 'error': return <HelpCircle className="w-4 h-4" />;
      default: return null;
    }
  };
  
  const getEntryStyle = (type: GameLogEntry['type']) => {
    switch (type) {
      case 'command': return 'text-primary/70 italic font-mono';
      case 'location': return 'text-primary';
      case 'item': return 'text-amber-600';
      case 'error': return 'text-red-500';
      case 'system': return 'text-ink/50 text-sm';
      default: return 'text-ink';
    }
  };
  
  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {entries.map((entry, index) => (
        <div 
          key={index} 
          className={`flex items-start gap-2 p-2 rounded ${getEntryStyle(entry.type)} animate-fade-up`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {getEntryIcon(entry.type) && (
            <span className="mt-0.5 opacity-60 flex-shrink-0">{getEntryIcon(entry.type)}</span>
          )}
          <div className="leading-relaxed">
            <FormattedText text={entry.text} />
          </div>
        </div>
      ))}
      <div ref={logEndRef} />
    </div>
  );
};

// Компонент инвентаря
const InventoryPanel = ({ items, isOpen, onToggle }: { 
  items: Item[]; 
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className={`transition-all duration-300 ${isOpen ? 'w-64' : 'w-12'}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={onToggle}
        className="w-12 h-12 rounded-full border-2 border-primary/30 hover:border-primary hover:bg-primary/10"
      >
        <Backpack className={`w-5 h-5 transition-transform ${isOpen ? 'scale-110' : ''}`} />
      </Button>
      
      {isOpen && (
        <Card className="mt-2 animate-fade-up">
          <CardContent className="p-4">
            <h3 className="font-bold text-ink mb-3 flex items-center gap-2">
              <Backpack className="w-4 h-4" />
              Инвентарь ({items.length})
            </h3>
            {items.length === 0 ? (
              <p className="text-sm text-ink/50 italic">Пусто...</p>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-2 bg-primary/5 rounded border border-primary/10 hover:border-primary/30 transition-colors"
                  >
                    <p className="font-medium text-sm text-ink">{item.name}</p>
                    <p className="text-xs text-ink/60">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Компонент справки
const HelpPanel = ({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => {
  if (!isOpen) return null;
  
  const commands = [
    { cmd: 'осмотреться / о', desc: 'Осмотреть текущую локацию' },
    { cmd: 'осмотреть [предмет]', desc: 'Осмотреть конкретный предмет' },
    { cmd: 'идти [направление]', desc: 'Перейти в указанном направлении' },
    { cmd: 'взять [предмет]', desc: 'Взять предмет' },
    { cmd: 'инвентарь / инв', desc: 'Показать инвентарь' },
    { cmd: 'назад', desc: 'Вернуться на предыдущую локацию' },
    { cmd: 'история', desc: 'Показать историю команд' },
    { cmd: 'сброс', desc: 'Начать игру заново' },
    { cmd: 'помощь', desc: 'Показать эту справку' },
  ];
  
  return (
    <Card className="animate-fade-up border-primary/20">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-ink flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Команды
          </h3>
          <Button variant="ghost" size="sm" onClick={onToggle}>✕</Button>
        </div>
        <div className="space-y-2">
          {commands.map((c, i) => (
            <div key={i} className="text-sm">
              <span className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">{c.cmd}</span>
              <span className="text-ink/60 ml-2">— {c.desc}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Получение описания локации
const getLocationDescription = (location: Location, fromLocationId?: string): string => {
  let description = `**${location.name}**\n\n`;
  description += location.detailedDescription || location.description;
  
  // Добавляем информацию о направлении входа
  if (fromLocationId && location.exits) {
    const fromExit = location.exits.find(e => e.targetLocationId === fromLocationId);
    if (fromExit && fromExit.description) {
      description += `\n\n*Вы пришли отсюда: ${fromExit.description}.*`;
    }
  }
  
  // Добавляем информацию о предметах
  if (location.items && location.items.length > 0) {
    description += '\n\n**Вы видите:**';
    location.items.forEach(item => {
      description += `\n• ${item.name}`;
    });
  }
  
  // Добавляем информацию о выходах
  if (location.exits && location.exits.length > 0) {
    description += '\n\n**Выходы:**';
    location.exits.forEach(exit => {
      const direction = exit.direction;
      const locked = exit.locked ? ' (заперто)' : '';
      const desc = exit.description ? ` (${exit.description})` : '';
      description += `\n• ${direction}${locked}${desc}`;
    });
  }
  
  return description;
};

export default function AdventurePage() {
  const [locations, setLocations] = useState<Record<string, Location>>(createInitialLocations());
  const [gameState, setGameState] = useState<ExtendedGameState>(() => {
    const initial = createInitialGameState();
    return {
      ...initial,
      discoveredConnections: [],
    };
  });
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [input, setInput] = useState('');
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [previousLocationId, setPreviousLocationId] = useState<string | null>(null);
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Загрузка сохраненной игры
  useEffect(() => {
    const saved = localStorage.getItem('adventure-game-state-v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.locations) {
          setLocations(parsed.locations);
        }
        if (parsed.gameState) {
          setGameState(parsed.gameState);
        }
        if (parsed.previousLocationId) {
          setPreviousLocationId(parsed.previousLocationId);
        }
      } catch (e) {
        console.error('Failed to load game:', e);
      }
    }
  }, []);
  
  // Автосохранение
  useEffect(() => {
    localStorage.setItem('adventure-game-state-v2', JSON.stringify({
      locations,
      gameState,
      previousLocationId,
    }));
  }, [locations, gameState, previousLocationId]);
  
  // Добавление записи в лог
  const addLogEntry = useCallback((type: GameLogEntry['type'], text: string) => {
    setGameState(prev => ({
      ...prev,
      gameLog: [...prev.gameLog, { type, text, timestamp: Date.now() }]
    }));
  }, []);
  
  // Обработка команды
  const processCommand = useCallback((commandText: string) => {
    const { verb, noun, fullText } = parseCommand(commandText);
    
    if (!verb) return;
    
    addLogEntry('command', `> ${fullText}`);
    setCommandHistory(prev => [...prev, fullText]);
    setHistoryIndex(-1);
    
    const currentLocation = locations[gameState.currentLocationId];
    
    switch (verb) {
      case 'осмотреться':
      case 'о':
      case 'look':
        if (!noun) {
          const desc = getLocationDescription(currentLocation, previousLocationId || undefined);
          addLogEntry('location', desc);
        } else {
          const locationItem = currentLocation.items?.find(i => 
            i.name.toLowerCase().includes(noun) || 
            i.id.toLowerCase().includes(noun)
          );
          
          const inventoryItem = gameState.inventory.find(i => 
            i.name.toLowerCase().includes(noun) || 
            i.id.toLowerCase().includes(noun)
          );
          
          const item = locationItem || inventoryItem;
          
          if (item) {
            addLogEntry('response', `**${item.name}**\n${item.description}`);
          } else {
            addLogEntry('error', `Здесь нет "${noun}".`);
          }
        }
        break;
        
      case 'идти':
      case 'go':
      case 'перейти':
      case 'север':
      case 'юг':
      case 'восток':
      case 'запад':
      case 'вверх':
      case 'вниз':
        // Обработка направлений
        let searchNoun = noun;
        if (['север', 'юг', 'восток', 'запад', 'вверх', 'вниз'].includes(verb)) {
          searchNoun = verb;
        }
        
        if (!searchNoun) {
          addLogEntry('error', 'Куда идти? Например: "идти вперед", "идти на север" или просто "север"');
          break;
        }
        
        // Сопоставление сокращенных направлений
        const directionMap: Record<string, string[]> = {
          'с': ['север'],
          'ю': ['юг'],
          'в': ['восток'],
          'з': ['запад'],
        };
        
        let searchDirections = [searchNoun];
        if (directionMap[searchNoun]) {
          searchDirections = [...searchDirections, ...directionMap[searchNoun]];
        }
        
        const exit = currentLocation.exits?.find(e => 
          searchDirections.some(dir => 
            e.direction.toLowerCase() === dir ||
            e.direction.toLowerCase().startsWith(dir)
          )
        );
        
        if (!exit) {
          addLogEntry('error', `Вы не можете пойти "${searchNoun}". Напишите "осмотреться" чтобы увидеть доступные выходы.`);
          break;
        }
        
        if (exit.locked) {
          if (exit.requiredItem && gameState.inventory.some(i => i.id === exit.requiredItem)) {
            // Разблокируем дверь
            setLocations(prev => ({
              ...prev,
              [gameState.currentLocationId]: {
                ...prev[gameState.currentLocationId],
                exits: prev[gameState.currentLocationId].exits?.map(e => 
                  e.direction === exit.direction ? { ...e, locked: false } : e
                )
              }
            }));
            addLogEntry('item', `Вы использовали ключ и отперли дверь!`);
          } else {
            addLogEntry('error', 'Дверь заперта. Нужен ключ.');
            break;
          }
        }
        
        const newLocation = locations[exit.targetLocationId];
        if (newLocation) {
          // Сохраняем текущую как предыдущую
          setPreviousLocationId(gameState.currentLocationId);
          
          // Добавляем соединение в открытые
          setGameState(prev => ({
            ...prev,
            discoveredConnections: [
              ...prev.discoveredConnections,
              [gameState.currentLocationId, exit.targetLocationId]
            ]
          }));
          
          // Обновляем состояние
          setGameState(prev => ({
            ...prev,
            currentLocationId: exit.targetLocationId,
            visitedLocations: prev.visitedLocations.includes(exit.targetLocationId)
              ? prev.visitedLocations
              : [...prev.visitedLocations, exit.targetLocationId],
            turn: prev.turn + 1
          }));
          
          // Помечаем локацию как посещенную
          setLocations(prev => ({
            ...prev,
            [exit.targetLocationId]: {
              ...prev[exit.targetLocationId],
              visited: true
            }
          }));
          
          // Показываем описание новой локации
          const locationDesc = getLocationDescription(newLocation, gameState.currentLocationId);
          addLogEntry('location', locationDesc);
        }
        break;
        
      case 'взять':
      case 'take':
      case 'забрать':
        if (!noun) {
          addLogEntry('error', 'Что взять? Например: "взять ключ"');
          break;
        }
        
        const itemIndex = currentLocation.items?.findIndex(i => 
          i.name.toLowerCase().includes(noun) || 
          i.id.toLowerCase().includes(noun)
        );
        
        if (itemIndex === -1 || itemIndex === undefined) {
          addLogEntry('error', `Здесь нет "${noun}".`);
          break;
        }
        
        const item = currentLocation.items![itemIndex];
        
        if (!item.takeable) {
          addLogEntry('error', `Вы не можете взять ${item.name}.`);
          break;
        }
        
        // Удаляем предмет из локации
        setLocations(prev => ({
          ...prev,
          [gameState.currentLocationId]: {
            ...prev[gameState.currentLocationId],
            items: prev[gameState.currentLocationId].items?.filter((_, i) => i !== itemIndex)
          }
        }));
        
        // Добавляем в инвентарь
        setGameState(prev => ({
          ...prev,
          inventory: [...prev.inventory, item]
        }));
        
        addLogEntry('item', `Вы взяли: **${item.name}**`);
        break;
        
      case 'инвентарь':
      case 'инв':
      case 'inv':
      case 'inventory':
        if (gameState.inventory.length === 0) {
          addLogEntry('response', 'Ваш инвентарь пуст.');
        } else {
          const itemsList = gameState.inventory.map(i => `• ${i.name}`).join('\n');
          addLogEntry('response', `**Ваш инвентарь:**\n${itemsList}`);
        }
        break;
        
      case 'назад':
      case 'back':
        if (!previousLocationId) {
          addLogEntry('error', 'Некуда возвращаться - вы в начале пути.');
        } else {
          const prevLocation = locations[previousLocationId];
          
          if (prevLocation) {
            // Меняем местами текущую и предыдущую
            const currentId = gameState.currentLocationId;
            setPreviousLocationId(currentId);
            
            // Добавляем соединение
            setGameState(prev => ({
              ...prev,
              discoveredConnections: [
                ...prev.discoveredConnections,
                [currentId, previousLocationId]
              ]
            }));
            
            setGameState(prev => ({
              ...prev,
              currentLocationId: previousLocationId,
              turn: prev.turn + 1
            }));
            
            const desc = getLocationDescription(prevLocation, currentId);
            addLogEntry('location', desc);
          }
        }
        break;
        
      case 'история':
      case 'history':
        if (gameState.gameLog.length === 0) {
          addLogEntry('response', 'История пуста.');
        } else {
          const recentLog = gameState.gameLog.slice(-10).map(e => {
            if (e.type === 'command') return e.text;
            return '';
          }).filter(Boolean).join('\n');
          addLogEntry('response', `**Последние команды:**\n${recentLog || 'Нет команд'}`);
        }
        break;
        
      case 'помощь':
      case 'help':
      case '?':
        setIsHelpOpen(true);
        addLogEntry('system', 'Открыта справка по командам.');
        break;
        
      case 'сброс':
      case 'reset':
      case 'restart':
        setLocations(createInitialLocations());
        setGameState({
          ...createInitialGameState(),
          discoveredConnections: [],
        });
        setPreviousLocationId(null);
        addLogEntry('system', 'Игра сброшена. Начните заново!');
        break;
        
      default:
        addLogEntry('error', `Неизвестная команда: "${verb}". Напишите "помощь" для списка команд.`);
    }
    
    setInput('');
  }, [gameState, locations, previousLocationId, addLogEntry]);
  
  // Отправка команды
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      processCommand(input.trim());
    }
  };
  
  // Навигация по истории команд
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };
  
  // Быстрые команды
  const quickCommands = [
    { label: 'Осмотреться', cmd: 'осмотреться', icon: Eye },
    { label: 'Инвентарь', cmd: 'инвентарь', icon: Backpack },
    { label: 'Назад', cmd: 'назад', icon: ArrowLeft },
    { label: 'Помощь', cmd: 'помощь', icon: HelpCircle },
  ];
  
  return (
    <div className="min-h-screen font-serif relative overflow-hidden bg-background">
      {/* Фон */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)]" />
      </div>
      
      {/* Header */}
      <header className="relative z-20 border-b border-border bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="flex justify-between items-center px-6 py-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Link>
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-ink/60">
              <Compass className="w-4 h-4" />
              <span className="font-sans">Ход: {gameState.turn}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setLocations(createInitialLocations());
                setGameState({
                  ...createInitialGameState(),
                  discoveredConnections: [],
                });
                setPreviousLocationId(null);
                toast.success('Игра начата заново');
              }}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Новая игра
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center animate-float">
                <Scroll className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-ink mb-2">Текстовое Приключение</h1>
            <p className="text-ink/60 italic">Исследуйте замок, собирайте предметы, находите секреты</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Game Log */}
            <div className="lg:col-span-2">
              <Card className="h-[500px] flex flex-col">
                <CardContent className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-bold text-ink">
                        {locations[gameState.currentLocationId]?.name || 'Неизвестно'}
                      </span>
                    </div>
                    <span className="text-xs text-ink/40 font-sans">
                      {gameState.visitedLocations.length} локаций посещено
                    </span>
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    <GameLog entries={gameState.gameLog} />
                  </div>
                  
                  {/* Input */}
                  <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-border">
                    <div className="flex gap-2">
                      <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Введите команду..."
                        className="flex-1 font-mono"
                        autoFocus
                      />
                      <Button type="submit" disabled={!input.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-ink/40 mt-2 font-sans">
                      Напишите "помощь" для списка команд
                    </p>
                  </form>
                </CardContent>
              </Card>
              
              {/* Quick Commands */}
              <div className="flex flex-wrap gap-2 mt-4">
                {quickCommands.map(({ label, cmd, icon: Icon }) => (
                  <Button
                    key={cmd}
                    variant="outline"
                    size="sm"
                    onClick={() => processCommand(cmd)}
                    className="flex items-center gap-1"
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Map */}
              <GameMap 
                visitedLocations={gameState.visitedLocations}
                currentLocationId={gameState.currentLocationId}
                discoveredConnections={gameState.discoveredConnections}
              />
              
              {/* Inventory */}
              <InventoryPanel 
                items={gameState.inventory}
                isOpen={isInventoryOpen}
                onToggle={() => setIsInventoryOpen(!isInventoryOpen)}
              />
              
              {/* Help */}
              <HelpPanel 
                isOpen={isHelpOpen}
                onToggle={() => setIsHelpOpen(!isHelpOpen)}
              />
              
              {/* Stats */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold text-ink mb-3 text-sm">Статистика</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-ink/60">Ходов:</span>
                      <span className="font-mono">{gameState.turn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink/60">Предметов:</span>
                      <span className="font-mono">{gameState.inventory.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink/60">Локаций:</span>
                      <span className="font-mono">{gameState.visitedLocations.length}/{Object.keys(locations).length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
