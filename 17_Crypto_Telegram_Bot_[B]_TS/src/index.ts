import express from 'express'
import TelegramBot, { ChatId } from 'node-telegram-bot-api'
import sqlite3 from 'sqlite3'
import axios from 'axios';

const MY_BOT_TOKEN: string = '7057611427:AAELmA1icx1TC0MUxg90bU3Oi49kosTVS-Q';

const app = express();
const port = process.env.PORT || 3000;

const db = new sqlite3.Database('favorites.db');
const bot = new TelegramBot(MY_BOT_TOKEN, { polling: true });
const listOfCommands: string[] = [];
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

// Handle /listRecent command
bot.onText(/\/listRecent/, async (msg) => {
    try {
        // Fetch data from your API (replace with your actual API endpoint)
        const response = await axios.get('https://16-crypto-rest-api-01.fly.dev/cryptocurrency/list');
        const data = await response.data;

        // Send a concise list of recent cryptocurrencies
        let cryptoData: string = '';
        data.forEach((item: string) => {
            cryptoData = cryptoData + '/' + item + '\n';
        });
        // bot.sendMessage(msg.chat.id, `/${item}`);
        bot.sendMessage(msg.chat.id, cryptoData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

// Handle /addToFavourite command
bot.onText(/\/addToFavourite (.+)/, (msg, match) => {
    if (match) {
        db.exec(`CREATE TABLE IF NOT EXISTS favorites (
            user_id INTEGER PRIMARY KEY,
            username TEXT NOT NULL,
            favorite_cryptos TEXT
        )`);

        const symbol = match[1]?.toUpperCase();
        const username: string | undefined = msg.from?.username;
        db.run(`INSERT OR IGNORE INTO favorites (username, favorite_cryptos) 
            VALUES (?, ?)`,
            [username, symbol], (err) => {
                if (err) {
                    console.error('Error adding to favorites:', err);
                } else {
                    bot.sendMessage(msg.chat.id, `${symbol} added to favorites`);
                }
            });
    }
});

bot.onText(/\/listFavourite/, async (msg) => {
    const username: string | undefined = msg.from?.username;
    let listFavourite: string = 'Favorites:\n';
    try {
        db.all(' SELECT favorite_cryptos FROM favorites WHERE username = ?', [username], (err, rows: { symbol: string }[]) => {
            rows.forEach(async (row: any) => {
                listFavourite += "/" + row.favorite_cryptos + '\n';
            });
            bot.sendMessage(msg.chat.id, listFavourite);
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
    }


});

bot.onText(/\/deleteFavourite (.+)/, (msg, match) => {
    if (match) {
        const symbol = match[1]?.toUpperCase();
        db.run('DELETE FROM favorites WHERE symbol = ?', [symbol], (err) => {
            if (err) {
                console.error('Error removing from favorites:', err);
            } else {
                bot.sendMessage(msg.chat.id, `${symbol} removed from favorites`);
            }
        });
    }
});

bot.onText(/\/(\w+)/, async (msg, match) => {
    if (listOfCommands.includes(match![0] ?? '')) {
        return;
    }
    let symbol: string = '';
    if (match) {
        symbol = match[1].toUpperCase(); // Extract the currency symbol (e.g., BTC, ETH)
    }

    try {
        const response = (await axios.get('https://16-crypto-rest-api-01.fly.dev/cryptocurrency', {
            data: {
                cryptocurrency: `${symbol}`,
                period: 5
            }
        }));

        const cryptoData = response.data;

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
        let message = `Cryptocurrency: ${symbol}\nChoose period for historical data: \n`;

        bot.sendMessage(msg.chat.id, message, { reply_markup: inlineKeyboard });
        return;
    } catch (error) {
        console.error('Error fetching cryptocurrency data:', error);
    }
});

bot.on('callback_query', async (query) => {
    const { data } = query;


    if (data?.startsWith('add_')) {
        const symbol = data.substring(4);

    }
    if (data?.startsWith('remove_')) {
        const symbol = data.substring(7);

    } else {
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
        const durationTime: string | undefined = data?.split('_')[1];
        const period: number = Number.parseFloat(durationTime?.split('hours')[0] ?? '0.5');
        let message: string = `Historical date for ${cryptoSymbol}:\n`;

        const response = await axios.get('https://16-crypto-rest-api-01.fly.dev/cryptocurrency', {
            data: {
                cryptocurrency: `${cryptoSymbol}`,
                period: period
            }
        });

        const cryptoData = response.data;
        const chatId: ChatId = query.message?.chat.id as ChatId;
        cryptoData.forEach((crypto: any) => {
            const formattedDate = formatter.format(new Date(crypto.saved_at));
            message = message + 'date: ' + formattedDate + ' - price: ' + crypto.price + '\n';
        })
        bot.sendMessage(chatId, message);
    }

});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});