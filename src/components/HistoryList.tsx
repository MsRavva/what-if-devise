'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/components/auth-provider';
import { Database } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

type Story = Database['public']['Tables']['stories']['Row'];
type Scenario = Database['public']['Tables']['scenarios']['Row'];

// Define a more specific type for our optimized query result
type StoryWithScenarios = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  scenarios: {
    id: string;
    question: string;
    ai_response: string;
    created_at: string;
  }[];
};

export default function HistoryList() {
  const [stories, setStories] = useState<StoryWithScenarios[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Using the imported supabase client directly instead of a hook
  // Check if supabase is initialized before using it
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  useEffect(() => {
    const fetchUserStories = async (): Promise<void> => {
      try {
        if (!supabase) {
          throw new Error('Supabase client not initialized');
        }
        const {
          data: { user },
        } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not authenticated');
        }
  
        // Fetch stories with their scenarios in a single query using foreign key relationship
        // Optimized to select only necessary fields and limit results for better performance
        const { data: storiesWithScenarios, error: storiesError } = await supabase
          .from('stories')
          .select(`
            id,
            title,
            content,
            created_at,
            updated_at,
            user_id,
            scenarios(
              id,
              question,
              ai_response,
              created_at
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50); // Limit to 50 stories for performance
  
        if (storiesError) {
          throw storiesError;
        }
  
        if (storiesWithScenarios) {
          // Update the stories state with the fetched data
          // The scenarios are already nested in each story object from the query
          setStories(storiesWithScenarios.map(story => ({
            ...story,
            scenarios: story.scenarios || []
          })));
        }
      } catch (err) {
        console.error('Supabase error:', err);
        setError('Failed to load your stories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserStories();
  }, []);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-destructive/10 border border-destructive/40 text-destructive px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Ошибка: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle><Skeleton className="h-6 w-3/4" /></CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-4/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">История ваших историй</h1>
      {stories.length === 0 ? (
        <p className="text-muted-foreground">Истории не найдены. Создайте свою первую историю!</p>
      ) : (
        <div className="space-y-6">
          {stories.map((story) => (
            <Card key={story.id}>
              <CardHeader>
                <CardTitle className="truncate">{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">Содержание истории:</h3>
                  <p className="whitespace-pre-line line-clamp-3 text-muted-foreground">{story.content}</p>
                </div>
                
                {story.scenarios.length > 0 ? (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Сценарии "Что если":</h3>
                    <div className="space-y-3">
                      {story.scenarios.map((scenario) => (
                        <a
                          key={scenario.id}
                          href={`/chat/${scenario.id}`}
                          className="block border-l-4 border-primary pl-4 py-2 hover:bg-muted/50 transition-colors rounded-r cursor-pointer"
                        >
                          <p className="font-medium truncate max-w-full">
                            <span className="text-primary">Вопрос:</span> {scenario.question}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {scenario.ai_response}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Нажмите чтобы открыть чат
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-3">Сценарии еще не созданы</p>
                    <a
                      href={`/chat/${crypto.randomUUID()}?story=${encodeURIComponent(story.content)}&question=${encodeURIComponent('Создайте альтернативный сценарий для этой истории')}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-primary to-accent text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Создать сценарий
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}