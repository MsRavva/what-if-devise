'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Backpack, 
  MapPin, 
  Send, 
  RotateCcw,
  Terminal,
  Lightbulb,
  Eye,
  Hand,
  Moon,
  Sun,
  UtensilsCrossed,
  FlaskConical,
  AlertCircle,
  Ghost,
  Trophy,
  Lock,
  X,
  Loader2,
  History,
  BookOpen
} from 'lucide-react';
import { GameLogEntry } from '@/types/adventure';
import {
  createHorrorGameState,
  createHorrorLocations,
  HorrorGameState,
  horrorItems,
  EndingType
} from '@/lib/horror-game';
import { useToast } from '@/components/toast-provider';
import { useAuth } from '@/components/auth-provider';
import { saveGameState, loadGameState } from '@/lib/supabase';
import {
  Achievement,
  initialAchievements,
  checkAchievements,
  checkSecretAction,
  loadAchievements,
  saveAchievements,
  resetAchievements
} from '@/lib/horror-achievements';
import { useTheme } from '@/components/theme-provider';

// Разбор команд
const parseCommand = (input: string): { verb: string; noun: string; fullText: string } => {
  const normalized = input.toLowerCase().trim();
  const words = normalized.split(/\s+/);

  return {
    verb: words[0] || '',
    noun: words.slice(1).join(' ') || '',
    fullText: normalized
  };
};

// Тексты концовок
const ENDINGS: Record<EndingType, { title: string; text: string; icon: string }> = {
  'frozen_jump': {
    title: 'Увы и ах!',
    text: 'Ты прыгнул с балкона с третьего этажа. Технически ты сбежал, но упал на бетон. Ноги сломаны. Ты лежишь на холоде, не можешь двигаться. Через несколько часов тебя найдут в виде замороженной тушки со сломанными ногами. Маньяк будет смеяться...',
    icon: '❄️'
  },
  'caught_manac': {
    title: 'Неудача!',
    text: 'Ты попался маньяку. Его нож был быстрее твоих ног. Теперь ты - часть коллекции. Твои крики никто не услышит...',
    icon: '🔪'
  },
  'shredder_meat': {
    title: 'МЯСО!',
    text: 'Ты упал в шредер. Острые лезвия сделали свое дело за секунды. Теперь ты - фарш. Маньяк будет использовать тебя для корма свиньям...',
    icon: '🥩'
  },
  'forgot_potion': {
    title: 'Ты ничего не забыл?',
    text: 'Ты сбежал через дверь, но не превратил маньяка в свинью! Пока ты бежал по улице, он выстрелил тебе в спину из окна. Ты упал в снег за пределами здания. Так близко к свободе...',
    icon: '💀'
  },
  'eaten_by_pig': {
    title: 'Не лезь, оно тебя сожрет!',
    text: 'Ты попался маньяку, которого превратил в свинью! Он все еще опасен в новом облике. Огромная свинья-маньяк съела тебя заживо. Твоя смесь сработала слишком хорошо...',
    icon: '🐷'
  },
  'pig_chase': {
    title: 'Да ну?',
    text: 'Ты сбежал, превратив маньяка в свинью, но не усыпил его! Огромная свинья-маньяк догнала тебя на улице. Она быстрее, чем ты думал. Тебя разорвали на куски в 100 метрах от здания...',
    icon: '🏃'
  },
  'true_escape': {
    title: 'Ну наконец-то!',
    text: 'Ты сделал всё правильно! Смесь из снотворного и инъекции усыпила маньяка-свинью. Ты тихо прошел мимо спящего монстра, открыл дверь ключом №4 и выбежал на улицу. Ты добрался до ближайшего поселения и на машине полицейских уехал домой. Ты свободен!',
    icon: '🎉'
  }
};

// Компонент текста
const FormattedText = ({ text, isDark }: { text: string; isDark?: boolean }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <div key={i} className={line.startsWith('•') ? 'ml-4' : ''}>
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className={`font-bold ${isDark ? 'text-red-400' : 'text-primary'}`}>{part.slice(2, -2)}</strong>;
              }
              return <span key={j}>{part}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
};

