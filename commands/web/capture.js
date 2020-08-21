const argParser = require('arg')
const puppeteer = require('puppeteer-core')
const { MessageAttachment } = require('discord.js')
const { readFileSync, unlinkSync, existsSync, mkdirSync } = require('fs')
const path = require('path').resolve()
const uuid = require('uuid').v4

if (!existsSync(path + '/capture')) mkdirSync(path + '/capture')

/**
 * @param {import('../../classes/Client')} client
 * @param {import('discord.js').Message} msg
 * @param {import('../../classes/Query')} query
 */
async function fn (client, msg, query) {
  const str = query.args.filter((arg) => !arg.startsWith('-')).join(' ')
  const flags = argParser({ '--width': Number, '-w': '--width', '--height': Number, '-h': '--height' }, { argv: query.args, permissive: true })
  if (str.length < 1) return msg.channel.send('저런! 사용방법이 잘못되었어요\n`' + client.settings.prefix + 'help capture`로 도움말을 보면 도움이 될꺼에요')
  const m = await msg.channel.send('<a:__tri_loading:745878028093227118> 응답 대기중 & 렌더링중...')
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome-stable' })
  const page = await browser.newPage()
  const uid = uuid()
  await page.setViewport({ width: flags['--width'] || 800, height: flags['--height'] || 600 })
  await page.goto(str)
  await page.screenshot({ path: path + '/capture/' + uid + '.png' })
  const agent = await browser.userAgent()
  const attach = new MessageAttachment(readFileSync(path + '/capture/' + uid + '.png'))
  await m.delete()
  await msg.channel.send('<a:__tri_success:745878633624895599> 완료! (' + agent + ')', attach)
  await browser.close()

  setTimeout(() => {
    unlinkSync(path + '/capture/' + uid + '.png')
  }, 10000)
}

module.exports = fn
module.exports.etc = ' <주소>'
module.exports.args = { '--width=Number / -w=Number': '가로 크기를 지정합니다', '--height=Number / -h=Number': '세로 크기를 지정합니다' }
module.exports.aliases = ['chrome', 'capture']
module.exports.description = '웹 사이트를 찍어 보내줍니다'
