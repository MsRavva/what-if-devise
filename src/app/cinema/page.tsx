'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Play, Share2, Film, BookOpen, Sparkles, Wand2, Save, Copy, Check } from 'lucide-react';
import { HologramCard, GlitchText, EnergyButton } from '@/components/cyberpunk';

// Типы для режима кино
interface MovieScene {
  id: string;
  text: string;
  choices: MovieChoice[];
  isEnding?: boolean;
  endingCode?: string;
  endingTitle?: string;
}

interface MovieChoice {
  id: string;
  text: string;
  nextSceneId: string;
  seedModifier: number;
}

interface MovieSession {
  id: string;
  title: string;
  premise: string;
  currentSceneId: string;
  history: string[];
  seed: number;
  choices: string[];
  scenes: Record<string, MovieScene>;
}

// Простой детерминированный генератор сцен на основе seed
class DeterministicGenerator {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  // Простой LCG (Linear Congruential Generator) для детерминированных чисел
  private random(): number {
    this.seed = (this.seed * 1103515245 + 12345) % 2147483647;
    return this.seed / 2147483647;
  }
  
  // Генерация начальной сцены
  generateOpening(premise: string): MovieScene {
    const openers = [
      `Ночь. Город погружен во тьму. ${premise} Начинается история, которая изменит всё...`,
      `Рассвет. Новый день принесёт неожиданные повороты. ${premise} С этого момента ничто не будет прежним...`,
      `Где-то между реальностью и сном... ${premise} Начинается путешествие в неизвестность...`,
      `Судьба сталкивает героев лицом к лицу. ${premise} Момент, который определит всё...`,
      `Тишина нарушена. ${premise} События приобретают стремительный оборот...`
    ];
    
    const opener = openers[Math.floor(this.random() * openers.length)];
    
    return {
      id: 'scene-1',
      text: opener,
      choices: this.generateChoices(1)
    };
  }
  
  // Генерация выборов для сцены
  private generateChoices(sceneNumber: number): MovieChoice[] {
    const actions = [
      { text: 'Действовать решительно', type: 'action' },
      { text: 'Проявить осторожность', type: 'caution' },
      { text: 'Обратиться за помощью', type: 'help' },
      { text: 'Попытаться убедить', type: 'persuade' },
      { text: 'Воспользоваться обманом', type: 'deceive' },
      { text: 'Принять вызов', type: 'accept' },
      { text: 'Попытаться избежать конфликта', type: 'avoid' },
      { text: 'Довериться интуиции', type: 'intuition' }
    ];
    
    // Выбираем 3 случайных действия
    const shuffled = [...actions].sort(() => this.random() - 0.5);
    const selected = shuffled.slice(0, 3);
    
    return selected.map((action, index) => ({
      id: `choice-${sceneNumber}-${index}`,
      text: action.text,
      nextSceneId: `scene-${sceneNumber + 1}`,
      seedModifier: action.text.length * (index + 1)
    }));
  }
  
  // Генерация следующей сцены
  generateNextScene(
    previousSceneId: string, 
    choice: MovieChoice, 
    choiceText: string,
    history: string[]
  ): MovieScene {
    const sceneNumber = parseInt(previousSceneId.split('-')[1]) + 1;
    
    // Проверяем, достигли ли мы концовки (после 5 сцен)
    if (sceneNumber >= 6) {
      return this.generateEnding(history, choiceText);
    }
    
    const developments = [
      `Ваше решение "${choiceText}" приводит к неожиданным последствиям. Ситуация накаляется...`,
      `Выбор сделан. "${choiceText}" открывает новые возможности, но и новые опасности...`,
      `После того как вы решили "${choiceText}", обстоятельства меняются...`,
      `Последствия решения "${choiceText}" не заставляют себя ждать...`,
      `Ваш выбор "${choiceText}" переплетает судьбы героев по-новому...`
    ];
    
    const development = developments[Math.floor(this.random() * developments.length)];
    
    return {
      id: `scene-${sceneNumber}`,
      text: development,
      choices: this.generateChoices(sceneNumber)
    };
  }
  
