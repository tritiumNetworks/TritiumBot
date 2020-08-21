const argParser = require('arg')
const { get } = require('superagent')
const { MessageEmbed, User } = require('discord.js')

/**
 * @param {import('../../classes/Client')} client
 * @param {import('discord.js').Message} msg
 * @param {import('../../classes/Query')} query
 */
function fn (client, msg, query) {
  let url = 'https://img.trinets.xyz/api?target=neko&type=url'
  let channel = msg.channel
  let time = 59000

  const flags = argParser({ '--adult': Boolean, '-a': '--adult', '--dm': Boolean, '-d': '--dm', '--timeout': Number, '-t': '--timeout' }, { argv: query.args, permissive: true })
  if (flags['--adult']) url = 'https://img.trinets.xyz/api?target=neko-r19&type=url'
  if (flags['--dm']) channel = msg.author
  if (flags['--timeout']) time = flags['--timeout'] * 1000 - 1000

  if (flags['--adult'] && !(channel instanceof User || channel.nsfw)) return channel.send(new MessageEmbed({ color: 0xff0000, title: '저런! 이 채널은 NSFW 채널이 아니에요!' }))

  // Code from TritimBot v1
  get(url, (err, res) => {
    if (err) {
      channel.send(err)
    } else {
      const emb = flags['--adult']
        ? ':arrow_forward:를 두번 눌러 야짤을 불러옵니다\n주변에 위험한 사람(ex: 부모님)이 있는지 확인한 후 눌러주세요\n(이 기능으로 인해 생기는 문제는 TriNet에서 책임지지 않습니다)\nTL;DR **후방주의**'
        : new MessageEmbed()
          .setColor(Math.floor(Math.random() * 16777215).toString(16))
          .setImage('https://img.trinets.xyz' + res.text)
          .setFooter('Powered by TriDBMS')
          .setDescription(':arrow_forward:를 두번 눌러 다음 네코를 불러올 수 있습니다')

      channel.send(emb).then((targetMsg) => {
        targetMsg.delete({ timeout: time + 1000 })
        targetMsg.react('▶')
        const collector = targetMsg.createReactionCollector((_, user) => user.id === msg.author.id, { time })
        collector.on('collect', () => {
          get(url, (err, res) => {
            if (err) {
              channel.send(err)
            } else {
              const emb = new MessageEmbed()
                .setColor(Math.floor(Math.random() * 16777215).toString(16))
                .setImage('https://img.trinets.xyz' + res.text)
                .setFooter('Powered by TriDBMS')
                .setDescription(':arrow_forward:를 두번 눌러 다음 네코를 불러올 수 있습니다')
              targetMsg.edit('', emb)
              targetMsg.react('▶')
            }
          })
        })
        collector.on('end', () => {
          targetMsg.react('❌')
        })
      })
    }
  })
}

module.exports = fn
module.exports.args = { '--adult / -a': '성잉모드를 실행합니다', '--dm / -d': 'DM으로 전송합니다', '--timeout=Number / -t=Number': '봇이 전송한 이미지가 삭제될 때까지의 시간을 지정합니다' }
module.exports.aliases = ['neko', 'nekogirl']
module.exports.description = '트리넷 이미지 서버를 둘러봅니다'
