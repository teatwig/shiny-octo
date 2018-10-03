const TelegramBot = require('node-telegram-bot-api')

const opts = {
  parse_mode: 'Markdown'
}

module.exports = class Bot {
  constructor (config, thing) {
    this.thing = thing

    this.thing.events.on('singlePollResult', (chatId, msg) => {
      this.sendPollResult(chatId, msg)
    })

    this.bot = new TelegramBot(config.token, { polling: true })

    this.bot.onText(/\/add (.+)/, (msg, match) => {
      this.thing.addSite({
        site: match[1],
        userId: msg.chat.id
      })
    })

    this.bot.onText(/\/poll/, (msg, match) => {
      this.thing.poll(msg.chat.id)
    })

    this.bot.on('message', (msg) => {
      const date = new Date(msg.date * 1000)
      console.log(`[${date.toISOString()}] ${msg.chat.id}: ${msg.text}`)
    })

    this.bot.on('polling_error', (error) => {
      let time = new Date()
      console.log('TIME:', time)
      console.log('NODE_CODE:', error.code)
      console.log('MSG:', error.message)
      console.log('STACK:', error.stack)
    })
  }

  sendPollResult (chatId, msg) {
    this.bot.sendMessage(chatId, msg, opts)
  }
}
