// Типы для AI-генерации сценариев

/**
 * Статус генерации сценария
 */
export type GenerationStatus = 'idle' | 'connecting' | 'generating' | 'complete' | 'error';

/**
 * Запрос на генерацию альтернативного сценария
 */
export interface WhatIfRequest {
  story: string;
  whatIfQuestion: string;
}

/**
 * Ответ на запрос генерации
 */
export interface WhatIfResponse {
  scenario: string;
  success: boolean;
  error?: string;
  metadata?: GenerationMetadata;
}

/**
 * Метаданные генерации (опционально)
 */
export interface GenerationMetadata {
  model: string;
  tokensUsed?: number;
  generationTimeMs?: number;
  timestamp: number;
}

/**
 * Сообщение в чате
 */
export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

/**
 * Сессия чата
 */
export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

/**
 * Ответ API с rate limit информацией
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  rateLimitRemaining?: number;
  rateLimitReset?: number;
}

/**
 * Сценарий
 */
export interface Scenario {
  id: string;
  storyId: string;
  userId: string;
  question: string;
  aiResponse: string;
  createdAt: string;
}

/**
 * История/Story
 */
export interface Story {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
    scenarioCount?: number;
}

/**
 * Выбор в режиме кино
 */
export interface CinemaChoice {
  id: string;
  text: string;
}

/**
 * Сцена в режиме кино
 */
export interface CinemaScene {
  text: string;
  choices: CinemaChoice[];
  isEnding?: boolean;
  endingTitle?: string;
  endingCode?: string;
}
