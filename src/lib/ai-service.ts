import { OpenAI } from "openai";
import { WhatIfRequest, WhatIfResponse } from '../types/ai-types';


/**
 * Генерирует альтернативный сценарий на основе исходной истории и вопроса "что если"
 * Использует Hugging Face API
 *
 * @param storyContent - Исходный текст истории
 * @param question - Вопрос "что если", который определяет направление альтернативного сценария
 * @param progressCallback - Функция обратного вызова для отслеживания прогресса выполнения
 * @param userId - ID пользователя для логирования/аудита (опционально)
 * @returns Promise<WhatIfResponse> - Объект с результатами генерации
 */
export async function generateScenario(storyContent: string, question: string, progressCallback: (progress: string) => void, userId?: string): Promise<WhatIfResponse> {
  return await generateWithHuggingFace(storyContent, question, progressCallback, userId);
}

/**
 * Генерирует альтернативный сценарий с использованием Hugging Face API
 *
 * @param storyContent - Исходный текст истории
 * @param question - Вопрос "что если", который определяет направление альтернативного сценария
 * @param progressCallback - Функция обратного вызова для отслеживания прогресса выполнения
 * @param userId - ID пользователя для логирования/аудита (опционально)
 * @returns Promise<WhatIfResponse> - Объект с результатами генерации
 */
async function generateWithHuggingFace(storyContent: string, question: string, progressCallback: (progress: string) => void, userId?: string): Promise<WhatIfResponse> {
  try {
    progressCallback('Подключение к Hugging Face API...');
    
    // Проверяем наличие API ключа
    const apiKey = process.env.HF_TOKEN;
    if (!apiKey) {
      throw new Error('HF_TOKEN не найден в переменных окружения');
    }
    
    // Логируем конфигурацию клиента для отладки
    
    // Создаем экземпляр OpenAI с Hugging Face endpoint
    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: apiKey
    });
    
    progressCallback('Генерация сценария с помощью Hugging Face API...');
    
    // Создаем промпт для генерации альтернативного сценария
    const prompt = `Система генерации сценариев.

Исходная история:
${storyContent}

Вопрос "что если":
${question}

Создай детальный и интересный альтернативный сценарий, отвечая на вопрос "что если". Сценарий должен быть логичным, увлекательным и хорошо структурированным. Используй параграфы для лучшей читаемости.`;

    // Выполняем запрос к Hugging Face API через OpenAI SDK
    // Используем модель Qwen, которая поддерживается Hugging Face
    const response = await client.chat.completions.create({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [
        { role: 'system', content: 'Система генерации сценариев на русском языке.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 1500,
    });
    
    if (!response || !response.choices || response.choices.length === 0 || !response.choices[0]?.message?.content) {
      throw new Error('Invalid response from AI API');
    }
    
    const generatedText = response.choices[0].message.content || '';
    
    // Форматируем ответ
    const formattedResponse = formatAIResponse(generatedText, { story: storyContent, whatIfQuestion: question });
    
    return {
      scenario: formattedResponse,
      success: true
    };
  } catch (error: any) {
    console.error('AI service error:', error.message, error.code);
    return {
      scenario: '',
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка Hugging Face API'
    };
  }
}


// Форматирование ответа от AI
function formatAIResponse(aiText: string, request: WhatIfRequest): string {
  // Очищаем и форматируем ответ
  let formatted = aiText
    .trim()
    .replace(/^(Альтернативный сценарий:|Сценарий:|История:)/i, '')
    .trim()
  
  // Добавляем заголовок если его нет
  if (!formatted.includes('#')) {
    formatted = `# Альтернативный сценарий\n\n${formatted}`
  }
  
  // Если текст слишком короткий, возвращаем как есть
  if (formatted.length < 100) {
    console.log('Response is short but will be returned');
  }
  
  // Улучшаем структуру текста
  formatted = improveTextStructure(formatted);
  
  return formatted
}

// Улучшение структуры текста
function improveTextStructure(text: string): string {
  // Добавляем разрывы между абзацами
  text = text.replace(/\n{2,}/g, '\n\n');

  // Улучшаем заголовки
  text = text.replace(/^(#+)(.*?)(\n|$)/gm, '$1$2$3\n');
  
  // Добавляем эмотивность в текст
  return text;
}
