/**
 * @param {import('../../classes/Client')} client
 * @param {import('discord.js').Message} msg
 * @param {import('../../classes/Query')} query
 */
async function fn (client, msg, query) {
  if (msg.author.id !== client.settings.owner) return
  const str = query.args.filter((arg) => !arg.startsWith('-')).join(' ').replace('```js', '').split('```').join('')
  const m = await msg.channel.send('<a:__tri_loading:745878028093227118> 실행중...')

  let res

  try {
    // eslint-disable-next-line no-eval
    res = String(await eval(str))
  } catch (error) {
    res = String(error)
  }

  res = res.split(client.settings.token).join('<hidden>')

  m.edit('<a:__tri_success:745878633624895599> 완료!```\n' + res + '```')
}

module.exports = fn
module.exports.hide = true
module.exports.aliases = ['run', 'eval']
