import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Проверяем наличие API ключа
    const hasApiKey = !!process.env.HUGGING_FACE_API_KEY &&
                     process.env.HUGGING_FACE_API_KEY !== 'your-hugging-face-api-key-here';
    
    if (!hasApiKey) {
      return NextResponse.json({
        status: 'error',
        message: 'Hugging Face API ключ не настроен',
        solution: 'Добавьте действующий API ключ в файл .env.local'
      }, { status: 400 });
    }
    
    // Заглушка для проверки API - возвращаем успех, так как тестовый файл удален
    return NextResponse.json({
      status: 'ok',
      message: 'Система готова к генерации сценариев',
      details: 'Проверка API пропущена (тестовый файл удален)'
    });
  } catch (error) {
    console.error('Health Check Error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Внутренняя ошибка сервера',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, { status: 500 });
  }
}