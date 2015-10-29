'use strict';

const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const parseString = require('xml2js').parseString;
const TelegramBot = require('node-telegram-bot-api');

const TelegramBotToken = process.env.TELEGRAM_BOT_TOKEN || '169257788:AAE_Nqcs762uKLlq3of2-mLZaS8doPcT5p0';
const TelegramBotOptions = {
  polling: true
};

let bot = new TelegramBot(TelegramBotToken, TelegramBotOptions);

bot.onText(/\/new/, (msg)=>{
  let chatId = msg.chat.id;
  let response = '';

  request('http://hdout.tv/RSS/').then(data=>{
    parseString(data.body, (err, result)=>{
      let newEpisodes = result.rss.channel[0].item;

      for(let i = 0; i < 10; i++){
        response += '[' + newEpisodes[i].title + '](' + newEpisodes[i].link + ')\n\t';
      }

      bot.sendMessage(chatId, response);
    });
  });
});
