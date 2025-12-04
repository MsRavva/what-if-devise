// Убедитесь, что в настройках проекта Supabase в панели управления (https://app.supabase.com/project/YOUR_PROJECT_ID/settings/api) в разделе 'URLs allowed for CORS' указаны все домены, с которых будет работать приложение (например, http://localhost:3000, https://your-app.vercel.app).
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Безопасное получение переменных окружения с fallback значениями
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://localhost:3000'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key'

// Создаем клиент только если переменные настроены правильно
let supabase: ReturnType<typeof createClient<Database>> | null = null

try {
  if (supabaseUrl.includes('supabase.co') && supabaseAnonKey !== 'dummy-key') {
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  } else {
    console.warn('Supabase не настроен. Используются заглушки для разработки.')
    // Создаем фиктивный клиент для разработки, но с более корректной типизацией и поведением
    supabase = {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase не настроен' }}),
        signUp: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase не настроен' } }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        // Добавляем методы, которые могут быть использованы в приложении
        resetPasswordForEmail: () => Promise.resolve({ error: null }),
        updateUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase не настроен' } })
      },
      from: (table: string) => ({
        select: (columns?: string) => ({
          eq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
          neq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
          gt: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
          gte: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
          lt: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
          lte: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
          like: (column: string, pattern: string) => Promise.resolve({ data: [], error: null }),
          ilike: (column: string, pattern: string) => Promise.resolve({ data: [], error: null }),
          in: (column: string, values: any[]) => Promise.resolve({ data: [], error: null }),
          is: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
          order: () => ({
            eq: (column: string, value: any) => Promise.resolve({ data: [], error: null })
          })
        }),
        insert: (data: any) => Promise.resolve({ data: null, error: { message: 'Supabase не настроен' } }),
        update: (data: any) => ({
          eq: (column: string, value: any) => Promise.resolve({ data: null, error: { message: 'Supabase не настроен' } })
        }),
        delete: () => ({
          eq: (column: string, value: any) => Promise.resolve({ data: null, error: { message: 'Supabase не настроен' } })
        })
      }),
      rpc: (fn: string, args?: any) => Promise.resolve({ data: [], error: null })
    } as any
  }
} catch (error) {
  console.error('Ошибка инициализации Supabase:', error)
  supabase = null
}

export { supabase }

// Функция для создания серверного клиента Supabase с возможностью аутентификации
export function createServerSupabaseClient(headers?: Headers) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables: SUPABASE_SERVICE_ROLE_KEY is required');
  }

  const supabaseServer = createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  return supabaseServer;
}

// Функция для получения аутентифицированного пользователя из заголовков запроса
export async function getAuthenticatedUser(headers: Headers) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required');
  }

  const newClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  
  const authHeader = headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
  
  if (!token) {
    throw new Error('Authentication token is required');
  }

 try {
    const { data, error } = await newClient.auth.getUser(token);
    
    console.log('Supabase getUser result - user:', data?.user, 'error:', error);
    
    if (error || !data?.user) {
      if (error && (error.status === 401 || error.message.toLowerCase().includes('auth'))) {
        throw new Error('Authentication token is required');
      }
      throw new Error('Authentication error: ' + error?.message || 'No user found');
    }

    return data.user;
  } catch (error: any) {
    console.error('Supabase authentication error:', error);
    if (error.status === 401 || (error.message && error.message.toLowerCase().includes('auth'))) {
      throw new Error('Authentication token is required');
    }
    throw error;
  }
}

// Функция для сохранения истории
export async function saveStory(userId: string, title: string, content: string) {
  if (!supabase) {
    throw new Error('Supabase не настроен')
  }

  const { data, error } = await supabase
    .from('stories')
    .insert([{ user_id: userId, title, content }])
    .select('id')
    .single()

  if (error) {
    console.error('Supabase error:', error);
    throw error
  }

  return (data as { id: string }).id
}

// Функция для получения историй пользователя с подсчетом сценариев
export async function getUserStories(userId: string) {
  if (!supabase) {
    throw new Error('Supabase не настроен')
  }

  // Запрос к таблице историй
  const { data: stories, error: storiesError } = await supabase
    .from('stories')
    .select(`
      id,
      title,
      content,
      created_at,
      updated_at,
      scenarios(count)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (storiesError) {
    console.error('Supabase error:', storiesError);
    throw storiesError
  }

  // Форматируем данные, извлекая количество сценариев из объекта сount
  const formattedStories = stories.map(story => ({
    id: story.id,
    title: story.title,
    content: story.content,
    created_at: story.created_at,
    updated_at: story.updated_at,
    scenarios_count: story.scenarios[0]?.count || 0 // Извлекаем количество сценариев
  }))

  return formattedStories
}

// Функция для сохранения сценария
export async function saveScenario(storyId: string, userId: string, question: string, aiResponse: string) {
  if (!supabase) {
    throw new Error('Supabase не настроен')
 }

  console.log('Сохраняем сценарий для storyId:', storyId, 'и userId:', userId);
  console.log('Сохранение сценария:', { storyId, userId, question, aiResponse });

  const { data, error } = await supabase
    .from('scenarios')
    .insert([{ story_id: storyId, user_id: userId, question, ai_response: aiResponse }])
    .select('id')
    .single()

  console.log('Сохраненный сценарий ID:', data?.id);
  console.log('Результат сохранения сценария:', { id: data?.id, error });

  if (error) {
    console.error('Supabase error:', error);
    throw error
  }

  return (data as { id: string }).id
}

// Функция для создания новой сессии чата
export async function createChatSession(userId: string, title: string) {
  if (!supabase) {
    throw new Error('Supabase не настроен')
 }

  const { data, error } = await supabase
    .from('chat_sessions')
    .insert([{ user_id: userId, title }])
    .select('id')
    .single()

  if (error) {
    console.error('Supabase error:', error);
    throw error
  }

  return (data as { id: string }).id
}

// Функция для сохранения сообщения в чате
export async function saveChatMessage(sessionId: string, userId: string, role: 'user' | 'assistant', content: string) {
  if (!supabase) {
    throw new Error('Supabase не настроен')
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .insert([{ session_id: sessionId, user_id: userId, role, content }])
    .select('id')
    .single()

  if (error) {
    console.error('Supabase error:', error);
    throw error
  }

  return (data as { id: string }).id
}

// Функция для получения сообщений из сессии чата
export async function getChatMessages(sessionId: string) {
  if (!supabase) {
    throw new Error('Supabase не настроен')
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('timestamp', { ascending: true })

  if (error) {
    console.error('Supabase error:', error);
    throw error
  }

  return data as Array<{
    id: string
    session_id: string
    user_id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }>
}
