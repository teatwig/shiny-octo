const Bot = require('./bot');
const TagChecker = require('./tagChecker');

const config = require('./config.json')
const sitesByChatId = require('./data.json');

const tagChecker = new TagChecker(sitesByChatId);
const bot = new Bot(config.bot, tagChecker);
