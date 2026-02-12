/**
 * Rate Limiter для защиты API от злоупотреблений
 * In-memory реализация (для production рекомендуется Redis)
 */

interface RateLimitRecord {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Конфигурация
const RATE_LIMITS = {
    user: {
        requests: 30,
        windowMs: 60 * 1000, // 1 минута
    },
    guest: {
        requests: 5,
        windowMs: 60 * 1000, // 1 минута
    }
};

/**
 * Очистка устаревших записей (вызывается периодически)
 */
function cleanupExpiredRecords() {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
        if (record.resetTime < now) {
            rateLimitStore.delete(key);
        }
    }
}

// Запускаем очистку каждые 5 минут
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupExpiredRecords, 5 * 60 * 1000);
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
}

/**
 * Проверяет rate limit для указанного ключа
 * 
 * @param key - Уникальный идентификатор (IP, userId)
 * @returns Результат проверки rate limit
 */
export function checkRateLimit(key: string): RateLimitResult {
    const now = Date.now();
    const isGuest = key.startsWith('guest:');
    const config = isGuest ? RATE_LIMITS.guest : RATE_LIMITS.user;

    const record = rateLimitStore.get(key);

    // Если записи нет или она устарела — создаём новую
    if (!record || record.resetTime < now) {
        const newRecord: RateLimitRecord = {
            count: 1,
            resetTime: now + config.windowMs,
        };
        rateLimitStore.set(key, newRecord);

        return {
            allowed: true,
            remaining: config.requests - 1,
            resetTime: newRecord.resetTime,
        };
    }

    // Проверяем лимит
    if (record.count >= config.requests) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);
        return {
            allowed: false,
            remaining: 0,
            resetTime: record.resetTime,
            retryAfter,
        };
    }

    // Увеличиваем счётчик
    record.count += 1;
    rateLimitStore.set(key, record);

    return {
        allowed: true,
        remaining: config.requests - record.count,
        resetTime: record.resetTime,
    };
}

/**
 * Получает ключ rate limit из запроса
 * Использует userId или IP для гостей
 */
export function getRateLimitKey(request: Request, userId?: string | null): string {
    if (userId) {
        return `user:${userId}`;
    }

    // Пытаемся получить IP адрес
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    
    return `guest:${ip}`;
}

/**
 * Сбрасывает rate limit для ключа (для тестирования)
 */
export function resetRateLimit(key: string): void {
    rateLimitStore.delete(key);
}
