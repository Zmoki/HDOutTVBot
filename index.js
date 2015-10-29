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

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let today = new Date();
today = [today.getDate(), months[today.getMonth()], today.getFullYear()];
today = today.join(' ');

bot.onText(/\/today/, (msg)=>{
  let chatId = msg.chat.id;
  let response = '';

  request('http://hdout.tv/RSS/').then(data=>{
    parseString(data.body, (err, result)=>{
      let newEpisodes = result.rss.channel[0].item.filter(item=>{
        return item.pubDate[0].indexOf(today) > -1;
      });

      if(newEpisodes.length){
        newEpisodes.forEach(episode=>{
          response += '[' + episode.title + '](' + episode.link + ')\n\t';
        });
      } else{
        response = 'No new episodes';
      }

      bot.sendMessage(chatId, response);
    });
  });
});
