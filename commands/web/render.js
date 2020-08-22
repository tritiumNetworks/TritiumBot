const argParser = require('arg')
const puppeteer = require('puppeteer-core')
const { MessageAttachment } = require('discord.js')
const { readFileSync, unlinkSync, existsSync, mkdirSync, writeFileSync } = require('fs')
const { get } = require('superagent')
const path = require('path').resolve()
const uuid = require('uuid').v4

if (!existsSync(path + '/capture')) mkdirSync(path + '/capture')

/**
 * @param {import('../../classes/Client')} client
 * @param {import('discord.js').Message} msg
 * @param {import('../../classes/Query')} query
 */
async function fn (client, msg, query) {
  let str = query.args.filter((arg) => !arg.startsWith('-')).join(' ').replace('```html', '').split('```').join('')
  const flags = argParser({ '--width': Number, '-w': '--width', '--height': Number, '-h': '--height' }, { argv: query.args, permissive: true })
  if (str.length < 1 && !msg.attachments.first()) return msg.channel.send('저런! 사용방법이 잘못되었어요\n`' + client.settings.prefix + 'help render`로 도움말을 보면 도움이 될꺼에요')
  if (str.length < 1) {
    const res = await get(msg.attachments.first().url).buffer(true)
    if (res.type !== 'text/html') str = res.body.toString()
    else str = res.text
  }
  const m = await msg.channel.send('<a:__tri_loading:745878028093227118> 응답 대기중 & 렌더링중...')
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome-stable' })
  const page = await browser.newPage()
  const uid = uuid()
  await writeFileSync(path + '/capture/' + uid + '.html', str)
  await page.setViewport({ width: flags['--width'] || 800, height: flags['--height'] || 600 })
  await page.goto('file://' + path + '/capture/' + uid + '.html')
  await page.screenshot({ path: path + '/capture/' + uid + '.png' })
  const agent = await browser.userAgent()
  const attach = new MessageAttachment(readFileSync(path + '/capture/' + uid + '.png'))
  await m.delete()
  await msg.channel.send('<a:__tri_success:745878633624895599> 완료! (' + agent + ')', attach)
  await browser.close()

  setTimeout(() => {
    unlinkSync(path + '/capture/' + uid + '.png')
    unlinkSync(path + '/capture/' + uid + '.html')
  }, 10000)
}

module.exports = fn
module.exports.etc = ' [html/file]'
module.exports.args = { '--width=Number / -w=Number': '가로 크기를 지정합니다', '--height=Number / -h=Number': '세로 크기를 지정합니다' }
module.exports.aliases = ['render', 'html']
module.exports.description = '받은 html를 렌더링해 찍어 보내줍니다'
