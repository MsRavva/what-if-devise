'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/components/auth-provider';
import { Database } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

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
    <div className="max-w-4xl mx-auto py-4 sm:py-6 animate-fade-in">
      {stories.length === 0 ? (
        <div className="book-card text-center py-12">
          <p className="text-ink/60 italic">Your chronicles are currently empty. Begin your first journey to see it recorded here.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {stories.map((story) => (
            <div key={story.id} className="book-card p-0 overflow-hidden border-primary/10">
              <div className="bg-primary/5 border-b border-primary/10 px-6 py-4">
                <h2 className="text-2xl font-bold italic text-ink truncate">{story.title || 'Untitled Manuscript'}</h2>
                <p className="text-[10px] text-ink/40 uppercase tracking-widest font-sans mt-1">
                  Recorded on {new Date(story.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="p-6 space-y-8">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-ink/40 mb-3">Original Narrative</h3>
                  <p className="text-ink italic leading-relaxed line-clamp-4 border-l-2 border-primary/10 pl-4">
                    {story.content}
                  </p>
                </div>
                
                {story.scenarios.length > 0 ? (
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-ink/40 mb-4 flex items-center gap-2">
                      <div className="h-px flex-1 bg-primary/10" />
                      Alternative Visions
                      <div className="h-px flex-1 bg-primary/10" />
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {story.scenarios.map((scenario) => (
                        <Link
                          key={scenario.id}
                          href={`/chat/${scenario.id}`}
                          className="group block p-4 border border-border rounded-sm hover:border-primary/30 hover:bg-primary/5 transition-all"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-bold italic text-ink truncate flex-1">
                              "{scenario.question}"
                            </p>
                            <span className="text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity font-sans uppercase font-bold ml-2">
                              Enter →
                            </span>
                          </div>
                          <p className="text-sm text-ink/60 line-clamp-2 italic">
                            {scenario.ai_response}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-border rounded-sm bg-card/50">
                    <p className="text-ink/40 text-sm italic mb-4">No alternative paths explored yet.</p>
                    <Link
                      href={`/chat/${story.id}?story=${encodeURIComponent(story.content)}&question=${encodeURIComponent('Create an alternative path for this story.')}`}
                      className="book-button text-xs py-2 px-4 inline-block"
                    >
                      Summon the Oracle
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}