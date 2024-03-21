import {program} from "commander";
import fs from "fs";
import TelegramBot from "node-telegram-bot-api";

const botToken = 'your bot token';
const chatId = 'your chat id';
const bot = new TelegramBot(botToken);

program.command('message <text>')
  .description('Send a message to the Telegram bot')
  .action((text) => {
    bot.sendMessage(chatId, text);
  });

program
  .command('photo <path>')
  .description('Send a photo to the Telegram bot')
  .action((path) => {
    const photo = fs.readFileSync(path);
    bot.sendPhoto(chatId, photo);
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
