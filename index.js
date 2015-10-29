'use strict';

const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const parseString = require('xml2js').parseString;

request('http://hdout.tv/RSS/').then(data=>{
  parseString(data.body, (err, result)=>{
    let newEpisodes = result.rss.channel[0].item;
    console.log(newEpisodes);
  });
});
