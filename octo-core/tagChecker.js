const request = require('request')
const cheerio = require('cheerio')
const EventEmitter = require('events')

module.exports = {
  init: init,
  handleEvent: handleEvent,
  addSite: addSite,
  poll: poll
}

class TCEmitter extends EventEmitter { }

const emitter = new TCEmitter()
const req = request.defaults({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:63.0) Gecko/20100101 Firefox/63.0'
  }
})
let data

function init (sitesByChatId) {
  data = sitesByChatId
}

function handleEvent (event, func) {
  emitter.on(event, func)
}

function addSite (chatId, site) {
  const sites = data[chatId]
  sites.push(site)
  console.log(sites)
}

function poll (chatId) {
  const sites = data[chatId]
  for (const site of sites) {
    console.log('Trying request for site: ' + site.url)
    req({
      uri: site.url
    }, (error, response, body) => {
      if (error) {
        console.error('error: ', error)
        return
      }

      console.log('statusCode:', response && response.statusCode)
      console.log('Searching for selector: ' + site.sel)

      const $ = cheerio.load(body)
      // console.log($.html());
      const selHtml = $(site.sel).html()
      let msg = `${site.url}\n\`${site.sel}\` - `
      if (selHtml !== null) {
        msg += '*found*'
      } else {
        msg += 'not found'
      }

      emitter.emit('singlePollResult', chatId, msg)
    })
  }
}
