import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import { MySqliteDb } from './MySqliteDb.js';
import { CryptoRepository } from './CryptoRepository.js';
const MY_BOT_TOKEN = '7057611427:AAELmA1icx1TC0MUxg90bU3Oi49kosTVS-Q';
const app = express();
const port = process.env.PORT || 3000;
const db = MySqliteDb.getConnection();
const bot = new TelegramBot(MY_BOT_TOKEN, { polling: true });
const cryptoRepository = new CryptoRepository();
const listOfCommands = [];
listOfCommands.push('/start');
listOfCommands.push('/help');
listOfCommands.push('/listRecent');
listOfCommands.push('/addToFavourite');
listOfCommands.push('/listFavourite');
listOfCommands.push('/deleteFavourite');
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Welcome to the CryptoBot! Use /help to see available commands.');
});
bot.onText(/\/help/, (msg) => {
    const helpMessage = `Available commands:
        /listRecent - List recent cryptocurrencies
        /addToFavourite {symbol} - Add a cryptocurrency to favorites
        /listFavourite - List favorite cryptocurrencies
        /deleteFavourite {symbol} - Remove a cryptocurrency from favorites`;
    bot.sendMessage(msg.chat.id, helpMessage);
});
bot.onText(/\/listRecent/, async (msg) => {
    try {
        const response = await axios.get('https://16-crypto-rest-api-01.fly.dev/cryptocurrency/list');
        const data = await response.data;
        let cryptoData = '';
        data.forEach((item) => {
            cryptoData = cryptoData + '/' + item + '\n';
        });
        bot.sendMessage(msg.chat.id, cryptoData);
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
});
bot.onText(/\/addToFavourite (.+)/, async (msg, match) => {
    MySqliteDb.createFavoritesTable();
    const username = msg.from?.username;
    const symbol = match?.[1]?.toUpperCase();
    const chatId = msg.chat.id;
    addToFavourite(username, symbol, chatId);
});
bot.onText(/\/listFavourite/, async (msg) => {
    const username = msg.from?.username;
    let listFavourite = 'Favorites:\n';
    try {
        db.all(' SELECT favorite_cryptos FROM favorites WHERE username = ?', [username], (err, rows) => {
            rows.forEach(async (row) => {
                listFavourite += "/" + row.favorite_cryptos + '\n';
            });
            bot.sendMessage(msg.chat.id, listFavourite);
        });
    }
    catch (error) {
        console.error('Error fetching favorites:', error);
    }
});
bot.onText(/\/deleteFavourite (.+)/, async (msg, match) => {
    const username = msg.from?.username;
    const symbol = match?.[1]?.toUpperCase();
    const chatId = msg.chat.id;
    deleteFromFavourite(username, symbol, chatId);
});
bot.onText(/\/(\w+)/, async (msg, match) => {
    if (listOfCommands.includes(match?.[0] ?? '')) {
        return;
    }
    let symbol = match?.[1].toUpperCase();
    if (match) {
        symbol = match[1].toUpperCase();
    }
    else {
        return;
    }
    try {
        const inlineKeyboard = {
            inline_keyboard: [
                [
                    { text: 'Add to following', callback_data: `add_${symbol}` },
                    { text: 'Remove from following', callback_data: `remove_${symbol}` },
                ],
                [
                    { text: '30 minutes', callback_data: `${symbol}_0.5hour` },
                    { text: '1 hour', callback_data: `${symbol}_1hour` },
                ],
                [
                    { text: '3 hours', callback_data: `${symbol}_3hours` },
                    { text: '6 hours', callback_data: `${symbol}_6hours` },
                ],
                [
                    { text: '12 hours', callback_data: `${symbol}_12hours` },
                    { text: '24 hours', callback_data: `${symbol}_24hours` },
                ],
            ],
        };
        const message = `Cryptocurrency: ${symbol}\nChoose period for historical data: \n`;
        bot.sendMessage(msg.chat.id, message, { reply_markup: inlineKeyboard });
        return;
    }
    catch (error) {
        console.error('Error fetching cryptocurrency data:', error);
    }
});
bot.on('callback_query', async (query) => {
    const { data } = query;
    if (data?.startsWith('add_')) {
        const username = query.from.username;
        const symbol = data.substring(4);
        const chatId = query.message?.chat.id;
        addToFavourite(username, symbol, chatId);
        return;
    }
    if (data?.startsWith('remove_')) {
        ;
        const username = query.from.username;
        const symbol = data.substring(7);
        const chatId = query.message?.chat.id;
        deleteFromFavourite(username, symbol, chatId);
        return;
    }
    else {
        getHistoricalCryptoData(data, query);
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
const addToFavourite = async (username, symbol, chatId) => {
    if (!username) {
        console.log('undefined username');
        bot.sendMessage(chatId, `can't find your telegram username`);
        throw new Error(`undefined username: ${username}`);
    }
    if (!symbol) {
        const returnMessage = `undefined cryptoSymbol: ${symbol}`;
        console.log(returnMessage);
        bot.sendMessage(chatId, returnMessage);
        throw new Error(returnMessage);
    }
    try {
        db.all(' SELECT favorite_cryptos FROM favorites WHERE username = ? AND favorite_cryptos = ?', [username, symbol], async (err, rows) => {
            if (rows[0]) {
                bot.sendMessage(chatId, `${symbol} already added to favorites`);
                return;
            }
            else {
                await cryptoRepository.addToFavorites(username, symbol);
                bot.sendMessage(chatId, `cryptocurrency ${symbol} successfully added to favorites`);
            }
        });
    }
    catch (error) {
        bot.sendMessage(chatId, `Can't add ${symbol} to favourites`);
    }
};
const deleteFromFavourite = async (username, symbol, chatId) => {
    if (!username) {
        console.log('undefined username');
        bot.sendMessage(chatId, `can't find your telegram username`);
        throw new Error(`undefined username: ${username}`);
    }
    if (!symbol) {
        const returnMessage = `undefined cryptoSymbol: ${symbol}`;
        console.log(returnMessage);
        bot.sendMessage(chatId, returnMessage);
        throw new Error(returnMessage);
    }
    try {
        await cryptoRepository.deleteFromFavorites(username, symbol);
        bot.sendMessage(chatId, `cryptocurrency ${symbol} successfully deleted from favourites`);
    }
    catch (error) {
        bot.sendMessage(chatId, `can't delete ${symbol} from favourites`);
    }
};
const getHistoricalCryptoData = async (data, query) => {
    // TODO: if it's will be on server, then need to define user time zone and set it here! 
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Kiev',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
    const cryptoSymbol = data?.split('_')[0];
    const durationTime = data?.split('_')[1];
    const period = Number.parseFloat(durationTime?.split('hours')[0] ?? '0.5');
    let message = `Historical date for ${cryptoSymbol}:\n`;
    const response = await axios.get('https://16-crypto-rest-api-01.fly.dev/cryptocurrency', {
        data: {
            cryptocurrency: `${cryptoSymbol}`,
            period: period
        }
    });
    const cryptoData = response.data;
    const chatId = query.message?.chat.id;
    cryptoData.forEach((crypto) => {
        const formattedDate = formatter.format(new Date(crypto.saved_at));
        message = message + 'date: ' + formattedDate + ' - price: ' + crypto.price + '\n';
    });
    bot.sendMessage(chatId, message);
};
//# sourceMappingURL=index.js.map