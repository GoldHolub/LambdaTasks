import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

const botToken = 'your bot token';
const bot = new TelegramBot(botToken, { polling: true });
bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const textMessage = msg.text ? msg.text.toLowerCase() : '';
    const firstName = msg.from.first_name;
    const lastName = msg.from.last_name;

    if (textMessage === "photo") {
        try {
            const response = await axios.get("https://picsum.photos/200/300", { responseType: "arraybuffer" });
            bot.sendPhoto(chatId, Buffer.from(response.data), { caption: "Here is a random photo" });
        } catch (error) {
            console.error("Can't procces photo", error.message);
        }
    } else {
        if (msg.text) {
            bot.sendMessage(chatId, `User ${firstName} ${lastName} wrote: ${msg.text}`);
            console.log(`User ${firstName} ${lastName} wrote: ${msg.text}`);
        }
        if (msg.photo) {
            bot.sendMessage(chatId, `User ${firstName} ${lastName} sent photo`);
            console.log(`User ${firstName} ${lastName} sent photo`);
        }
    }
});