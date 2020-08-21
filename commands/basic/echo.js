const argParser = require('arg')

/**
 * @param {import('../../classes/Client')} client
 * @param {import('discord.js').Message} msg
 * @param {import('../../classes/Query')} query
 */
async function fn (_, msg, query) {
  const str = query.args.filter((arg) => !arg.startsWith('-')).join(' ')
  const flags = argParser({ '--delete': Boolean, '-d': '--delete', '--timeout': Number, '-t': '--timeout' }, { argv: query.args, permissive: true })
  const m = await msg.channel.send(str)
  if (flags['--delete'] && msg.deletable) msg.delete()
  if (flags['--timeout']) m.delete({ timeout: flags['--timeout'] * 1000 })
}

module.exports = fn
module.exports.etc = ' <메세지>'
module.exports.args = { '--delete / -d': '커멘드를 사용한 메세지를 삭제합니다', '--timeout=Number / -t=Number': '봇이 전송한 메세지가 삭제될 때까지의 시간을 지정합니다' }
module.exports.aliases = ['echo', 'say', '말하기']
module.exports.description = '입력한 메세지를 다시 출력합니다'
