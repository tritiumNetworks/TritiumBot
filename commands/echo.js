const argParser = require('arg')

/**
 * @param {import('../classes/Client')} client
 * @param {import('discord.js').Message} msg
 * @param {import('../classes/Query')} query
 */
async function fn (_, msg, query) {
  const str = query.args.filter((arg) => !arg.startsWith('-')).join(' ')
  const flags = argParser({ '--delete': Boolean, '-d': '--delete', '--timeout': Number, '-t': '--timeout' }, { argv: query.args, permissive: true })
  const m = await msg.channel.send(str)
  if (flags['--delete'] && msg.deletable) msg.delete()
  if (flags['--timeout']) m.delete({ timeout: flags['--timeout'] * 1000 })
}

module.exports = fn
module.exports.aliases = ['echo', 'say', '말하기']
