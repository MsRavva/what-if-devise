'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useStoryForm } from '@/hooks/useStoryForm';

export default function StoryEditor() {
  const {
    title,
    setTitle,
    storyContent,
    setStoryContent,
    question,
    setQuestion,
    formState,
    isLoading,
    handleSubmit,
    handleCopyResponse,
  } = useStoryForm();

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Story Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="Enter story title"
            required
            className="w-full text-sm sm:text-base"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            Story Content
          </label>
          <Textarea
            id="content"
            value={storyContent}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setStoryContent(e.target.value)}
            placeholder="Enter your story content"
            rows={6}
            required
            className="w-full text-sm sm:text-base h-64 min-h-[16rem]"
          />
        </div>

        <div>
          <label htmlFor="question" className="block text-sm font-medium mb-2">
            What-If Question
          </label>
          <Textarea
            id="question"
            value={question}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)}
            placeholder="Enter your 'what-if' question"
            rows={3}
            required
            className="w-full text-sm sm:text-base h-40 min-h-[10rem]"
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? 'Generating...' : 'Generate Scenario'}
        </Button>
      </form>
  
        {isLoading && (
          <div className="mt-6 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        )}
        
        {formState.progress && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">{formState.progress}</p>
          </div>
        )}
  
        {formState.error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            <h3 className="text-lg font-semibold mb-2">Ошибка</h3>
            <p>{formState.error}</p>
            {(formState.error.includes('Failed to fetch') || formState.error.includes('Cannot coerce') || formState.error.includes('Authentication required')) && (
              <div className="mt-2 text-sm">
                <p className="font-medium">Возможные решения:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Проверьте подключение к интернету</li>
                  <li>Убедитесь, что в браузере разрешены сетевые запросы</li>
                  <li>Попробуйте отключить блокировщики рекламы или расширения</li>
                  <li>Проверьте настройки безопасности браузера</li>
                </ul>
              </div>
            )}
          </div>
        )}
        {formState.response && !formState.loading && (
          <div className="mt-6 p-4 border rounded-md">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">Generated Scenario</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyResponse}
                className="w-full sm:w-auto mt-2 sm:mt-0"
              >
                Copy
              </Button>
            </div>
            <p>{formState.response}</p>
          </div>
        )}
      </div>
    );
  }