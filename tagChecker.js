const request = require('request');
const cheerio = require('cheerio');
const EventEmitter = require('events');

class TCEmitter extends EventEmitter {}

module.exports = class TagChecker {
    constructor(sitesByChatId) {
        this.sitesByChatId = sitesByChatId;
        this.events = new TCEmitter();

        this.req = request.defaults({
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:63.0) Gecko/20100101 Firefox/63.0'
            }
        })
    }

    addSite(site) {
        this.sites.push(site);
        console.log(this.sites);
    }

    poll(chatId) {
        const sites = this.sitesByChatId[chatId];
        for (const site of sites) {
            console.log('Trying request for site: ' + site.url);
            this.req({
                uri: site.url
            }, (error, response, body) => {
                console.log('statusCode:', response && response.statusCode);
                console.log('Searching for selector: ' + site.sel);

                const $ = cheerio.load(body);
                //console.log($.html());
                const selHtml = $(site.sel).html();
                let msg = `${site.url}\n\`${site.sel}\` - `;
                if (selHtml !== null) {
                    msg += '*found*';
                } else {
                    msg += 'not found';
                }

                this.events.emit('singlePollResult', chatId, msg);
            });
        }
    }
}
