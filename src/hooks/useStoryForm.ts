import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, saveScenario } from '@/lib/supabase';

interface StoryFormData {
  title: string;
  scenario: string;
 question: string;
  description: string;
}

interface UseStoryFormProps {
  initialData?: {
    id: string;
    title: string;
    scenario: string;
    question: string;
    description: string;
  };
}

interface FormState {
  loading: boolean;
  progress: string;
  response: string;
  error: string;
}

export const useStoryForm = ({ initialData }: UseStoryFormProps = {}) => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [question, setQuestion] = useState('');
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    progress: '',
    response: '',
    error: ''
  });

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setStoryContent(initialData.scenario || '');
      setQuestion(initialData.question || '');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;
    if (!user) {
      setFormState(prev => ({ ...prev, error: 'Пользователь не аутентифицирован', response: '' }));
      return;
    }

    setFormState(prev => ({ ...prev, loading: true, progress: 'Processing request...', response: '', error: '' }));

    try {
      // Получаем сессию пользователя для аутентификации
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }
      let { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error('Ошибка получения сессии: ' + sessionError.message);
      }
      
      // Проверяем, нуждается ли сессия в обновлении
      if (!session || !session.access_token) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          throw new Error('Ошибка обновления сессии: ' + refreshError.message);
        }
        session = refreshData.session;
      }
      
      // Проверяем, что токен не пустой
      if (!session?.access_token) {
        throw new Error('Токен аутентификации недоступен');
      }
      
      // Вызываем серверный API-маршрут вместо прямого вызова generateScenario
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          story: storyContent,
          question: question
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate scenario');
      }

      const result = await response.json();
      
      // Добавляем лог для проверки полученного id
      console.log('Response from /api/generate-scenario:', result);
      
      if (result.scenario) {
        setFormState(prev => ({ ...prev, response: result.scenario, progress: 'Generation completed!', error: '' }));
        
        // Используем id из ответа /api/generate-scenario для перенаправления
        const { id: scenarioId } = result;
        
        // Лог для проверки извлеченного id
        console.log('Extracted scenarioId:', scenarioId);
        
        if (scenarioId) {
          // Перенаправляем на страницу чата с ID сгенерированного сценария
          // Убедимся, что передаем только строковое значение
          router.push(`/chat/${String(scenarioId)}`);
        }
      } else {
        throw new Error('No scenario returned from API');
      }
    } catch (error: any) {
      console.error('Supabase error:', error.message, error.code);
      let errorMessage = 'An unknown error occurred.';
      if (error instanceof Error) {
        errorMessage = error.message;
        // Проверяем, является ли ошибка связанной с загрузкой модели
        if (error.message.includes('Не удалось загрузить модель')) {
          setFormState(prev => ({ ...prev, error: errorMessage, response: '' }));
        } else {
          setFormState(prev => ({ ...prev, response: `An error occurred: ${error.message}`, error: error.message }));
        }
      } else {
        setFormState(prev => ({ ...prev, response: 'An unknown error occurred.', error: 'Unknown error' }));
      }
    } finally {
      // Убираем прогресс после завершения операции
      setTimeout(() => {
        setFormState(prev => ({ ...prev, loading: false, progress: '' }));
      }, 1000); // Небольшая задержка, чтобы пользователь увидел сообщение о завершении
    }
  };

  const handleCopyResponse = async () => {
    try {
      await navigator.clipboard.writeText(formState.response);
      // Краткое уведомление "Скопировано!"
      setFormState(prev => ({ ...prev, response: 'Copied!', error: '' }));
      setTimeout(() => {
        setFormState(prev => ({ ...prev, response: formState.response, error: '' }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setFormState(prev => ({ ...prev, response: 'Failed to copy!', error: '' }));
      setTimeout(() => {
        setFormState(prev => ({ ...prev, response: formState.response, error: '' }));
      }, 2000);
    }
  };

  return {
    title,
    setTitle,
    storyContent,
    setStoryContent,
    question,
    setQuestion,
    formState,
    isLoading: formState.loading,
    handleSubmit,
    handleCopyResponse,
  };
};