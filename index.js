const Bot = require('./octo-telegram/bot')
const TagChecker = require('./octo-core/tagChecker')

const config = require('./config.json')
const sitesByChatId = require('./data.json')

TagChecker.init(sitesByChatId)
Bot.init(config.bot, TagChecker)