// Компонент лога
const GameLog = ({ entries, isDark }: { entries: GameLogEntry[]; isDark: boolean }) => {
  const logEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [entries]);

  const getEntryIcon = (type: GameLogEntry['type']) => {
    switch (type) {
      case 'command': return <Terminal className="w-4 h-4" />;
      case 'location': return <MapPin className="w-4 h-4" />;
      case 'item': return <Hand className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getEntryStyle = (type: GameLogEntry['type']) => {
    if (isDark) {
      switch (type) {
        case 'command': return 'text-slate-500 italic font-mono';
        case 'location': return 'text-red-400';
        case 'item': return 'text-yellow-400';
        case 'error': return 'text-red-600';
        case 'system': return 'text-slate-400 text-sm';
        default: return 'text-slate-200';
      }
    } else {
      switch (type) {
        case 'command': return 'text-primary/50 italic font-mono';
        case 'location': return 'text-primary';
        case 'item': return 'text-amber-700';
        case 'error': return 'text-red-500';
        case 'system': return 'text-ink/60 text-sm';
        default: return 'text-ink';
      }
    }
  };

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {entries.map((entry, index) => (
        <div key={index} className={`flex items-start gap-2 p-2 rounded ${getEntryStyle(entry.type)} animate-fade-up`} style={{ animationDelay: `${index * 50}ms` }}>
          {getEntryIcon(entry.type) && <span className="mt-0.5 opacity-60 flex-shrink-0">{getEntryIcon(entry.type)}</span>}
          <div className="leading-relaxed"><FormattedText text={entry.text} isDark={isDark} /></div>
        </div>
      ))}
      <div ref={logEndRef} />
    </div>
  );
};

