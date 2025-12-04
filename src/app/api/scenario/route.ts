import { NextRequest } from 'next/server';
import { saveScenario, getAuthenticatedUser, supabase } from '@/lib/supabase';
import { generateScenario } from '@/lib/ai-service';

export async function POST(req: NextRequest) {
  try {
    // Получаем аутентифицированного пользователя
    const user = await getAuthenticatedUser(req.headers);
    const userId = user.id;
    
    const { id, story, question, scenario, story_id } = await req.json();

    // Поддерживаем два формата: новый (с id, story, question) и старый (с story_id)
    if (id && story && question) {
      // Новый формат: сохраняем сценарий с заданным ID
      if (!scenario) {
        return new Response(
          JSON.stringify({ error: 'scenario is required for new format' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Проверяем, что Supabase клиент инициализирован
      if (!supabase) {
        return new Response(
          JSON.stringify({ error: 'Supabase client not initialized' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Сначала создаем историю
      const { data: storyData, error: storyError } = await supabase
        .from('stories')
        .insert({
          user_id: userId,
          title: question.substring(0, 100), // Используем вопрос как заголовок
          content: story
        })
        .select()
        .single();

      if (storyError) {
        console.error('Ошибка создания истории:', storyError);
        return new Response(
          JSON.stringify({ error: 'Failed to create story' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Теперь создаем сценарий с заданным ID
      const { data: scenarioData, error: scenarioError } = await supabase
        .from('scenarios')
        .insert({
          id: id,
          story_id: storyData.id,
          user_id: userId,
          question: question,
          ai_response: scenario
        })
        .select()
        .single();

      if (scenarioError) {
        console.error('Ошибка создания сценария:', scenarioError);
        return new Response(
          JSON.stringify({ error: 'Failed to create scenario' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ response: scenario, id: scenarioData.id }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else if (story_id && question) {
      // Старый формат: генерируем и сохраняем сценарий
      let finalScenario = scenario;
      
      // Если сценарий не предоставлен, генерируем его с помощью AI
      if (!finalScenario) {
        if (!supabase) {
          return new Response(
            JSON.stringify({ error: 'Supabase client not initialized' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        // Получаем содержимое истории из базы данных
        const { data: storyData, error: storyError } = await supabase
          .from('stories')
          .select('content')
          .eq('id', story_id)
          .single();
        
        if (storyError) {
          console.error('Supabase error:', storyError);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch story content' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        const storyContent = storyData?.content || "";
        
        const aiResponse = await generateScenario(storyContent, question, (progress) => {
          console.log(progress);
        }, userId);

        if (!aiResponse.success) {
          return new Response(
            JSON.stringify({ error: `AI generation failed: ${aiResponse.error}` }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        finalScenario = aiResponse.scenario;
      }

      // Сохраняем сценарий в базу данных
      let savedScenarioId;
      try {
        savedScenarioId = await saveScenario(story_id, userId, question, finalScenario);
      } catch (dbError) {
        console.error('Supabase error:', dbError);
        return new Response(
          JSON.stringify({ error: 'Failed to save scenario to database' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ response: finalScenario, id: savedScenarioId }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid request format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error processing scenario:', error);
    if (error instanceof Error && error.message.includes('Authentication')) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}