/**
 * @param {import('../classes/Client')} client
 */
async function onReady (client) {
  console.log(
    client.user.username + ' is now online!\n' +
    'prefix: ' + client.settings.prefix
  )

  function cfn () { client.user.setActivity('~$help | 감시한다 ' + client.users.cache.array().length + '명') }
  cfn()
  setInterval(cfn, 30000)
}

module.exports = onReady
