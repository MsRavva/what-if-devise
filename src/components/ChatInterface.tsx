'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { WhatIfResponse } from '@/types/ai-types';
import { ThemeToggle } from '@/components/theme-toggle';
import { Send, Sparkles, User, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ChatSidebar } from './ChatSidebar';

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
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-background/80">
      {/* Sidebar */}
      <ChatSidebar currentSessionId={sessionId} />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Чат по сценарию
              </h1>
            </div>
            <ThemeToggle />
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
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-br from-primary to-accent'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Sparkles className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div className={`flex-1 max-w-[85%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                    : 'bg-muted/50 border border-border/50 text-foreground'
                }`}>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-accent">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 max-w-[85%]">
                <div className="rounded-2xl px-4 py-3 bg-muted/50 border border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Генерирую ответ...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-2 items-end">
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
                className="min-h-[60px] max-h-[200px] resize-none pr-12 rounded-2xl border-border/50 focus:border-primary/50 transition-colors"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              size="icon"
              className="h-[60px] w-[60px] rounded-2xl bg-gradient-to-br from-primary to-accent hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <div className="mt-2 text-xs text-center text-muted-foreground">
            Нажмите Enter для отправки, Shift+Enter для новой строки
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
