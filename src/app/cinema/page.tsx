'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Play, Film, BookOpen, Sparkles, Wand2, Save, Copy, Check } from 'lucide-react';
import { HologramCard, GlitchText, EnergyButton } from '@/components/cyberpunk';
import { CinemaScene, CinemaChoice } from '@/types/ai-types';
import { useToast } from '@/components/toast-provider';

// Типы для режима кино
interface MovieScene extends CinemaScene {
  id: string; // Добавляем id для совместимости с текущим кодом UI
}

interface MovieSession {
  id: string;
  title: string;
  premise: string;
  currentSceneId: string;
  history: string[];
  scenes: Record<string, MovieScene>;
}

// Компонент для отображения сцены
const SceneDisplay = ({ scene, onChoice, isLoading }: { 
  scene: MovieScene; 
  onChoice: (choice: CinemaChoice) => void;
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
  const [isLoading, setIsLoading] = useState(false);
  const [savedSessions, setSavedSessions] = useState<MovieSession[]>([]);
  const toast = useToast();
  
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
    toast.success("История сохранена локально");
  }, [session, savedSessions, toast]);
  
  // Начало новой игры
  const startNewGame = async () => {
    if (!premise.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'cinema',
          story: premise
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start story');
      }

      const sceneData: CinemaScene = await response.json();
      const sceneId = 'scene-1';
      
      const newScene: MovieScene = {
        ...sceneData,
        id: sceneId
      };
      
      const newSession: MovieSession = {
        id: Date.now().toString(),
        title: premise.substring(0, 50) + (premise.length > 50 ? '...' : ''),
        premise,
        currentSceneId: sceneId,
        history: [],
        scenes: { [sceneId]: newScene }
      };
      
      setSession(newSession);
    } catch (error: any) {
      console.error('Error starting game:', error);
      toast.error(error.message || "Не удалось начать историю");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Обработка выбора игрока
  const handleChoice = async (choice: CinemaChoice) => {
    if (!session) return;
    
    setIsLoading(true);
    
    try {
      const newHistory = [...session.history, choice.text];
      
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'cinema',
          story: session.premise,
          history: newHistory
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate next scene');
      }

      const sceneData: CinemaScene = await response.json();
      const nextSceneId = `scene-${Object.keys(session.scenes).length + 1}`;
      
      const nextScene: MovieScene = {
        ...sceneData,
        id: nextSceneId
      };
      
      const updatedSession: MovieSession = {
        ...session,
        currentSceneId: nextSceneId,
        history: newHistory,
        scenes: { ...session.scenes, [nextSceneId]: nextScene }
      };
      
      setSession(updatedSession);
      
      // Автосохранение
      localStorage.setItem('cinema-session-' + updatedSession.id, JSON.stringify(updatedSession));
    } catch (error: any) {
      console.error('Error in handleChoice:', error);
      toast.error(error.message || "Не удалось загрузить следующую сцену");
    } finally {
      setIsLoading(false);
    }
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
                  
                  <EnergyButton 
                    type="button" 
                    variant="primary" 
                    className="w-full py-6 text-lg"
                    onClick={startNewGame}
                    disabled={!premise.trim() || isLoading}
                  >
                    <span className="flex items-center justify-center gap-3">
                      <Play className="w-6 h-6" />
                      {isLoading ? 'Генерация...' : 'Начать историю'}
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
                </div>
                <div className="text-right">
                  <p className="text-sm text-ink/40 font-sans">Сцена {Object.keys(session.scenes).length}</p>
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
