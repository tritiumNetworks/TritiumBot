const argParser = require('arg')
const { get } = require('superagent')

/**
 * @param {import('../classes/Client')} client
 * @param {import('discord.js').Message} msg
 * @param {import('../classes/Query')} query
 */
async function fn (_, msg, query) {
  const m = await msg.channel.send('<a:__tri_loading:745878028093227118> 응답 대기중...')
  const flags = argParser({ '--header': [String], '-h': '--header' }, { argv: query.args, permissive: true })
  const builder = get(query.args[0]);

  (flags['--header'] || []).forEach((h) => {
    builder.set(h.split(':')[0], h.split(':')[1])
  })

  builder.then((res) => {
    m.edit('```\n' + res.text.substring(0, 1000) + '```')
  })

  builder.catch((res) => {
    m.edit('```js\n' + res + '```')
  })
}

module.exports = fn
module.exports.etc = ' <url>'
module.exports.args = { '--header=Key:Value / -h=Key:Value': '헤더를 지정합니다' }
module.exports.aliases = ['http']
module.exports.description = 'http get 신호를 보내고 응답을 출력합니다'
