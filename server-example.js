// Пример серверной части для безопасной отправки в Telegram
// Используйте это для production-среды!
//
// Установка зависимостей:
// npm init -y
// npm install express axios cors dotenv

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Раздача статических файлов

// Конфигурация из переменных окружения
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// API endpoint для отправки заявки
app.post('/api/submit', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        // Проверка конфигурации
        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error('Telegram configuration missing!');
            return res.status(500).json({
                success: false,
                error: 'Server configuration error'
            });
        }

        // Отправка в Telegram
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        const response = await axios.post(telegramUrl, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });

        if (response.data.ok) {
            res.json({
                success: true,
                message: 'Заявка успешно отправлена'
            });
        } else {
            throw new Error('Telegram API error');
        }

    } catch (error) {
        console.error('Error sending to Telegram:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to send message'
        });
    }
});

// Проверка здоровья сервера
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Telegram bot configured: ${!!TELEGRAM_BOT_TOKEN}`);
    console.log(`Chat ID configured: ${!!TELEGRAM_CHAT_ID}`);
});

// Обработка ошибок
process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error);
});

/*
ИНСТРУКЦИЯ ПО ИСПОЛЬЗОВАНИЮ:

1. Создайте файл .env в корне проекта:
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_CHAT_ID=your_chat_id_here
   PORT=3000

2. Установите зависимости:
   npm init -y
   npm install express axios cors dotenv

3. Запустите сервер:
   node server-example.js

4. Измените в script.js функцию sendToTelegram():

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

5. Удалите из script.js все упоминания TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID

6. Добавьте .env в .gitignore (уже добавлено)
*/
