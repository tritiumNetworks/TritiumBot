const { get } = require('superagent')
const { MessageEmbed } = require('discord.js')
const { isJsonStr } = require('../../../utils')
const argParser = require('arg')

/**
 * @param {import('../../../classes/Client')} client
 * @param {import('discord.js').Message} msg
 * @param {import('../../../classes/Query')} query
 */
async function fn (_, msg, query) {
  const flags = argParser({ '--aur': Boolean, '-a': '--aur' }, { argv: query.args, permissive: true })
  const str = query.args.filter((arg) => !arg.startsWith('-')).join(' ')
  const m = await msg.channel.send('<a:__tri_loading:745878028093227118> 검색중...')

  if (flags['--aur']) {
    const res = await get('https://aur.archlinux.org/rpc/?v=5&type=search&arg=' + encodeURIComponent(str))
    if (!isJsonStr(res.text) || res.error) return

    const length = res.body.results.length
    if (length < 1) return m.edit('', new MessageEmbed({ color: 0xff0000, author: { name: str + ' 검색 결과가 없어요...' } }))

    const result = res.body.results[0]
    const date = new Date(result.LastModified)

    const emb = new MessageEmbed({ color: 0x00ff00 })
      .setAuthor('AUR: ' + str + ' 검색 완료', 'https://cdn.discordapp.com/emojis/745878633624895599.gif')
      .addFields([
        { name: '패키지 이름', value: result.Name, inline: true },
        { name: '버전', value: result.Version, inline: true },
        { name: '업뎃날짜', value: [String(date.getMonth() + 1).padStart(2, '0'), date.getDate()].join('/'), inline: true },
        { name: '패키지 설명', value: result.Description },
        { name: '메인테이너', value: result.Maintainer }
      ])
      .setFooter('이것 외에도 ' + (length - 1) + '개의 패키지를 찾았어요')

    m.edit('', emb)
  } else {
    const res = await get('https://www.archlinux.org/packages/search/json/?name=' + encodeURIComponent(str))
    if (!isJsonStr(res.text) || res.error) return

    const length = res.body.results.length
    if (length < 1) return m.edit('', new MessageEmbed({ color: 0xff0000, author: { name: str + ' 검색 결과가 없어요...' } }))

    const result = res.body.results[0]
    const date = new Date(result.last_update)

    const emb = new MessageEmbed({ color: 0x00ff00 })
      .setAuthor(result.repo.charAt(0).toUpperCase() + result.repo.slice(1) + ': ' + str + ' 검색 완료', 'https://cdn.discordapp.com/emojis/745878633624895599.gif')
      .addFields([
        { name: '패키지 이름', value: result.pkgname, inline: true },
        { name: '버전', value: result.pkgver, inline: true },
        { name: '업뎃날짜', value: [String(date.getMonth() + 1).padStart(2, '0'), date.getDate()].join('/'), inline: true },
        { name: '패키지 설명', value: result.pkgdesc },
        { name: '메인테이너', value: result.maintainers.join(', ') }
      ])
      .setFooter('이것 외에도 ' + (length - 1) + '개의 패키지를 찾았어요')

    m.edit('', emb)
  }
}

module.exports = fn
module.exports.etc = ' <패키지 이름>'
module.exports.args = { '--aur / -a': '공식레포 대신 AUR에서 패키지를 검색합니다' }
module.exports.aliases = ['arch', 'archlinux']
module.exports.description = '아치리눅스 공식 레포 & AUR에서 패키지를 검색합니다'
