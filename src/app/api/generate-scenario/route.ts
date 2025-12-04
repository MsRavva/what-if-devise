import { NextRequest } from 'next/server';
import { generateScenario } from '@/lib/ai-service';
import { getAuthenticatedUser, createServerSupabaseClient, saveScenario } from '@/lib/supabase';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Получаем аутентифицированного пользователя
    const user = await getAuthenticatedUser(request.headers);
    const userId = user.id;
    
    const { story, question, storyId } = await request.json();
    
    // Валидация входных данных
    if (!story || typeof story !== 'string' || !question || typeof question !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Story and question are required and must be strings' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Проверка длины story и question
    if (story.length > 50000 || question.length > 10000) {
      return new Response(
        JSON.stringify({ error: 'Story must be less than 50000 characters and question must be less than 10000 characters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Проверка на наличие потенциально вредоносных тегов
    const hasMaliciousTags = (text: string) => {
      const maliciousPatterns = /<script|<iframe|<object|<embed|<form|javascript:|on\w+=/i;
      return maliciousPatterns.test(text);
    };

    if (hasMaliciousTags(story) || hasMaliciousTags(question)) {
      return new Response(
        JSON.stringify({ error: 'Story and question contain potentially malicious content' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Received storyId:', storyId);

    console.log('Starting scenario generation for user:', userId);
    // Для серверного вызова используем пустую функцию обратного вызова
    const result = await generateScenario(story, question, () => {}, userId);
    console.log('Full result from generateScenario:', JSON.stringify(result, null, 2));
    
    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error || 'Failed to generate scenario' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Сохраняем сценарий с привязкой к истории только если storyId предоставлен
    let savedScenarioId = null;
    if (result && result.scenario) {
      console.log('Saving scenario to database...');
      if (storyId) {
        console.log('Using existing storyId:', storyId);
        try {
          savedScenarioId = await saveScenario(storyId, userId, question, result.scenario);
          if (!savedScenarioId) {
            console.error('Failed to save scenario - saveScenario returned null/undefined');
            return Response.json({ error: 'Failed to save scenario' }, { status: 500 });
          }
        } catch (saveError) {
          console.error('Error saving scenario:', saveError);
          console.error('Full save error object:', JSON.stringify(saveError, Object.getOwnPropertyNames(saveError), 2));
          return Response.json({ error: `Failed to save scenario: ${(saveError as Error).message || 'Unknown error'}` }, { status: 500 });
        }
      } else {
        // Если storyId не предоставлен, создаем новую историю используя серверный клиент
        console.log('Creating new story for scenario...');
        try {
          const supabase = createServerSupabaseClient(headers());
          
          // Создаем историю
          const { data: storyData, error: storyError } = await supabase
            .from('stories')
            .insert({
              user_id: userId,
              title: question.substring(0, 100),
              content: story
            })
            .select()
            .single();

          if (storyError || !storyData) {
            console.error('Failed to create new story:', storyError);
            return Response.json({ error: 'Failed to create story' }, { status: 500 });
          }

          console.log('New story created with ID:', storyData.id);

          // Создаем сценарий
          const { data: scenarioData, error: scenarioError } = await supabase
            .from('scenarios')
            .insert({
              story_id: storyData.id,
              user_id: userId,
              question: question,
              ai_response: result.scenario
            })
            .select()
            .single();

          if (scenarioError || !scenarioData) {
            console.error('Failed to save scenario:', scenarioError);
            return Response.json({ error: 'Failed to save scenario' }, { status: 500 });
          }

          savedScenarioId = scenarioData.id;
        } catch (saveError) {
          console.error('Error saving scenario:', saveError);
          console.error('Full save error object:', JSON.stringify(saveError, Object.getOwnPropertyNames(saveError), 2));
          return Response.json({ error: `Failed to save scenario: ${(saveError as Error).message || 'Unknown error'}` }, { status: 500 });
        }
      }
      console.log('Saved scenario ID:', savedScenarioId);
      console.log('Создание сценария с id:', savedScenarioId);
    } else {
      console.error('No scenario returned from AI service, cannot save');
      return Response.json({ error: 'Failed to generate scenario text' }, { status: 500 });
    }
    return Response.json({ success: true, scenario: result.scenario, id: savedScenarioId });
  } catch (error) {
    console.error('Error generating scenario:', error);
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    console.error('Error name:', (error as Error).name);
    console.error('Error message:', (error as Error).message);
    if (error instanceof Error && error.message.includes('Authentication')) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return Response.json({ error: 'Failed to generate scenario' });
  }
}