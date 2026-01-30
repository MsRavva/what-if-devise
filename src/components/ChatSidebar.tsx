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
  Zap
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { HologramCard, EnergyButton, GlitchText } from '@/components/cyberpunk';

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
      const { data: { session } } = await supabase!.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase!
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
      const { error } = await supabase!
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
      <div className="w-16 border-r-2 border-cyan-400/30 bg-black/90 backdrop-blur flex flex-col items-center py-4 gap-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-10 h-10 border-2 border-cyan-400/50 bg-black/80 hover:bg-cyan-400/20 hover:border-cyan-400 transition-all duration-300 flex items-center justify-center text-cyan-400"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <Link href="/">
          <div className="w-10 h-10 border-2 border-pink-400/50 bg-black/80 hover:bg-pink-400/20 hover:border-pink-400 transition-all duration-300 flex items-center justify-center text-pink-400 cursor-pointer">
            <Home className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/what-if">
          <div className="w-10 h-10 border-2 border-green-400/50 bg-black/80 hover:bg-green-400/20 hover:border-green-400 transition-all duration-300 flex items-center justify-center text-green-400 cursor-pointer">
            <Plus className="w-5 h-5" />
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-80 border-r-2 border-cyan-400/30 bg-black/90 backdrop-blur flex flex-col">
      {/* Header */}
      <div className="p-4 border-b-2 border-cyan-400/30 flex items-center justify-between">
        <GlitchText className="text-lg font-black uppercase tracking-wider">
          Чаты
        </GlitchText>
        <button
          onClick={() => setIsCollapsed(true)}
          className="w-8 h-8 border border-cyan-400/50 bg-black/80 hover:bg-cyan-400/20 hover:border-cyan-400 transition-all duration-300 flex items-center justify-center text-cyan-400"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <EnergyButton variant="primary" className="w-full">
          <Link href="/what-if" className="flex items-center justify-center gap-2 w-full">
            <Zap className="w-4 h-4" />
            Новый чат
          </Link>
        </EnergyButton>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-2">
        {isLoading ? (
          <div className="p-4 text-center text-cyan-400/60 text-sm font-mono uppercase animate-quantum-flicker">
            Загрузка...
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm font-mono">
            Нет сохраненных чатов
          </div>
        ) : (
          <div className="space-y-2 pb-4">
            {sessions.map((session) => (
              <Link
                key={session.id}
                href={`/chat/${session.id}`}
                className={`block group relative transition-all duration-300 ${currentSessionId === session.id
                    ? 'bg-cyan-400/10 border-2 border-cyan-400/50'
                    : 'border border-gray-700/50 hover:border-cyan-400/30 hover:bg-cyan-400/5'
                  }`}
              >
                <div className="p-3 pr-10">
                  <div className="flex items-start gap-2">
                    <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${currentSessionId === session.id ? 'text-cyan-400' : 'text-gray-500'
                      }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-mono truncate ${currentSessionId === session.id ? 'text-cyan-400' : 'text-gray-300'
                        }`}>
                        {truncateText(session.question, 50)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 font-mono">
                        {formatDate(session.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => deleteSession(session.id, e)}
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-400/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer - На главную */}
      <div className="p-4 border-t-2 border-cyan-400/30">
        <EnergyButton variant="secondary" className="w-full">
          <Link href="/" className="flex items-center justify-center gap-2 w-full">
            <Home className="w-4 h-4" />
            На главную
          </Link>
        </EnergyButton>
      </div>
    </div>
  );
};