  // Генерация концовки
  private generateEnding(history: string[], finalChoice: string): MovieScene {
    // Создаём уникальный код концовки на основе истории
    const endingCode = this.generateEndingCode(history, finalChoice);
    
    const endings: Record<string, { title: string; text: string }> = {
      'HEROIC': {
        title: 'Героическая концовка',
        text: `Ваш путь привёл к торжеству добра. Последнее решение "${finalChoice}" стало решающим. История заканчивается победой, но цена оказалась высока...`
      },
      'TRAGIC': {
        title: 'Трагическая концовка', 
        text: `Судьба оказалась жестока. Последний выбор "${finalChoice}" привёл к неизбежному. Иногда даже лучшие намерения ведут к печальному исходу...`
      },
      'BITTERSWEET': {
        title: 'Горько-сладкая концовка',
        text: `Победа достигнута, но чем ценой? Ваше решение "${finalChoice}" дало результат, оставивший неизгладимый след...`
      },
      'OPEN': {
        title: 'Открытая концовка',
        text: `История не заканчивается, а переходит в новую фазу. После "${finalChoice}" мир изменился, и только время покажет, к чему это приведёт...`
      },
      'MYSTERIOUS': {
        title: 'Таинственная концовка',
        text: `Некоторые вопросы остаются без ответа. Ваш выбор "${finalChoice}" открыл дверь в неизвестность, полную секретов...`
      },
      'COMEDIC': {
        title: 'Комичная концовка',
        text: `Непредвиденные обстоятельства превратили серьёзный финал в забавную ситуацию. Кто знал, что "${finalChoice}" приведёт к такому?`
      },
      'SACRIFICE': {
        title: 'Концовка жертвы',
        text: `Великие дела требуют великих жертв. Ваше решение "${finalChoice}" спасло других, но изменило вашу судьбу навсегда...`
      },
      'REDEMPTION': {
        title: 'Концовка искупления',
        text: `Прошлые ошибки искуплены. Выбор "${finalChoice}" открыл путь к прощению и новому началу...`
      }
    };
    
    const ending = endings[endingCode] || endings['OPEN'];
    
    return {
      id: 'ending',
      text: ending.text,
      choices: [],
      isEnding: true,
      endingCode: endingCode,
      endingTitle: ending.title
    };
  }
  
  // Генерация детерминированного кода концовки
  private generateEndingCode(history: string[], finalChoice: string): string {
    const allChoices = [...history, finalChoice].join('');
    let hash = 0;
    for (let i = 0; i < allChoices.length; i++) {
      const char = allChoices.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const endings = ['HEROIC', 'TRAGIC', 'BITTERSWEET', 'OPEN', 'MYSTERIOUS', 'COMEDIC', 'SACRIFICE', 'REDEMPTION'];
    const index = Math.abs(hash) % endings.length;
    return endings[index];
  }
}

// Компонент для отображения сцены
const SceneDisplay = ({ scene, onChoice, isLoading }: { 
  scene: MovieScene; 
  onChoice: (choice: MovieChoice) => void;
  isLoading: boolean;
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-card/30 border border-primary/20 p-6 rounded-lg animate-fade-up">
        <p className="text-lg text-ink leading-relaxed font-serif italic">
          {scene.text}
        </p>
      </div>
      
      {scene.isEnding ? (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 p-6 rounded-lg text-center animate-scale-in">
          <Film className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-2xl font-bold text-ink mb-2 font-serif">{scene.endingTitle}</h3>
          <p className="text-ink/60 text-sm font-serif">Код концовки: <span className="font-bold text-primary">{scene.endingCode}</span></p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-ink/50 uppercase tracking-widest font-sans">Что выберете?</p>
          {scene.choices.map((choice) => (
            <EnergyButton
              key={choice.id}
              variant="secondary"
              className="w-full justify-start text-left animate-fade-up"
              onClick={() => onChoice(choice)}
              disabled={isLoading}
            >
              {choice.text}
            </EnergyButton>
          ))}
        </div>
      )}
    </div>
  );
};

// Главный компонент страницы
export default function CinemaModePage() {
  const [session, setSession] = useState<MovieSession | null>(null);
  const [premise, setPremise] = useState('');
  const [customSeed, setCustomSeed] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSessions, setSavedSessions] = useState<MovieSession[]>([]);
  
