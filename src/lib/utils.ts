import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Функция для форматирования содержимого истории
export const formatStoryContent = async (content: string): Promise<string> => {
  // Устанавливаем опции для marked
  const markedOptions = {
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // Преобразуем разрывы строк
  };

  // Преобразуем markdown в HTML
  const rawHtml = await marked(content, markedOptions);

  // Очищаем HTML от потенциально опасного кода
 const cleanHtml = DOMPurify.sanitize(rawHtml);

  return cleanHtml;
}
