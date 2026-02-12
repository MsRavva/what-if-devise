import { createServerSupabaseClient } from '@/lib/supabase';
import ChatInterface from '@/components/ChatInterface';
import { headers } from 'next/headers';

interface ScenarioData {
  id: string;
  story: string;
  question: string;
  user_id: string;
}

interface ScenarioRow {
  id: string;
  ai_response: string;
  question: string;
  user_id: string;
}

const ChatPage = async ({ 
  params, 
  searchParams 
}: { 
  params: { id: string };
  searchParams: { story?: string; question?: string };
}) => {
  let scenarioData: ScenarioData | null = null;
  let error: string | null = null;
  let isNewSession = false;

  // Проверяем, есть ли параметры в URL (новая сессия)
  if (searchParams.story && searchParams.question) {
    // Это новая сессия, используем данные из URL
    isNewSession = true;
    scenarioData = {
      id: params.id,
      story: decodeURIComponent(searchParams.story),
      question: decodeURIComponent(searchParams.question),
      user_id: '' // Будет заполнено на клиенте
    };
  } else {
    // Это существующая сессия, загружаем из базы данных
    try {
      const supabase = createServerSupabaseClient(headers());
      
      // Если Supabase не настроен, показываем ошибку
      if (!supabase) {
        return <div className="container mx-auto p-4">Ошибка: База данных не настроена. Пожалуйста, создайте новый сценарий.</div>;
      }
      
      const id = params.id;
      console.log('Поиск сценария с id:', id);

      // Сначала проверяем, существует ли сценарий с указанным id
      const { data: scenarioExists, error: fetchError } = await supabase
        .from('scenarios')
        .select('id, user_id')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) {
        console.error('Ошибка при проверке существования сценария:', fetchError);
        throw new Error('Ошибка при проверке сценария');
      }

      if (!scenarioExists) {
        console.error(`Сценарий с id ${id} не найден`);
        return <div className="container mx-auto p-4">Ошибка: Сценарий не найден</div>;
      }

      // Если сценарий существует и принадлежит пользователю, получаем полные данные
      const { data: scenarioRow, error: supabaseError } = await supabase
        .from('scenarios')
        .select('id, ai_response, question, user_id')
        .eq('id', id)
        .maybeSingle();

      if (supabaseError) {
        console.error('Ошибка Supabase при получении данных сценария:', supabaseError);
        throw new Error(supabaseError.message);
      }

      if (!scenarioRow) {
        console.error(`Полные данные для сценария с id ${id} не найдены`);
        return <div className="container mx-auto p-4">Ошибка: Данные сценария не найдены</div>;
      }

      console.log('Сценарий найден с id:', scenarioRow.id);
      // Преобразуем данные под нужный формат
      scenarioData = {
        id: scenarioRow.id,
        story: scenarioRow.ai_response,
        question: scenarioRow.question,
        user_id: scenarioRow.user_id
      };
    } catch (err) {
      error = err instanceof Error ? err.message : 'Неизвестная ошибка';
      console.error('Ошибка загрузки сценария:', err, 'с id:', params.id);
    }
  }

  if (error || !scenarioData) {
    return <div className="container mx-auto p-4">Ошибка: {error || 'Сценарий не найден'}</div>;
  }

  return (
    <ChatInterface 
      initialStory={scenarioData.story} 
      initialQuestion={scenarioData.question}
      sessionId={scenarioData.id}
      isNewSession={isNewSession}
    />
  );
};

export default ChatPage;