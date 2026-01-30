'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { WhatIfResponse } from '@/types/ai-types';
import { ThemeToggle } from '@/components/theme-toggle';
import { Send, Sparkles, User, Loader2, Home, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ChatSidebar } from './ChatSidebar';
import { 
  HologramCard, 
  GlitchText, 
  EnergyButton,
  AIBrainVisualization 
} from '@/components/cyberpunk';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  initialStory: string;
  initialQuestion: string;
  sessionId: string;
  isNewSession?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  initialStory, 
  initialQuestion, 
  sessionId,
  isNewSession = false 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scenarioGenerated, setScenarioGenerated] = useState(!isNewSession);
  const [generatedScenario, setGeneratedScenario] = useState(isNewSession ? '' : initialStory);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: inputMessage };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    textareaRef.current?.focus();

    try {
      // Берем только последние 5 сообщений для контекста
      const recentMessages = updatedMessages.slice(-5);
      const chatHistory = recentMessages.map(msg => 
        `${msg.role === 'user' ? 'Пользователь' : 'Ассистент'}: ${msg.content}`
      ).join('\n\n');
      
      const request = {
        story: generatedScenario || initialStory,
        whatIfQuestion: `Ты - креативный писатель, который помогает развивать альтернативные сценарии.

Исходный сценарий:
${generatedScenario || initialStory}

История диалога:
${chatHistory}

Задача: Ответь на последний вопрос пользователя "${inputMessage}", продолжая и развивая сценарий. НЕ повторяй то, что уже было сказано. Добавь новые детали, события или повороты сюжета. Будь креативным и интересным.`
      };
      
      // Получаем токен авторизации
      const { data: { session } } = await supabase!.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('Требуется авторизация');
      }

      // Вызываем API endpoint вместо прямого вызова функции
      const apiResponse = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          story: request.story,
          question: request.whatIfQuestion
        })
      });

      if (!apiResponse.ok) {
        throw new Error('Ошибка при генерации ответа');
      }

      const response: WhatIfResponse = await apiResponse.json();
      
      if (response.success) {
        const assistantMessage: Message = { role: 'assistant', content: response.scenario };
        setMessages([...updatedMessages, assistantMessage]);
      } else {
        const errorMessage: Message = {
          role: 'assistant',
          content: `Ошибка при генерации ответа: ${response.error || 'Неизвестная ошибка'}`
        };
        setMessages([...updatedMessages, errorMessage]);
      }
    } catch (error) {
      console.error('Ошибка при генерации ответа:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Произошла ошибка при генерации ответа. Пожалуйста, попробуйте еще раз.'
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const generateInitialScenario = async () => {
      if (isNewSession && !scenarioGenerated) {
        setIsLoading(true);
        setMessages([
          { role: 'assistant', content: 'Генерирую альтернативный сценарий...' }
        ]);

        try {
          // Получаем токен авторизации
          const { data: { session } } = await supabase!.auth.getSession();
          const token = session?.access_token;

          if (!token) {
            throw new Error('Требуется авторизация');
          }

          // Вызываем API endpoint вместо прямого вызова функции
          const apiResponse = await fetch('/api/generate-scenario', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              story: initialStory,
              question: initialQuestion
            })
          });

          if (!apiResponse.ok) {
            throw new Error('Ошибка при генерации сценария');
          }

          const response: WhatIfResponse = await apiResponse.json();

          if (response.success) {
            setGeneratedScenario(response.scenario);
            setScenarioGenerated(true);
            setMessages([
              { role: 'assistant', content: `Вот ваш сгенерированный сценарий:\n\n${response.scenario}` },
              { role: 'assistant', content: `Вопрос: ${initialQuestion}\n\nТеперь вы можете задать дополнительные вопросы или уточнить детали сценария.` }
            ]);

            try {
              await fetch('/api/scenario', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  id: sessionId,
                  story: initialStory,
                  question: initialQuestion,
                  scenario: response.scenario
                })
              });
            } catch (saveError) {
              console.error('Ошибка сохранения сценария:', saveError);
            }
          } else {
            setMessages([
              { role: 'assistant', content: `Ошибка при генерации сценария: ${response.error || 'Неизвестная ошибка'}` }
            ]);
          }
        } catch (error) {
          console.error('Ошибка при генерации сценария:', error);
          setMessages([
            { role: 'assistant', content: 'Произошла ошибка при генерации сценария. Пожалуйста, попробуйте еще раз.' }
          ]);
        } finally {
          setIsLoading(false);
        }
      } else if (!isNewSession) {
        setMessages([
          { role: 'assistant', content: `Вот ваш сгенерированный сценарий:\n\n${initialStory}` },
          { role: 'assistant', content: `Вопрос: ${initialQuestion}\n\nТеперь вы можете задать дополнительные вопросы или уточнить детали сценария.` }
        ]);
      }
    };

    generateInitialScenario();
  }, [isNewSession, scenarioGenerated, initialStory, initialQuestion, sessionId]);

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden neural-particles">
      {/* Киберпанк фон */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Голографические геометрические фигуры */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 transform rotate-45 opacity-15 animate-hologram" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 transform -rotate-12 opacity-20 animate-energy-flow" />
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 transform rotate-12 opacity-10 animate-quantum-flicker" />
        
        {/* Энергетические линии */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-energy-flow" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-400/30 to-transparent animate-energy-flow" style={{ animationDirection: 'reverse' }} />
      </div>

      <div className="flex h-screen relative z-10">
        {/* Sidebar */}
        <ChatSidebar currentSessionId={sessionId} />

        {/* Main Chat Area */}
        <div className="flex flex-col flex-1">
          {/* Киберпанк Header */}
          <header className="sticky top-0 z-20 border-b-2 border-cyan-400/50 bg-black/90 backdrop-blur-sm">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <AIBrainVisualization size="sm" />
                <div>
                  <GlitchText className="text-lg font-black uppercase tracking-wider">
                    Чат по сценарию
                  </GlitchText>
                  <p className="text-xs text-cyan-400 uppercase tracking-widest animate-quantum-flicker">
                    AI Conversation
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <EnergyButton variant="secondary" size="sm">
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Home
                  </Link>
                </EnergyButton>
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="container max-w-4xl mx-auto space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 animate-data-pulse' 
                      : 'bg-gradient-to-br from-cyan-400 to-pink-500 animate-hologram'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-6 h-6 text-black" />
                    ) : (
                      <Sparkles className="w-6 h-6 text-black" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 max-w-[85%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <HologramCard 
                      variant={message.role === 'user' ? 'energy' : 'default'}
                      className="p-4"
                    >
                      <div className="text-sm leading-relaxed whitespace-pre-wrap break-words font-mono">
                        {message.content}
                      </div>
                    </HologramCard>
                  </div>
                </div>
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center animate-quantum-spin">
                    <Zap className="w-6 h-6 text-black" />
                  </div>
                  <div className="flex-1 max-w-[85%]">
                    <HologramCard variant="neural" className="p-4">
                      <div className="flex items-center gap-3 text-sm text-cyan-400 font-mono uppercase">
                        <div className="quantum-loader w-6 h-6" />
                        <GlitchText intensity="low">Генерирую ответ...</GlitchText>
                      </div>
                    </HologramCard>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Киберпанк Input Area */}
          <div className="sticky bottom-0 border-t-2 border-cyan-400/50 bg-black/90 backdrop-blur-sm">
            <div className="container max-w-4xl mx-auto px-4 py-4">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Задайте вопрос или уточните детали сценария..."
                    className="min-h-[60px] max-h-[200px] resize-none neural-input bg-black/80 border-2 border-cyan-400/30 focus:border-cyan-400 text-white placeholder:text-gray-500 font-mono transition-all duration-300"
                    disabled={isLoading}
                  />
                </div>
                <EnergyButton
                  variant="primary"
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="h-[60px] w-[60px] flex items-center justify-center"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Send className="w-6 h-6" />
                  )}
                </EnergyButton>
              </div>
              <div className="mt-3 text-xs text-center text-cyan-400/60 uppercase tracking-wider font-mono">
                Enter для отправки • Shift+Enter для новой строки
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
