'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  ChevronLeft,
  ChevronRight,
  Home
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
      <div className="w-16 border-r border-border/40 bg-background/95 backdrop-blur flex flex-col items-center py-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Home className="w-5 h-5" />
          </Button>
        </Link>
        <Link href="/what-if">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Plus className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-border/40 bg-background/95 backdrop-blur flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/40 flex items-center justify-between">
        <h2 className="font-semibold text-lg">Чаты</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(true)}
          className="rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Link href="/what-if" className="w-full">
          <Button className="w-full bg-gradient-to-br from-primary to-accent hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4 mr-2" />
            Новый чат
          </Button>
        </Link>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-2">
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            Загрузка...
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            Нет сохраненных чатов
          </div>
        ) : (
          <div className="space-y-1 pb-4">
            {sessions.map((session) => (
              <Link
                key={session.id}
                href={`/chat/${session.id}`}
                className={`block group relative rounded-lg transition-colors ${
                  currentSessionId === session.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="p-3 pr-10">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {truncateText(session.question, 50)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(session.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => deleteSession(session.id, e)}
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 rounded-md"
                >
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/40">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="w-4 h-4 mr-2" />
            На главную
          </Button>
        </Link>
      </div>
    </div>
  );
};
