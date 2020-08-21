const argParser = require('arg')

/**
 * @param {import('../../classes/Client')} client
 * @param {import('discord.js').Message} msg
 * @param {import('../../classes/Query')} query
 */
function fn (client, msg, query) {
  msg.channel.send('<a:__tri_loading:745878028093227118> 삭제중...')
    .then(async (m) => {
      const recursive = argParser({ '--recursive': Boolean, '-r': '--recursive' }, { argv: query.args, permissive: true })['--recursive']
      const rawchmsgs = await msg.channel.messages.fetch()
      const chmsgs = rawchmsgs.filter((chmsg) => (chmsg.author.id === client.user.id || (recursive && chmsg.content.startsWith(client.settings.prefix))) && chmsg.deletable)
      msg.channel.bulkDelete(chmsgs)

      const dela = await m.channel.send('<a:__tri_success:745878633624895599> ' + chmsgs.array().length + '개의 메세지를 삭제했어요')
      dela.delete({ timeout: 5000 })
    })
}

module.exports = fn
module.exports.args = { '--recursive / -r': '커멘드를 사용한 메세지까지 삭제합니다' }
module.exports.aliases = ['clear', 'cls', '청소']
module.exports.description = '봇 메세지를 삭제합니다'
