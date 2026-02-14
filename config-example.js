// Пример файла конфигурации для Telegram бота
//
// ИНСТРУКЦИЯ:
// 1. Скопируйте этот файл и назовите его config.js
// 2. Замените значения ниже на свои
// 3. Подключите config.js в index.html ПЕРЕД script.js:
//    <script src="config.js"></script>
//    <script src="script.js"></script>
// 4. В script.js замените строки в функции sendToTelegram():
//    const TELEGRAM_BOT_TOKEN = window.TELEGRAM_CONFIG.BOT_TOKEN;
//    const TELEGRAM_CHAT_ID = window.TELEGRAM_CONFIG.CHAT_ID;

window.TELEGRAM_CONFIG = {
    // Токен вашего бота от @BotFather
    BOT_TOKEN: 'YOUR_BOT_TOKEN_HERE',

    // Ваш Chat ID (можно получить через @userinfobot)
    CHAT_ID: 'YOUR_CHAT_ID_HERE'
};

// ВАЖНО: Не коммитьте файл config.js в публичный репозиторий!
// Добавьте его в .gitignore
