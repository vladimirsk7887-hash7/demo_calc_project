# Быстрый старт

## Вариант 1: Запуск без сервера (для тестирования)

### Шаг 1: Настройте Telegram бота

1. Найдите [@BotFather](https://t.me/botfather) в Telegram
2. Отправьте `/newbot` и следуйте инструкциям
3. Получите **токен бота**

### Шаг 2: Получите Chat ID

1. Найдите [@userinfobot](https://t.me/userinfobot) в Telegram
2. Нажмите Start
3. Скопируйте ваш **Chat ID**

### Шаг 3: Настройте код

Откройте файл `script.js` и найдите функцию `sendToTelegram()` (примерно строка 520):

```javascript
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';  // Замените на ваш токен
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE';      // Замените на ваш Chat ID
```

### Шаг 4: Добавьте изображения

Поместите в папку `images/` три изображения:
- `apartment.jpg`
- `house.jpg`
- `office.jpg`

### Шаг 5: Запустите

Просто откройте `index.html` в браузере!

---

## Вариант 2: Запуск с Node.js сервером (для production)

### Шаг 1: Установите Node.js

Скачайте с https://nodejs.org (версия 16 или выше)

### Шаг 2: Установите зависимости

```bash
npm install
```

### Шаг 3: Создайте .env файл

Скопируйте `.env.example` в `.env`:

```bash
cp .env.example .env
```

Откройте `.env` и замените значения:

```env
TELEGRAM_BOT_TOKEN=ваш_токен_от_botfather
TELEGRAM_CHAT_ID=ваш_chat_id
PORT=3000
```

### Шаг 4: Обновите script.js

В файле `script.js` замените функцию `sendToTelegram()`:

```javascript
async function sendToTelegram(message) {
    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        if (!data.success) {
            console.error('Ошибка отправки:', data.error);
            throw new Error(data.error);
        }

        return data;
    } catch (error) {
        console.error('Ошибка при отправке в Telegram:', error);
        throw error;
    }
}
```

И удалите строки с `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` из этой функции.

### Шаг 5: Переименуйте серверный файл

```bash
mv server-example.js server.js
```

### Шаг 6: Запустите сервер

```bash
npm start
```

Откройте в браузере: http://localhost:3000

---

## Проверка работы

1. Заполните все шаги калькулятора
2. На последнем экране введите номер телефона
3. Поставьте галочку согласия
4. Нажмите "Рассчитать"
5. Проверьте Telegram - должно прийти сообщение с заявкой!

## Решение проблем

### Сообщения не приходят в Telegram

1. **Проверьте токен и Chat ID**
   - Они должны быть правильными
   - Токен должен быть длинной строкой с цифрами и буквами

2. **Отправьте сообщение боту**
   - Найдите вашего бота в Telegram
   - Нажмите Start
   - Отправьте любое сообщение

3. **Проверьте консоль браузера**
   - Нажмите F12
   - Перейдите на вкладку Console
   - Проверьте наличие ошибок

### CORS ошибки

Если видите ошибки CORS в консоли:
- Используйте серверную версию (Вариант 2)
- Или запустите через локальный сервер (не открывайте файл напрямую)

### Телефон не принимается

Убедитесь, что:
- Номер начинается с +7
- Введены все 11 цифр
- Формат: +7 (XXX) XXX-XX-XX

## Что дальше?

- Настройте стили под ваш дизайн в `style.css`
- Измените тексты в `index.html`
- Добавьте свои изображения
- Интегрируйте с CRM системой

Подробная документация в файле `README.md`
