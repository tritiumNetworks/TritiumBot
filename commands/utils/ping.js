const argParser = require('arg')

/**
 * @param {import('../classes/Client')} client
 * @param {import('discord.js').Message} msg
 * @param {import('../classes/Query')} query
 */
function fn (client, msg, query) {
  msg.channel.send('<a:__tri_loading:745878028093227118> 측정중...')
    .then((m) => {
      const mcycle = m.createdTimestamp - msg.createdTimestamp
      let str = '<a:__tri_success:745878633624895599> ' + (mcycle > client.ws.ping ? mcycle : client.ws.ping) + 'ms'
      if (argParser({ '--detail': Boolean, '-d': '--detail' }, { argv: query.args, permissive: true })['--detail']) {
        str = '<a:__tri_success:745878633624895599>\n' +
          '메세지 사이클: **' + mcycle + 'ms**\n사용자의 메세지 감지부터 응답 메세지 전송까지의 속도\n\n' +
          '웹소켓: **' + client.ws.ping + 'ms**\n디스코드에서 제공하는 서버와 트리넷 서버간 응답 속도'
      }

      m.edit(str)
    })
}

module.exports = fn
module.exports.args = { '--detail / -d': '더 자세한 정보를 출력합니다' }
module.exports.aliases = ['ping', '핑', 'pong']
module.exports.description = '서버와의 통신 속도를 출력합니다'
