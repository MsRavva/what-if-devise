'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface QuestionLoaderProps {
  onQuestionLoad: (question: string) => void;
}

export function QuestionLoader({ onQuestionLoad }: QuestionLoaderProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const questionFromUrl = searchParams.get('question');
    if (questionFromUrl) {
      onQuestionLoad(questionFromUrl);
    }
  }, [searchParams, onQuestionLoad]);

  return null;
}
