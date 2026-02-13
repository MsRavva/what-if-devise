'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ChatSession {
  id: string;
  question: string;
  created_at: string;
}

interface ChatSidebarProps {
  currentSessionId?: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ currentSessionId }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      if (!supabase) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('scenarios')
        .select('id, question, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Ошибка загрузки сессий:', error);
        return;
      }

      setSessions(data || []);
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Удалить этот чат?')) return;

    try {
      if (!supabase) return;
      
      const { error } = await supabase
        .from('scenarios')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Ошибка удаления:', error);
        return;
      }

      setSessions(sessions.filter(s => s.id !== id));

      // Если удаляем текущую сессию, перенаправляем на главную
      if (id === currentSessionId) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays < 7) return `${diffDays} дн назад`;

    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isCollapsed) {
    return (
      <div className="w-16 border-r border-border bg-card/90 backdrop-blur flex flex-col items-center py-4 gap-4 shadow-sm">
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-10 h-10 border border-primary/30 bg-card hover:bg-primary/10 hover:border-primary transition-all duration-300 flex items-center justify-center text-primary rounded-md"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <Link href="/">
          <div className="w-10 h-10 border border-primary/30 bg-card hover:bg-primary/10 hover:border-primary transition-all duration-300 flex items-center justify-center text-primary rounded-md cursor-pointer">
            <Home className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/what-if">
          <div className="w-10 h-10 border border-primary/30 bg-card hover:bg-primary/10 hover:border-primary transition-all duration-300 flex items-center justify-center text-primary rounded-md cursor-pointer">
            <Plus className="w-5 h-5" />
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-border bg-card/90 backdrop-blur flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-card/50">
        <h2 className="text-lg font-bold uppercase tracking-wider text-ink font-serif">
          Чаты
        </h2>
        <button
          onClick={() => setIsCollapsed(true)}
          className="w-8 h-8 border border-primary/30 bg-card hover:bg-primary/10 hover:border-primary transition-all duration-300 flex items-center justify-center text-primary rounded-md"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Link href="/what-if">
          <button className="book-button w-full">
            <BookOpen className="w-4 h-4" />
            Новый чат
          </button>
        </Link>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-2">
        {isLoading ? (
          <div className="p-4 text-center text-primary/60 text-sm font-sans uppercase">
            Загрузка...
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-4 text-center text-ink/50 text-sm font-serif italic">
            Нет сохраненных чатов
          </div>
        ) : (
          <div className="space-y-2 pb-4">
            {sessions.map((session) => (
              <Link
                key={session.id}
                href={`/chat/${session.id}`}
                className={`block group relative transition-all duration-300 rounded-md ${currentSessionId === session.id
                    ? 'bg-primary/10 border border-primary/50'
                    : 'border border-border/50 hover:border-primary/30 hover:bg-primary/5'
                  }`}
              >
                <div className="p-3 pr-10">
                  <div className="flex items-start gap-2">
                    <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${currentSessionId === session.id ? 'text-primary' : 'text-ink/40'
                      }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-serif truncate ${currentSessionId === session.id ? 'text-primary font-medium' : 'text-ink'
                        }`}>
                        {truncateText(session.question, 50)}
                      </p>
                      <p className="text-xs text-ink/50 mt-1 font-sans">
                        {formatDate(session.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => deleteSession(session.id, e)}
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 flex items-center justify-center text-red-400/70 hover:text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer - На главную */}
      <div className="p-4 border-t border-border bg-card/50">
        <Link href="/">
          <button className="book-button-secondary w-full">
            <Home className="w-4 h-4" />
            На главную
          </button>
        </Link>
      </div>
    </div>
  );
};