// Компонент уведомления о достижении
const AchievementNotification = ({ achievement, onClose }: { achievement: Achievement; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-up">
      <Card className="bg-gradient-to-r from-yellow-900 to-amber-900 border-yellow-600 shadow-lg shadow-yellow-900/20">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="text-3xl">{achievement.icon}</div>
          <div>
            <p className="text-yellow-400 text-xs uppercase font-bold">Достижение разблокировано!</p>
            <h3 className="text-white font-bold">{achievement.name}</h3>
            <p className="text-yellow-200/70 text-sm">{achievement.description}</p>
          </div>
          <button onClick={onClose} className="ml-2 text-yellow-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

// Компонент концовки
const EndingScreen = ({ ending, onRestart }: { ending: EndingType; onRestart: () => void }) => {
  const endingData = ENDINGS[ending];
  const isGood = ending === 'true_escape';
  
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
      <Card className={`max-w-2xl w-full ${isGood ? 'border-green-600' : 'border-red-900'} bg-slate-950`}>
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">{endingData.icon}</div>
          <h2 className={`text-3xl font-bold mb-4 ${isGood ? 'text-green-500' : 'text-red-500'}`}>
            {endingData.title}
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-8">
            {endingData.text}
          </p>
          <Button 
            onClick={onRestart}
            className={`${isGood ? 'bg-green-700 hover:bg-green-600' : 'bg-red-900 hover:bg-red-800'} text-white px-8 py-3`}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {isGood ? 'Играть снова' : 'Попробовать еще раз'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Модальное окно достижений
const AchievementsModal = ({ 
  isOpen, 
  onClose, 
  achievements,
  onReset
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  achievements: Achievement[];
  onReset: () => void;
}) => {
  if (!isOpen) return null;
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progress = Math.round((unlockedCount / achievements.length) * 100);
  
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full max-h-[80vh] bg-slate-950 border-slate-800">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Достижения
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {unlockedCount} / {achievements.length} разблокировано ({progress}%)
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="h-2 bg-slate-800 rounded-full mb-6">
            <div 
              className="h-full bg-gradient-to-r from-yellow-600 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[50vh] custom-scrollbar mb-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  achievement.unlocked 
                    ? 'bg-slate-900 border-yellow-600/50' 
                    : 'bg-slate-900/50 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-slate-500'}`}>
                        {achievement.unlocked || !achievement.secret ? achievement.name : '???'}
                      </h3>
                      {achievement.secret && achievement.unlocked && (
                        <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded">Секретное</span>
                      )}
                    </div>
                    <p className={`text-sm ${achievement.unlocked ? 'text-slate-400' : 'text-slate-600'}`}>
                      {achievement.unlocked || !achievement.secret ? achievement.description : 'Разблокируйте, чтобы увидеть'}
                    </p>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <p className="text-xs text-slate-600 mt-1">
                        Получено: {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end pt-4 border-t border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm('Сбросить ВСЕ достижения? Это действие нельзя отменить.')) {
                  onReset();
                }
              }}
              className="border-red-900/50 text-red-400 hover:bg-red-950"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Сбросить достижения
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function HorrorGamePage() {
  const [locations, setLocations] = useState(createHorrorLocations());
  const [gameState, setGameState] = useState<HorrorGameState>(createHorrorGameState());
  const [input, setInput] = useState('');
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const isDarkTheme = theme === 'dark';
  const hasLight = gameState.isDaytime || gameState.hasLight;

  const handleCloudSave = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Нужно войти, чтобы сохранять в облако');
      return;
    }
    setIsSaving(true);
    try {
      await saveGameState(user.id, 'horror', { locations, gameState });
      toast.success('Прогресс сохранен в облако');
    } catch (e) {
      toast.error('Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloudLoad = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Нужно войти, чтобы загрузить из облака');
      return;
    }
    setIsLoading(true);
    try {
      const saved = await loadGameState(user.id, 'horror');
      if (saved) {
        setLocations(saved.locations);
        setGameState(saved.gameState);
        toast.success('Прогресс загружен');
      } else {
        toast.error('Сохранений не найдено');
      }
    } catch (e) {
      toast.error('Ошибка загрузки');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const saved = localStorage.getItem('horror-game-v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.locations) setLocations(parsed.locations);
        if (parsed.gameState) setGameState(parsed.gameState);
      } catch (e) {
        console.error('Failed to load:', e);
      }
    }
    // Загрузка достижений
    setAchievements(loadAchievements());
  }, []);
  
  useEffect(() => {
    localStorage.setItem('horror-game-v3', JSON.stringify({ locations, gameState }));
  }, [locations, gameState]);
  
  const addLogEntry = useCallback((type: GameLogEntry['type'], text: string) => {
    setGameState(prev => ({ ...prev, gameLog: [...prev.gameLog, { type, text, timestamp: Date.now() }] }));
  }, []);
  
  const checkAndUnlockAchievements = useCallback((action: string = '') => {
    const { newAchievements, unlocked } = checkAchievements(gameState, locations, action, achievements);
    if (unlocked.length > 0) {
      setAchievements(newAchievements);
      saveAchievements(newAchievements);
      setRecentAchievement(unlocked[0]);
      toast.success(`Достижение: ${unlocked[0].name}`);
    }
  }, [gameState, locations, achievements, toast]);

  const triggerEnding = useCallback((ending: EndingType) => {
    setGameState(prev => ({ ...prev, ending, gameOver: true }));
    
    // Проверяем достижения за концовку
    setTimeout(() => {
      const { newAchievements, unlocked } = checkAchievements(
        { ...gameState, ending, gameOver: true }, 
        locations, 
        'ending', 
        achievements
      );
      if (unlocked.length > 0) {
        setAchievements(newAchievements);
        saveAchievements(newAchievements);
        setRecentAchievement(unlocked[0]);
      }
    }, 100);
    
    if (ending === 'true_escape') {
      toast.success('Победа!');
    } else {
      toast.error('Конец игры');
    }
  }, [gameState, locations, achievements, toast]);
  
  const checkManiacEncounter = useCallback((locationId: string) => {
    // Маньяк на 1 этаже и в коридоре
    if (locationId === 'first-floor-hall' && !gameState.maniacFed && !gameState.maniacAsleep) {
      // 50% шанс встретить маньяка
      if (Math.random() > 0.5) {
        triggerEnding('caught_manac');
        return true;
      }
    }
    return false;
  }, [gameState.maniacFed, gameState.maniacAsleep, triggerEnding]);
  
  const processCommand = useCallback((commandText: string) => {
    if (gameState.gameOver) return;
    
    const { verb, noun, fullText } = parseCommand(commandText);
    if (!verb) return;
    
    addLogEntry('command', `> ${fullText}`);
    setCommandHistory(prev => [...prev, fullText]);
    setHistoryIndex(-1);
    
    const currentLocation = locations[gameState.currentLocationId];
    
    switch (verb) {
      case 'осмотреться':
      case 'о':
        if (!noun) {
          let desc = `**${currentLocation.name}**\n\n${currentLocation.detailedDescription}`;
          if (!hasLight && currentLocation.id !== 'bedroom') {
            desc = `**${currentLocation.name}**\n\nТемно. Очень темно. Вы ничего не видите. Нужен свет, или подождите утра...`;
          }
          addLogEntry('location', desc);
        } else {
          const item = currentLocation.items?.find(i => 
            i.name.toLowerCase().includes(noun) || i.id.toLowerCase().includes(noun)
          ) || gameState.inventory.find(i => 
            i.name.toLowerCase().includes(noun) || i.id.toLowerCase().includes(noun)
          );
          
          if (item) {
            addLogEntry('response', `**${item.name}**\n${item.description}`);
          } else {
            addLogEntry('error', 'В темноте ничего не видно...');
          }
        }
        break;
        
      case 'идти':
      case 'go':
        if (!noun) {
          addLogEntry('error', 'Куда идти?');
          break;
        }
        
        const exit = currentLocation.exits?.find(e => 
          e.direction.toLowerCase().includes(noun) || noun.includes(e.direction.toLowerCase())
        );
        
        if (!exit) {
          addLogEntry('error', 'Этот путь недоступен.');
          break;
        }
        
        // Проверка концовки - прыжок с балкона (требует подтверждения)
        if (exit.targetLocationId === 'balcony-jump') {
          addLogEntry('system', '⚠️ Вы собираетесь прыгнуть с балкона! Это третий этаж. Напишите "прыгнуть точно" чтобы подтвердить.');
          break;
        }
        
        // Проверка концовки - шредер (уже обрабатывается в case 'прыгнуть')
        if (exit.targetLocationId === 'shredder-death') {
          addLogEntry('error', 'В шредер лучше не лезть...');
          break;
        }
        
        // Проверка концовки - встреча с маньяком (не даем войти напрямую)
        if (exit.targetLocationId === 'maniac-encounter') {
          addLogEntry('error', 'Туда лучше не ходить без подготовки...');
          break;
        }
        
        if (exit.locked) {
          if (exit.requiredItem && gameState.inventory.some(i => i.id === exit.requiredItem || i.id.includes(exit.requiredItem!))) {
            setLocations(prev => ({
              ...prev,
              [gameState.currentLocationId]: {
                ...prev[gameState.currentLocationId],
                exits: prev[gameState.currentLocationId].exits?.map(e => 
                  e.direction === exit.direction ? { ...e, locked: false } : e
                )
              }
            }));
            addLogEntry('item', '🔓 Вы использовали ключ и отперли дверь!');
          } else {
            addLogEntry('error', '🔒 Заперто. Нужен ключ.');
            break;
          }
        }
        
        const newLocation = locations[exit.targetLocationId];
        if (newLocation) {
          // Проверка встречи с маньяком
          if (checkManiacEncounter(exit.targetLocationId)) {
            return;
          }
          
          setGameState(prev => ({
            ...prev,
            previousLocationId: gameState.currentLocationId,
            currentLocationId: exit.targetLocationId,
            visitedLocations: prev.visitedLocations.includes(exit.targetLocationId)
              ? prev.visitedLocations
              : [...prev.visitedLocations, exit.targetLocationId],
            discoveredConnections: [...prev.discoveredConnections, [gameState.currentLocationId, exit.targetLocationId]],
            turn: prev.turn + 1
          }));
          
          setLocations(prev => ({ ...prev, [exit.targetLocationId]: { ...prev[exit.targetLocationId], visited: true } }));
          
          // Проверка выхода - концовки
          if (exit.targetLocationId === 'freedom' || exit.targetLocationId === 'exit-door') {
            // Проверяем условия концовки
            if (!gameState.maniacTurnedToPig) {
              // Концовка 4: Не превратил в свинью
              triggerEnding('forgot_potion');
            } else if (!gameState.maniacAsleep && gameState.maniacTurnedToPig) {
              // Концовка 6: Превратил но не усыпил
              triggerEnding('pig_chase');
            } else if (gameState.maniacTurnedToPig && gameState.maniacAsleep) {
              // Концовка 7: Правильная победа
              triggerEnding('true_escape');
            }
          } else {
            const desc = `**${newLocation.name}**\n\n${newLocation.detailedDescription}`;
            addLogEntry('location', desc);
          }
        }
        break;
        
      case 'взять':
      case 'take':
        if (!noun) {
          addLogEntry('error', 'Что взять?');
          break;
        }
        
        if (!hasLight && currentLocation.id !== 'bedroom') {
          addLogEntry('error', 'Слишком темно.');
          break;
        }
        
        const itemIndex = currentLocation.items?.findIndex(i => 
          i.name.toLowerCase().includes(noun) || i.id.toLowerCase().includes(noun)
        );
        
        if (itemIndex === -1 || itemIndex === undefined) {
          addLogEntry('error', 'Здесь нет такого предмета.');
          break;
        }
        
        const item = currentLocation.items![itemIndex];
        
        if (!item.takeable) {
          addLogEntry('error', `Вы не можете взять ${item.name}.`);
          break;
        }
        
        setLocations(prev => ({
          ...prev,
          [gameState.currentLocationId]: {
            ...prev[gameState.currentLocationId],
            items: prev[gameState.currentLocationId].items!.filter((_, i) => i !== itemIndex)
          }
        }));
        
        setGameState(prev => ({
          ...prev,
          inventory: [...prev.inventory, item],
          hasLight: item.id.includes('flashlight') || prev.hasLight,
        }));
        
        addLogEntry('item', `Вы взяли: **${item.name}**`);
        
        // Проверка достижений
        setTimeout(() => checkAndUnlockAchievements('take_item'), 100);
        break;
        
      case 'спать':
      case 'sleep':
        if (!gameState.inventory.some(i => i.id.includes('blanket'))) {
          addLogEntry('error', 'Слишком холодно спать без одеяла.');
          break;
        }
        
        setGameState(prev => ({
          ...prev,
          isDaytime: true,
          isDark: false,
          sleepCount: prev.sleepCount + 1,
        }));
        
        addLogEntry('system', '☀️ Вы заснули... и проснулись утром! Солнце светит!');
        
        // Проверка достижений
        setTimeout(() => checkAndUnlockAchievements('sleep'), 100);
        
        setTimeout(() => {
          setGameState(prev => ({ ...prev, isDaytime: false, isDark: true }));
          addLogEntry('system', '🌙 Солнце село. Снова темнеет...');
        }, 60000);
        break;
        
      case 'прыгнуть':
        if ((noun === 'точно' || fullText === 'прыгнуть точно') && gameState.currentLocationId === 'balcony') {
          triggerEnding('frozen_jump');
        } else if (gameState.currentLocationId === 'balcony') {
          addLogEntry('system', '⚠️ Вы собираетесь прыгнуть с балкона! Это третий этаж. Напишите "прыгнуть точно" чтобы подтвердить.');
        } else {
          addLogEntry('error', 'Отсюда прыгать нельзя.');
        }
        break;
        
      case 'включить':
        if (noun === 'свет' || noun === 'выключатель') {
          setGameState(prev => ({ ...prev, hasLight: true }));
          addLogEntry('system', '💡 Свет включен!');
          
          // Проверка достижений
          setTimeout(() => checkAndUnlockAchievements('turn_on_light'), 100);
        }
        break;
        
      case 'смешать':
        const parts = (noun || '').split(/[и+\s]+/).filter(p => p.length > 0);
        if (parts.length < 2) {
          addLogEntry('error', 'Укажите два предмета через "и"');
          break;
        }
        
        const hasPills = gameState.inventory.some(i => i.name.toLowerCase().includes('снотворн'));
        const hasInj = gameState.inventory.some(i => i.name.toLowerCase().includes('инъекц') && !i.name.toLowerCase().includes('смес'));
        
        if (hasPills && hasInj) {
          setGameState(prev => ({
            ...prev,
            inventory: [
              ...prev.inventory.filter(i => !i.name.toLowerCase().includes('снотворн') && !i.name.toLowerCase().includes('инъекц')),
              { ...horrorItems.mixedInjection, id: 'mixed-crafted' }
            ],
            craftedItems: [...prev.craftedItems, 'mixedInjection'],
          }));
          addLogEntry('item', '🧪 Вы смешали снотворное со свиной инъекцией! Получилась странная смесь...');
          
          // Проверка достижений
          setTimeout(() => checkAndUnlockAchievements('craft'), 100);
        } else {
          addLogEntry('error', 'Недостаточно ингредиентов.');
        }
        break;
        
      case 'приготовить':
        const hasRaw = gameState.inventory.some(i => i.id.includes('rawChicken'));
        const hasTray = gameState.inventory.some(i => i.id.includes('tray'));
        
        if (!hasRaw || !hasTray) {
          addLogEntry('error', 'Нужна курица и поднос.');
          break;
        }
        
        setGameState(prev => ({
          ...prev,
          inventory: [
            ...prev.inventory.filter(i => !i.id.includes('rawChicken')),
            { ...horrorItems.grilledChicken, id: 'chicken-cooked' }
          ],
          cookedMeals: [...prev.cookedMeals, 'grilledChicken'],
        }));
        
        addLogEntry('item', '🍗 Курица-гриль готова!');
        
        // Проверка достижений
        setTimeout(() => checkAndUnlockAchievements('cook'), 100);
        break;
        
      case 'использовать':
      case 'use':
      case 'нажать':
        // Шредер
        if ((noun === 'кнопку' || noun === 'шредер') && currentLocation.id === 'shredder-room') {
          addLogEntry('system', '🔄 Шредер активирован! Код: 4821');
          break;
        }
        
        // Вентиляция
        if ((noun === 'отвертку' || noun === 'вентиляцию') && currentLocation.id === 'pig-hall' && 
            gameState.inventory.some(i => i.id.includes('screwdriver'))) {
          setLocations(prev => ({
            ...prev,
            'pig-hall': {
              ...prev['pig-hall'],
              exits: prev['pig-hall'].exits?.map(e => 
                e.direction === 'вентиляция' ? { ...e, locked: false } : e
              )
            }
          }));
          addLogEntry('system', '🔧 Решетка откручена!');
          break;
        }
        
        // Смесь на маньяка/свинью
        if ((noun.includes('смес') || noun.includes('инъекц')) && currentLocation.id === 'first-floor-hall' && 
            gameState.inventory.some(i => i.id.includes('mixedInjection'))) {
          
          // Проверяем, ели ли маньяк смесь
          setGameState(prev => ({
            ...prev,
            maniacFed: true,
            maniacTurnedToPig: true,
            maniacAsleep: true,
            inventory: prev.inventory.filter(i => !i.id.includes('mixedInjection'))
          }));
          
          addLogEntry('system', '💉 Вы подсунули смесь маньяку! Оно начинает действовать... Маньяк трансформируется! Он превращается в свинью! И засыпает...');
          break;
        }
        
        // Если используем смесь на свинью в зале
        if ((noun.includes('смес') || noun.includes('инъекц')) && currentLocation.id === 'pig-hall' && 
            gameState.inventory.some(i => i.id.includes('mixedInjection'))) {
          triggerEnding('eaten_by_pig');
          break;
        }
        
        addLogEntry('error', 'Ничего не произошло.');
        break;
        
      case 'назад':
        if (!gameState.previousLocationId) {
          addLogEntry('error', 'Некуда возвращаться.');
        } else {
          const prevLoc = locations[gameState.previousLocationId];
          if (prevLoc) {
            setGameState(prev => ({
              ...prev,
              previousLocationId: gameState.currentLocationId,
              currentLocationId: gameState.previousLocationId!,
              turn: prev.turn + 1
            }));
            
            addLogEntry('location', `**${prevLoc.name}**\n\n${prevLoc.detailedDescription}`);
          }
        }
        break;
        
      case 'инвентарь':
      case 'инв':
        if (gameState.inventory.length === 0) {
          addLogEntry('response', 'Инвентарь пуст.');
        } else {
          const itemsList = gameState.inventory.map(i => `• ${i.name}`).join('\n');
          addLogEntry('response', `**Инвентарь:**\n${itemsList}`);
        }
        break;
        
      case 'помощь':
      case 'help':
        addLogEntry('system', '**Команды:**\n• осмотреться\n• идти [куда]\n• взять [что]\n• спать\n• включить свет\n• смешать [предмет] и [предмет]\n• приготовить курицу\n• использовать [что]\n• инвентарь\n• назад');
        break;
        
      case 'сброс':
      case 'reset':
        setLocations(createHorrorLocations());
        setGameState(createHorrorGameState());
        addLogEntry('system', '🔄 Игра сброшена.');
        break;
        
      default:
        // Обработка неизвестной команды через ИИ
        const handleAIAction = async () => {
          try {
            const aiResponse = await fetch('/api/generate-scenario', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                story: `Локация: ${locations[gameState.currentLocationId]?.name}. ${locations[gameState.currentLocationId]?.description}. В инвентаре: ${gameState.inventory.map(i => i.name).join(', ')}. Текущее состояние: ${gameState.isDaytime ? 'день' : 'ночь'}.`,
                question: `Игрок пытается сделать: "${fullText}". Опиши результат этого действия кратко (2-3 предложения) в мрачном стиле хоррор-квеста.`,
                mode: 'action'
              })
            });
            const data = await aiResponse.json();
            if (data.scenario) {
              addLogEntry('response', data.scenario);
            } else {
              addLogEntry('response', `Вы попробовали "${fullText}", но это не дало видимого результата.`);
            }
          } catch (e) {
            addLogEntry('response', `Вы попробовали "${fullText}", но это не дало видимого результата.`);
          }
        };
        handleAIAction();
    }

    setInput('');
  }, [gameState, locations, hasLight, addLogEntry, triggerEnding, checkManiacEncounter]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) processCommand(input.trim());
  };
  
  return (
    <div className={`min-h-screen font-serif relative overflow-hidden transition-colors duration-500 ${isDarkTheme ? 'bg-slate-950 text-slate-200' : 'bg-background text-foreground'}`}>
      {isDarkTheme && <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black pointer-events-none" />}

      {/* Achievement Notification */}
      {recentAchievement && (
        <AchievementNotification
          achievement={recentAchievement}
          onClose={() => setRecentAchievement(null)}
        />
      )}

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={achievements}
        onReset={() => {
          setAchievements(resetAchievements());
        }}
      />

      {/* Ending Screen */}
      {gameState.gameOver && gameState.ending && (
        <EndingScreen
          ending={gameState.ending}
          onRestart={() => {
            setLocations(createHorrorLocations());
            setGameState(createHorrorGameState());
          }}
        />
      )}

      {/* Header */}
      <header className={`relative z-20 border-b shadow-sm ${isDarkTheme ? 'border-red-900/30 bg-slate-900/80' : 'border-border bg-card/80'} backdrop-blur-sm`}>
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <Button variant="outline" size="sm" asChild className={isDarkTheme ? 'border-slate-700 text-slate-300' : ''}>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Link>
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAchievementsOpen(true)}
              className={isDarkTheme ? 'border-yellow-600/50 text-yellow-400 hover:bg-yellow-950' : 'border-primary/30 text-primary'}
            >
              <Trophy className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Ачивки: </span>{achievements.filter(a => a.unlocked).length}/{achievements.length}
            </Button>

            {isAuthenticated && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCloudSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <History className="w-4 h-4 sm:mr-1" />}
                  <span className="hidden sm:inline">Сохранить</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleCloudLoad} disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4 sm:mr-1" />}
                  <span className="hidden sm:inline">Загрузить</span>
                </Button>
              </div>
            )}

            <div className={`hidden md:flex items-center gap-2 text-sm ${isDarkTheme ? 'text-slate-400' : 'text-ink/60'}`}>
              {gameState.isDaytime ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
              <span className="font-sans uppercase tracking-tighter">{gameState.isDaytime ? 'День' : 'Ночь'}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if(confirm('Начать новую игру? Прогресс будет сброшен.')) {
                  setLocations(createHorrorLocations());
                  setGameState(createHorrorGameState());
                }
              }}
              className={isDarkTheme ? 'border-red-900/50 text-red-400 hover:bg-red-950' : ''}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8 container mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center animate-float ${gameState.isDaytime ? 'bg-yellow-900/20 border-yellow-600' : (isDarkTheme ? 'bg-slate-900 border-red-800' : 'bg-primary/10 border-primary/30')}`}>
                {gameState.isDaytime ? <Sun className="w-8 h-8 text-yellow-400" /> : <Ghost className="w-8 h-8 text-red-500" />}
              </div>
            </div>
            <h1 className={`text-3xl md:text-5xl font-bold mb-2 ${isDarkTheme ? 'text-red-500' : 'text-ink'}`}>ПРОБУЖДЕНИЕ</h1>
            <p className={`${isDarkTheme ? 'text-slate-400' : 'text-ink/60'} italic`}>Найди выход... если сможешь.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <Card className={`h-[550px] flex flex-col shadow-xl border-2 ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-card border-border'}`}>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className={`flex items-center justify-between mb-4 border-b pb-3 ${isDarkTheme ? 'border-slate-800' : 'border-border'}`}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-500" />
                      <span className={`font-bold text-lg ${isDarkTheme ? 'text-slate-200' : 'text-ink'}`}>
                        {locations[gameState.currentLocationId]?.name}
                      </span>
                    </div>
                    <div className="flex gap-1.5 bg-black/10 dark:bg-black/40 px-3 py-1 rounded-full">
                      {[1,2,3,4].map(n => (
                        <span key={n} className={gameState.inventory.some(i => i.id.includes(`key${n}`)) ? 'text-yellow-400 grayscale-0' : 'text-slate-500 grayscale opacity-30'}>
                          🔑
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <GameLog entries={gameState.gameLog} isDark={isDarkTheme} />
                  </div>

                  <form onSubmit={handleSubmit} className={`mt-4 pt-4 border-t ${isDarkTheme ? 'border-slate-800' : 'border-border'}`}>
                    <div className="flex gap-3">
                      <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={hasLight ? "Введите команду..." : "Темно..."}
                        className={`flex-1 font-serif italic text-lg h-12 ${isDarkTheme ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-background border-primary/20 text-ink'}`}
                        autoFocus
                      />
                      <Button type="submit" disabled={!input.trim()} className={isDarkTheme ? 'bg-red-900 hover:bg-red-800 h-12 w-12' : 'h-12 w-12'}>
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-2 mt-6">
                {[
                  { label: 'Осмотреться', cmd: 'о', icon: Eye },
                  { label: 'Инвентарь', cmd: 'инв', icon: Backpack },
                  { label: 'Назад', cmd: 'назад', icon: ArrowLeft },
                  ...(!hasLight ? [{ label: 'Спать', cmd: 'спать', icon: Moon }] : []),
                  ...(hasLight ? [
                    { label: 'Смешать', cmd: 'смешать ', icon: FlaskConical },
                    { label: 'Готовить', cmd: 'приготовить ', icon: UtensilsCrossed }
                  ] : []),
                ].map((cmd) => (
                  <Button
                    key={cmd.cmd}
                    variant="outline"
                    size="sm"
                    onClick={() => processCommand(cmd.cmd)}
                    className={`flex items-center gap-1.5 px-4 py-2 ${isDarkTheme ? 'border-slate-700 text-slate-400 hover:text-slate-200' : 'border-primary/20 text-ink/70'}`}
                  >
                    <cmd.icon className="w-4 h-4" />
                    {cmd.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* Inventory */}
              <div>
                <Card className={`border-2 ${isDarkTheme ? 'bg-slate-900 border-red-900/20' : 'bg-card border-border'}`}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`font-bold flex items-center gap-2 ${isDarkTheme ? 'text-slate-200' : 'text-ink'}`}>
                        <Backpack className="w-4 h-4" />
                        Снаряжение
                      </h3>
                      <span className="text-xs font-sans opacity-50">{gameState.inventory.length}</span>
                    </div>
                    {gameState.inventory.length === 0 ? (
                      <p className="text-sm text-slate-500 italic text-center py-4 border border-dashed rounded border-slate-800">Пусто...</p>
                    ) : (
                      <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                        {gameState.inventory.map((item) => (
                          <div key={item.id} className={`p-2.5 rounded border transition-colors ${isDarkTheme ? 'bg-slate-800 border-slate-700 hover:border-red-900/50' : 'bg-primary/5 border-primary/10 hover:border-primary/30'}`}>
                            <p className={`font-medium text-sm ${isDarkTheme ? 'text-slate-200' : 'text-ink'}`}>{item.name}</p>
                            <p className="text-[10px] opacity-60 leading-tight mt-1">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Status */}
              <Card className={`border-2 ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-card border-border'}`}>
                <CardContent className="p-5">
                  <h3 className={`font-bold mb-4 text-sm flex items-center gap-2 ${isDarkTheme ? 'text-slate-200' : 'text-ink'}`}>
                    <Terminal className="w-4 h-4" />
                    Статус
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="opacity-50">Время:</span>
                      <span className={`font-sans flex items-center gap-1.5 ${gameState.isDaytime ? 'text-yellow-400' : 'text-slate-500'}`}>
                        {gameState.isDaytime ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                        {gameState.isDaytime ? 'День' : 'Ночь'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="opacity-50">Ход:</span>
                      <span className="font-mono">{gameState.turn}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="opacity-50">Ключей:</span>
                      <span className="font-mono text-yellow-500">{gameState.inventory.filter(i => i.id.includes('key')).length}/4</span>
                    </div>
                    {gameState.maniacTurnedToPig && (
                      <div className="text-pink-400 text-xs bg-pink-400/10 p-2 rounded border border-pink-400/20 animate-pulse">
                        🐷 Маньяк превращен в свинью
                      </div>
                    )}
                    {gameState.maniacAsleep && (
                      <div className="text-blue-400 text-xs bg-blue-400/10 p-2 rounded border border-blue-400/20">
                        💤 Угроза нейтрализована
                      </div>
                    )}
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
