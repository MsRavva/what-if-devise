# Настройка Supabase для What If Device

## 1. Создание проекта Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите "Start your project"
3. Войдите или зарегистрируйтесь
4. Создайте новый проект:
   - Organization: выберите или создайте
   - Name: `what-if-device`
   - Database Password: создайте надежный пароль
   - Region: выберите ближайший регион

## 2. Получение ключей API

После создания проекта:

1. Перейдите в **Settings** → **API**
2. Скопируйте:
   - **Project URL** 
   - **Project API keys** → **anon** **public**

## 3. Настройка переменных окружения

Откройте файл `.env.local` и замените значения:

```env
NEXT_PUBLIC_SUPABASE_URL=ваш_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key
```

## 4. Создание схемы базы данных

1. В панели Supabase перейдите в **SQL Editor**
2. Скопируйте и выполните код из файла `database-schema.sql`
3. Нажмите **RUN** для выполнения

## 5. Настройка аутентификации

1. Перейдите в **Authentication** → **Settings**
2. В разделе **Site URL** укажите:
   - Для разработки: `http://localhost:3000`
   - Для продакшена: ваш домен
3. В **Redirect URLs** добавьте:
   - `http://localhost:3000/auth/callback`
   - `ваш_домен/auth/callback`

## 6. Настройка email-шаблонов (опционально)

1. Перейдите в **Authentication** → **Email Templates**
2. Настройте шаблоны для:
   - Подтверждение email
   - Сброс пароля

## 7. Тестирование

После настройки:

1. Запустите проект: `pnpm dev`
2. Перейдите на `http://localhost:3000`
3. Нажмите "Войти" и попробуйте зарегистрироваться
4. Проверьте создание записей в базе данных

## 8. Структура базы данных

### Таблица `stories`
- `id` - UUID, первичный ключ
- `user_id` - UUID, ссылка на пользователя
- `title` - заголовок истории
- `content` - полный текст истории
- `created_at` - дата создания
- `updated_at` - дата обновления

### Таблица `scenarios`
- `id` - UUID, первичный ключ
- `story_id` - UUID, ссылка на историю
- `user_id` - UUID, ссылка на пользователя  
- `question` - вопрос "что если"
- `ai_response` - ответ ИИ
- `created_at` - дата создания

## 9. Безопасность

- ✅ Row Level Security включена
- ✅ Пользователи видят только свои данные
- ✅ Автоматическая проверка user_id
- ✅ Индексы для производительности