const TelegramBot = require('node-telegram-bot-api')

module.exports = {
  init: init
}

const botOpts = {
  polling: true
}

const msgOpts = {
  parse_mode: 'Markdown'
}

let bot
let tc

function init (config, tagChecker) {
  bot = new TelegramBot(config.token, botOpts)
  tc = tagChecker

  bot.onText(/\/add (\S+) (\S+)/, (msg, match) => {
    tc.addSite(msg.chat.id, {
      url: match[1],
      sel: match[2]
    })
  })

  bot.onText(/\/poll/, (msg) => {
    tc.poll(msg.chat.id)
  })
  tc.handleEvent('singlePollResult', (chatId, msg) => {
    sendPollResult(chatId, msg)
  })

  bot.on('message', (msg) => {
    const date = new Date(msg.date * 1000)
    console.log(`[${date.toISOString()}] ${msg.chat.id}: ${msg.text}`)
  })

  bot.on('polling_error', (error) => {
    let time = new Date()
    console.log('TIME:', time)
    console.log('NODE_CODE:', error.code)
    console.log('MSG:', error.message)
    console.log('STACK:', error.stack)
  })
}

function sendPollResult (chatId, msg) {
  bot.sendMessage(chatId, msg, msgOpts)
}
