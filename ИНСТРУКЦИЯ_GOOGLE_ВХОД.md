# Настройка входа через Google в приложении What If Devise

## Общее описание

Вход через Google реализован с использованием OAuth-аутентификации через Supabase. Пользователь может войти в приложение, используя свою учетную запись Google, без необходимости создавать отдельный пароль.

## Требования

- Аккаунт на [Supabase](https://supabase.com/)
- Аккаунт на [Google Cloud Console](https://console.cloud.google.com/)

## Настройка в Google Cloud Console

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Google+ API (если еще не включен)
4. Перейдите в раздел "Учетные данные" (Credentials)
5. Создайте "Идентификатор клиента OAuth 2.0" (OAuth 2.0 Client ID)
6. Выберите тип приложения "Веб-приложение"
7. В "Авторизованные URI перенаправления" (Authorized redirect URIs) добавьте:
   - `http://localhost:3000/auth/callback` (для локальной разработки)
   - `https://<your-app-name>.vercel.app/auth/callback` (для продакшена на Vercel)
   - `https://<your-domain>/auth/callback` (для других доменов)
8. Запишите Client ID и Client Secret

## Настройка в Supabase

1. Перейдите в ваш проект на [Supabase Dashboard](https://app.supabase.com/)
2. Перейдите в раздел "Authentication" → "Settings"
3. Найдите раздел "OAuth providers" и включите Google
4. Введите Client ID и Client Secret из Google Cloud Console
5. В "Redirect URLs" укажите те же URL, что и в Google Cloud Console
6. Сохраните изменения

## Настройка в приложении

1. Убедитесь, что в файле `.env.local` указаны корректные переменные:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   ```

2. В файле `src/components/auth-provider.tsx` реализована функция `signInWithGoogle`, которая использует метод `signInWithOAuth` от Supabase

3. В файле `src/components/user-auth-form.tsx` добавлена кнопка "Войти через Google" с соответствующим обработчиком

## Использование

После настройки пользователи смогут войти в приложение через Google, нажав на кнопку "Войти через Google" на странице аутентификации. При первом входе через Google, если у пользователя еще нет аккаунта в системе, будет создан новый аккаунт, связанный с его Google-профилем.

## Безопасность

- Client Secret должен храниться в секрете и не должен быть доступен на клиенте
- Supabase автоматически обрабатывает OAuth-аутентификацию и создает сессию пользователя
- Все настройки OAuth в Supabase должны быть проверены для предотвращения несанкционированного доступа