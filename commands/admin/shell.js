const { exec } = require('child_process')

/**
 * @param {import('../../classes/Client')} client
 * @param {import('discord.js').Message} msg
 * @param {import('../../classes/Query')} query
 */
async function fn (client, msg, query) {
  if (msg.author.id !== client.settings.owner) return
  const str = query.args.join(' ').replace('```sh', '').split('```').join('')
  const m = await msg.channel.send('<a:__tri_loading:745878028093227118> 실행중...')

  exec(str, (_, stdout, stderr) => {
    m.edit('<a:__tri_success:745878633624895599> 완료!```\n' + (stdout || stderr) + '```')
  })
}

module.exports = fn
module.exports.hide = true
module.exports.aliases = ['shell', 'sh']
