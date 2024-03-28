import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

const botToken = '7065852807:AAEAkmKGWuNgOgX_ETINEKeoPghHlklG8-Q';
const openWeatherApiKey = '9ae66d1ecb032e8c3a8928a2b6ded72c';
const bot = new TelegramBot(botToken, { polling: true });
let city = 'Dnipro'; 

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to the Weather Forecast Bot!', {
        reply_markup: {
            keyboard: [[{ text: 'Forecast' }]],
            resize_keyboard: true
        }
    });
});

bot.onText('Forecast', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Choose the weather forecast interval:', {
        reply_markup: {
            keyboard: [
                [{ text: '3-hour interval' }, { text: '6-hour interval' }],
                [{ text: 'Wind' }],
                [{ text: 'Back' }]
            ],
            resize_keyboard: true
        }
    });
});

bot.onText(/Back/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome back to the Weather Forecast Bot!', {
        reply_markup: {
            keyboard: [[{ text: 'Forecast' }]],
            resize_keyboard: true
        }
    });
});

bot.onText(/3-hour interval|6-hour interval/, async (msg) => {
    const chatId = msg.chat.id;
    const message = msg.text;
    let interval = parseInt(message.split('-')[0]);

    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${openWeatherApiKey}`;
   
    try {
        const response = await axios.get(apiUrl);
        const forecasts = response.data.list.filter((forecast, index) => index % (interval / 3) === 0);
        let weatherInfo = `Weather in ${city}:\n\n`;
        let currentDate = null;

        forecasts.forEach((forecast) => {
            const dateTime = new Date(forecast.dt * 1000);
            const date = dateTime.toLocaleDateString('en-US', {day: "numeric", month:"long", weekday:"long"});
            const time = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const temperature = (forecast.main.temp - 273.15).toFixed(0);
            const feelsLike = (forecast.main.feels_like - 273.15).toFixed(0);
            const weatherDescription = forecast.weather[0].description;

            if (date !== currentDate) {
                weatherInfo += `\n${date}:\n`;
                currentDate = date;
            }

            weatherInfo += `   ${time}, +${temperature}°C, feels like: +${feelsLike}°C, ${weatherDescription}\n`;
        });

        bot.sendMessage(chatId, weatherInfo);
    } catch (error) {
        bot.sendMessage(chatId, 'Failed to fetch weather forecast. Please try again later.');
    }
});

bot.onText(/Wind/, async (msg) => {
    const chatId = msg.chat.id;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}`;

    try {
        const response = await axios.get(apiUrl);
        const windSpeed = response.data.wind.speed;
        const windDirection = response.data.wind.deg;

        const windInfo = `Wind in ${city}:\n\nSpeed: ${windSpeed} m/s\nDirection: ${windDirection}°`;

        bot.sendMessage(chatId, windInfo);
    } catch (error) {
        bot.sendMessage(chatId, 'Failed to fetch wind information. Please try again later.');
    }
});

bot.onText(/city:/, async (msg) => {
    const indexOfCity = 1;
    const splitedText = msg.text.split(':');
    if (splitedText.length === 2) {
        const chatId = msg.chat.id;
        city = splitedText[indexOfCity].trim(); 
        bot.sendMessage(chatId, `Selected city: ${city}`);
    }
});