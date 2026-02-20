'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { WhatIfResponse } from '@/types/ai-types';
import { ThemeToggle } from '@/components/theme-toggle';
import { Send, Sparkles, User, Loader2, Home, Zap, BookOpen } from 'lucide-react';
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
  const [scenarioGenerated, setScenarioGenerated] = useState(() => {
    // Проверяем localStorage при инициализации
    if (isNewSession && typeof window !== 'undefined') {
      const saved = localStorage.getItem(`scenario-generated-${sessionId}`);
      return saved === 'true';
    }
    return !isNewSession;
  });
  const [generatedScenario, setGeneratedScenario] = useState(() => {
    // Восстанавливаем сценарий из localStorage если он есть
    if (isNewSession && typeof window !== 'undefined') {
      const saved = localStorage.getItem(`scenario-text-${sessionId}`);
      return saved || '';
    }
    return isNewSession ? '' : initialStory;
  });
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
        `${msg.role === 'user' ? 'Летописец' : 'Ассистент'}: ${msg.content}`
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
      
      // Получаем токен авторизации (опционально для гостевого режима)
      let token = null;
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token;
      }

      // Вызываем API endpoint вместо прямого вызова функции
      const headers: HeadersInit = { 
        'Content-Type': 'application/json'
      };
      
      // Добавляем токен только если пользователь авторизован
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const apiResponse = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers,
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
          // Получаем токен авторизации (опционально для гостевого режима)
          let token = null;
          if (supabase) {
            const { data: { session } } = await supabase.auth.getSession();
            token = session?.access_token;
          }

          // Вызываем API endpoint вместо прямого вызова функции
          const headers: HeadersInit = { 
            'Content-Type': 'application/json'
          };
          
          // Добавляем токен только если пользователь авторизован
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const apiResponse = await fetch('/api/generate-scenario', {
            method: 'POST',
            headers,
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
            
            // Сохраняем в localStorage чтобы избежать повторной генерации при обновлении
            if (typeof window !== 'undefined') {
              localStorage.setItem(`scenario-generated-${sessionId}`, 'true');
              localStorage.setItem(`scenario-text-${sessionId}`, response.scenario);
            }
            
            setMessages([
              { role: 'assistant', content: `Вот ваш сгенерированный сценарий:\n\n${response.scenario}` },
              { role: 'assistant', content: `Вопрос: ${initialQuestion}\n\nТеперь вы можете задать дополнительные вопросы или уточнить детали сценария.` }
            ]);

            // Сохраняем сценарий только если пользователь авторизован
            if (token) {
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
                
                // Очищаем localStorage после успешного сохранения в базу
                if (typeof window !== 'undefined') {
                  localStorage.removeItem(`scenario-generated-${sessionId}`);
                  localStorage.removeItem(`scenario-text-${sessionId}`);
                }
              } catch (saveError) {
                console.error('Ошибка сохранения сценария:', saveError);
              }
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
    <div className="min-h-screen font-serif relative overflow-hidden flex flex-col">
      {/* Мягкий фон с текстурой бумаги задан в body */}
      
      <div className="flex h-screen relative z-10 overflow-hidden">
        {/* Sidebar */}
        <ChatSidebar currentSessionId={sessionId} />

        {/* Main Chat Area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Book-style Header */}
          <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-sm shadow-sm">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <div className="text-primary">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
          <h2 className="text-lg font-bold italic text-ink">
                    Диалог
                  </h2>
                  <p className="text-[10px] text-ink/60 uppercase tracking-[0.2em] font-sans">
                    Развитие сценария
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/" className="book-button-secondary py-1 px-3 text-xs flex items-center gap-2">
                  <Home className="w-3 h-3" />
                  Библиотека
                </Link>
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-4 py-8 animate-fade-in">
            <div className="container max-w-3xl mx-auto space-y-10">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-6 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar/Signifier */}
                  <div className={`flex-shrink-0 w-10 h-10 border rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'border-primary/20 bg-primary/5 text-primary' 
                      : 'border-ink/20 bg-ink/5 text-ink'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`book-card p-5 ${message.role === 'user' ? 'bg-primary/5 border-primary/10' : ''}`}>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap break-words italic text-ink">
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-10 h-10 border border-ink/20 bg-ink/5 rounded-full flex items-center justify-center animate-pulse">
                    <Zap className="w-5 h-5 text-ink" />
                  </div>
                  <div className="flex-1 max-w-[80%]">
                    <div className="book-card p-4 border-dashed">
                      <div className="flex items-center gap-3 text-xs text-ink/40 italic">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Генерация ответа...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Book-style Input Area */}
          <div className="sticky bottom-0 border-t border-border bg-card/90 backdrop-blur-md pb-6 pt-4 px-4">
            <div className="container max-w-3xl mx-auto">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
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
                    placeholder="Напишите ваш вопрос..."
                    className="book-input min-h-[50px] max-h-[150px] w-full resize-none text-ink placeholder:text-ink/30 italic"
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="book-button h-12 w-12 flex items-center justify-center rounded-full"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
<div className="mt-3 text-[10px] text-center text-ink/40 uppercase tracking-widest font-sans">
                Enter - отправить • Shift+Enter - новая строка
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
