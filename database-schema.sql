-- What If Device Database Schema
-- Выполните эти команды в SQL Editor вашего Supabase проекта

-- Создаем таблицу для историй
create table public.stories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Создаем таблицу для сценариев "что если"
create table public.scenarios (
  id uuid default gen_random_uuid() primary key,
  story_id uuid references public.stories not null,
  user_id uuid references auth.users not null,
  question text not null,
  ai_response text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Настраиваем Row Level Security для stories
alter table public.stories enable row level security;

-- Политики для stories
create policy "Users can view own stories" on public.stories
  for select using (auth.uid() = user_id);

create policy "Users can insert own stories" on public.stories
  for insert with check (auth.uid() = user_id);

create policy "Users can update own stories" on public.stories
  for update using (auth.uid() = user_id);

create policy "Users can delete own stories" on public.stories
  for delete using (auth.uid() = user_id);

-- Настраиваем Row Level Security для scenarios
alter table public.scenarios enable row level security;

-- Политики для scenarios
create policy "Users can view own scenarios" on public.scenarios
  for select using (auth.uid() = user_id);

create policy "Users can insert own scenarios" on public.scenarios
  for insert with check (auth.uid() = user_id);

create policy "Users can update own scenarios" on public.scenarios
  for update using (auth.uid() = user_id);

create policy "Users can delete own scenarios" on public.scenarios
  for delete using (auth.uid() = user_id);

-- Создаем функцию для автоматического обновления updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Создаем триггер для автоматического обновления updated_at в stories
create trigger on_stories_updated
  before update on public.stories
  for each row execute procedure public.handle_updated_at();

-- Создаем индексы для лучшей производительности
create index stories_user_id_idx on public.stories(user_id);
create index stories_created_at_idx on public.stories(created_at desc);
create index scenarios_story_id_idx on public.scenarios(story_id);
create index scenarios_user_id_idx on public.scenarios(user_id);
create index scenarios_created_at_idx on public.scenarios(created_at desc);

-- Комментарии к таблицам
comment on table public.stories is 'Пользовательские истории для генерации сценариев';
comment on table public.scenarios is 'Сгенерированные ИИ сценарии "что если"';

-- Комментарии к столбцам
comment on column public.stories.title is 'Заголовок истории';
comment on column public.stories.content is 'Полный текст истории';
comment on column public.scenarios.question is 'Вопрос "что было бы, если..."';
comment on column public.scenarios.ai_response is 'Ответ ИИ на вопрос';

-- Создаем таблицу для сессий чата
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT DEFAULT 'New Chat',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу для сообщений чата
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Настраиваем Row Level Security для chat_sessions
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Политики для chat_sessions
CREATE POLICY "Users can view own chat sessions" ON public.chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat sessions" ON public.chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions" ON public.chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat sessions" ON public.chat_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Настраиваем Row Level Security для chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Политики для chat_messages
CREATE POLICY "Users can view own chat messages" ON public.chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat messages" ON public.chat_messages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat messages" ON public.chat_messages
  FOR DELETE USING (auth.uid() = user_id);

-- Создаем триггер для автоматического обновления updated_at в chat_sessions
CREATE TRIGGER on_chat_sessions_updated
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Создаем индексы для лучшей производительности
CREATE INDEX chat_sessions_user_id_idx ON public.chat_sessions(user_id);
CREATE INDEX chat_sessions_created_at_idx ON public.chat_sessions(created_at DESC);
CREATE INDEX chat_messages_session_id_idx ON public.chat_messages(session_id);
CREATE INDEX chat_messages_user_id_idx ON public.chat_messages(user_id);
CREATE INDEX chat_messages_timestamp_idx ON public.chat_messages(timestamp DESC);