  // Загрузка сохраненных сессий из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cinema-sessions');
    if (saved) {
      try {
        setSavedSessions(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved sessions:', e);
      }
    }
  }, []);
  
  // Сохранение сессии
  const saveSession = useCallback(() => {
    if (!session) return;
    
    const updatedSessions = [...savedSessions.filter(s => s.id !== session.id), session];
    setSavedSessions(updatedSessions);
    localStorage.setItem('cinema-sessions', JSON.stringify(updatedSessions));
  }, [session, savedSessions]);
  
  // Начало новой игры
  const startNewGame = async () => {
    if (!premise.trim()) return;
    
    setIsLoading(true);
    
    // Генерируем seed из premise или используем custom
    let seed: number;
    if (customSeed) {
      seed = parseInt(customSeed);
    } else {
      seed = Array.from(premise).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    }
    
    const generator = new DeterministicGenerator(seed);
    const openingScene = generator.generateOpening(premise);
    
    const newSession: MovieSession = {
      id: Date.now().toString(),
      title: premise.substring(0, 50) + (premise.length > 50 ? '...' : ''),
      premise,
      currentSceneId: openingScene.id,
      history: [],
      seed,
      choices: [],
      scenes: { [openingScene.id]: openingScene }
    };
    
    setSession(newSession);
    setIsLoading(false);
  };
  
  // Обработка выбора игрока
  const handleChoice = async (choice: MovieChoice) => {
    if (!session) return;
    
    setIsLoading(true);
    
    // Небольшая задержка для эффекта
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const generator = new DeterministicGenerator(session.seed + choice.seedModifier);
    const nextScene = generator.generateNextScene(
      session.currentSceneId,
      choice,
      choice.text,
      [...session.history, choice.text]
    );
    
    const updatedSession: MovieSession = {
      ...session,
      currentSceneId: nextScene.id,
      history: [...session.history, choice.text],
      choices: [...session.choices, choice.text],
      scenes: { ...session.scenes, [nextScene.id]: nextScene }
    };
    
    setSession(updatedSession);
    setIsLoading(false);
    
    // Автосохранение
    localStorage.setItem('cinema-session-' + updatedSession.id, JSON.stringify(updatedSession));
  };
  
  // Копирование кода сессии
  const copySessionCode = () => {
    if (!session) return;
    const code = `${session.seed}:${session.premise}`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const currentScene = session ? session.scenes[session.currentSceneId] : null;
  
  return (
    <div className="min-h-screen font-serif relative overflow-hidden">
      {/* Фон */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary/10 to-transparent" />
      </div>
      
      {/* Header */}
      <header className="relative z-20 border-b border-border bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="flex justify-between items-center px-6 py-4">
          <EnergyButton variant="secondary" size="sm">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Link>
          </EnergyButton>
          
          {session && (
            <div className="flex items-center gap-2">
              <EnergyButton variant="secondary" size="sm" onClick={copySessionCode}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Скопировано!' : 'Код сессии'}
              </EnergyButton>
              <EnergyButton variant="secondary" size="sm" onClick={saveSession}>
                <Save className="w-4 h-4 mr-2" />
                Сохранить
              </EnergyButton>
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {!session ? (
            <div className="space-y-8">
              {/* Title */}
              <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                  <Film className="w-16 h-16 text-primary" />
                </div>
                <GlitchText className="text-4xl md:text-6xl font-black uppercase mb-6 text-ink">
                  Режим Кино
                </GlitchText>
                <p className="text-ink/70 text-lg max-w-2xl mx-auto font-serif italic">
                  Создайте уникальную интерактивную историю. Сделайте выборы и получите одну из множества концовок. 
                  Поделитесь кодом с друзьями - они могут пройти тот же путь!
                </p>
              </div>
              
              {/* Start Form */}
              <HologramCard variant="default" glowIntensity="high" className="p-8 animate-fade-up">
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-3 text-sm uppercase tracking-widest text-primary font-sans mb-3">
                      <Wand2 className="w-4 h-4" />
                      Завязка истории
                    </label>
                    <Textarea
                      value={premise}
                      onChange={(e) => setPremise(e.target.value)}
                      placeholder="Опишите начало истории... Например: Детектив расследует загадочное убийство в старом особняке..."
                      rows={4}
                      className="w-full p-4 bg-background/50 border-2 border-primary/20 focus:border-primary text-ink placeholder:text-ink/30 font-serif transition-all duration-300 outline-none resize-none book-input"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-3 text-sm uppercase tracking-widest text-primary font-sans mb-3">
                      <Sparkles className="w-4 h-4" />
                      Код сессии (опционально)
                    </label>
                    <Input
                      value={customSeed}
                      onChange={(e) => setCustomSeed(e.target.value)}
                      placeholder="Введите число для детерминированной генерации"
                      type="number"
                      className="w-full p-4 bg-background/50 border-2 border-primary/20 focus:border-primary text-ink placeholder:text-ink/30 font-serif transition-all duration-300 outline-none book-input"
                    />
                    <p className="text-xs text-ink/50 mt-2 font-serif">
                      Оставьте пустым для случайной генерации. Используйте одинаковый код с другом, чтобы получить одинаковые сцены!
                    </p>
                  </div>
                  
                  <EnergyButton 
                    type="button" 
                    variant="primary" 
                    className="w-full py-6 text-lg"
                    onClick={startNewGame}
                    disabled={!premise.trim() || isLoading}
                  >
                    <span className="flex items-center justify-center gap-3">
                      <Play className="w-6 h-6" />
                      Начать историю
                      <Film className="w-6 h-6" />
                    </span>
                  </EnergyButton>
                </div>
              </HologramCard>
              
              {/* Saved Sessions */}
              {savedSessions.length > 0 && (
                <div className="mt-12 animate-fade-up">
                  <h3 className="text-xl font-bold text-ink mb-4 flex items-center gap-2 font-serif">
                    <Save className="w-5 h-5" />
                    Сохраненные истории
                  </h3>
                  <div className="grid gap-4">
                    {savedSessions.map((savedSession) => (
                      <Card key={savedSession.id} className="bg-card/50 border-border hover:shadow-card transition-all duration-300">
                        <CardContent className="p-4 flex justify-between items-center">
                          <div>
                            <p className="text-ink font-serif italic">{savedSession.title}</p>
                            <p className="text-xs text-ink/50 font-sans">Seed: {savedSession.seed}</p>
                          </div>
                          <div className="flex gap-2">
                            <EnergyButton 
                              variant="secondary" 
                              size="sm"
                              onClick={() => setSession(savedSession)}
                            >
                              Продолжить
                            </EnergyButton>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              {/* Session Info */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-ink font-serif">{session.title}</h2>
                  <p className="text-sm text-ink/50 font-sans">Seed: {session.seed}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-ink/40 font-sans">Сцена {Object.keys(session.scenes).length} из 6</p>
                </div>
              </div>
              
              {/* Scene Display */}
              {currentScene && (
                <SceneDisplay 
                  scene={currentScene} 
                  onChoice={handleChoice}
                  isLoading={isLoading}
                />
              )}
              
              {/* Share Section */}
              {currentScene?.isEnding && (
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-6 rounded-lg animate-fade-up">
                  <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2 font-serif">
                    <Share2 className="w-5 h-5" />
                    Поделитесь с друзьями!
                  </h3>
                  <p className="text-ink/70 mb-4 font-serif">
                    Отправьте этот код другу, чтобы он мог пройти ту же историю:
                  </p>
                  <div className="bg-background/50 p-4 rounded font-mono text-primary select-all border border-primary/20">
                    {session.seed}:{session.premise}
                  </div>
                  <p className="text-xs text-ink/50 mt-4 font-serif">
                    Или просто скажите: &quot;Попробуй историю с seed {session.seed} и завязкой: {session.premise.substring(0, 50)}...&quot;
                  </p>
                </div>
              )}
              
              {/* Start New Button */}
              <div className="text-center pt-8">
                <EnergyButton variant="secondary" onClick={() => setSession(null)}>
                  <Film className="w-4 h-4 mr-2" />
                  Начать новую историю
                </EnergyButton>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
