# Калькулятор пластиковых окон

Многошаговый онлайн-калькулятор для расчёта стоимости пластиковых окон с интеграцией Telegram.

## Возможности

- ✅ Пошаговая форма с визуальным прогресс-баром
- ✅ Выбор типа помещения (квартира, дом, офис)
- ✅ Настройка количества створок (1, 2 или 3)
- ✅ Выбор типа каждой створки с дополнительными аксессуарами
- ✅ Дополнительные комплектующие и параметры окна
- ✅ Информационные подсказки для каждого параметра
- ✅ Настройка доставки и монтажа
- ✅ Валидация формы с маской телефона
- ✅ Отправка заявки в Telegram
- ✅ Адаптивный дизайн для всех устройств

## Структура проекта

```
demo_calc_project/
│
├── index.html          # Основная HTML-структура
├── style.css           # Стили калькулятора
├── script.js           # JavaScript логика
├── README.md           # Документация
│
└── images/             # Папка для изображений
    ├── apartment.jpg   # Изображение квартиры
    ├── house.jpg       # Изображение частного дома
    └── office.jpg      # Изображение офиса
```

## Установка

1. **Клонируйте или скачайте проект**

2. **Создайте папку для изображений**
   ```bash
   mkdir images
   ```

3. **Добавьте изображения**

   Поместите в папку `images/` три изображения:
   - `apartment.jpg` - изображение квартиры
   - `house.jpg` - изображение частного дома
   - `office.jpg` - изображение офиса

## Настройка Telegram бота

### Шаг 1: Создание бота

1. Откройте Telegram и найдите [@BotFather](https://t.me/botfather)
2. Отправьте команду `/newbot`
3. Укажите имя для вашего бота (например, "Калькулятор окон")
4. Укажите username для бота (должен заканчиваться на `bot`, например, `window_calc_bot`)
5. BotFather выдаст вам **токен бота** - сохраните его

### Шаг 2: Получение Chat ID

#### Вариант 1: Через специальный бот

1. Найдите в Telegram бота [@userinfobot](https://t.me/userinfobot)
2. Нажмите Start
3. Бот отправит вам ваш **Chat ID**

#### Вариант 2: Через API

1. Отправьте любое сообщение вашему новому боту
2. Откройте в браузере:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
   (замените `<YOUR_BOT_TOKEN>` на токен вашего бота)
3. Найдите в JSON-ответе поле `"chat":{"id": 123456789}` - это ваш Chat ID

### Шаг 3: Настройка в коде

Откройте файл `script.js` и найдите функцию `sendToTelegram()`. Замените значения:

```javascript
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';  // Вставьте токен бота
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE';      // Вставьте ваш Chat ID
```

**Пример:**
```javascript
const TELEGRAM_BOT_TOKEN = '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz';
const TELEGRAM_CHAT_ID = '123456789';
```

## Запуск

### Локальный запуск

1. Откройте файл `index.html` в браузере
2. Или используйте локальный веб-сервер:

   **С Python 3:**
   ```bash
   python -m http.server 8000
   ```
   Откройте http://localhost:8000

   **С Node.js (http-server):**
   ```bash
   npx http-server
   ```

### Развертывание

Проект можно разместить на любом хостинге статических сайтов:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

## Этапы калькулятора

1. **0%** - Выбор типа помещения
2. **12%** - Количество створок
3. **25%** - Размеры окна
4. **37%** - Тип створок (в зависимости от количества)
5. **50%** - Дополнительные комплектующие
6. **62%** - Прокачка окна (дополнительные параметры)
7. **75%** - Сводка заказа
8. **87%** - Дополнительные услуги
9. **100%** - Финальная форма с отправкой

## Настройка параметров

### Дополнительные параметры окна

В файле `index.html` на шаге 8 указаны подсказки для каждого параметра. Вы можете изменить их, отредактировав атрибут `data-tooltip`:

```html
<span class="info-icon" data-tooltip="Ваш текст подсказки">?</span>
```

### Стилизация

Основные цвета и стили можно изменить в файле `style.css`:

```css
/* Основной градиент */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Цвета кнопок, прогресс-бара и т.д. */
```

## Безопасность

⚠️ **ВАЖНО**: Для production-среды рекомендуется:

1. **Не хранить токены в клиентском коде**
   - Создайте серверную часть (Node.js, PHP, Python)
   - Отправляйте данные на сервер, а сервер пусть отправляет в Telegram

2. **Пример серверной отправки (Node.js + Express):**

   ```javascript
   // server.js
   const express = require('express');
   const axios = require('axios');
   const app = express();

   app.use(express.json());

   app.post('/api/submit', async (req, res) => {
       const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
       const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

       try {
           await axios.post(
               `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
               {
                   chat_id: TELEGRAM_CHAT_ID,
                   text: req.body.message
               }
           );
           res.json({ success: true });
       } catch (error) {
           res.status(500).json({ error: 'Failed to send' });
       }
   });

   app.listen(3000);
   ```

   В `script.js` измените функцию `sendToTelegram()`:
   ```javascript
   async function sendToTelegram(message) {
       await fetch('/api/submit', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ message })
       });
   }
   ```

## Дополнительные возможности

### Сохранение в базу данных

Вы можете дополнить функционал сохранением заявок в базу данных перед отправкой в Telegram.

### Email уведомления

Добавьте отправку email помимо Telegram через сервисы типа SendGrid или Mailgun.

### Интеграция с CRM

Отправляйте данные напрямую в вашу CRM-систему (amoCRM, Bitrix24 и др.)

## Поддержка браузеров

- Chrome (последние 2 версии)
- Firefox (последние 2 версии)
- Safari (последние 2 версии)
- Edge (последние 2 версии)

## Лицензия

MIT License - используйте свободно для коммерческих и некоммерческих целей.

## Поддержка

Если у вас возникли вопросы или проблемы:
1. Проверьте правильность токена и Chat ID
2. Убедитесь, что вы отправили хотя бы одно сообщение боту
3. Проверьте консоль браузера на наличие ошибок (F12 → Console)
