const { MessageEmbed } = require('discord.js')

/**
 * @param {import('../../classes/Client')} client
 * @param {import('discord.js').Message} msg
 * @param {import('../../classes/Query')} query
 */
async function fn (client, msg, query) {
  const { commands } = client
  const m = await msg.channel.send('<a:__tri_loading:745878028093227118> 리스트 불러오는중...')
  const emb = new MessageEmbed({ color: 0x6bedd4 })
  emb.setAuthor(commands.length + '개의 커멘드 로드됨\n', 'https://cdn.discordapp.com/emojis/745878633624895599.gif')
  commands.forEach((cmd) => {
    let title = client.settings.prefix + cmd.aliases[0] + (cmd.etc || '') + ' '
    Object.keys(cmd.args).forEach((arg) => {
      title += '[' + arg + '] '
    })

    let desc = cmd.description + '\n'
    Object.keys(cmd.args).forEach((arg) => {
      desc += '\n' + arg + ' : ' + cmd.args[arg]
    })

    emb.addField(title, desc)
  })

  m.edit('', emb)
}

module.exports = fn
module.exports.args = {}
module.exports.aliases = ['help', '도움']
module.exports.description = '이 화면을 출력합니다'
