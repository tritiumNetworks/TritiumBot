/**
 * @param {import('../classes/Query')} query
 * @param {String[]} arr
 */
function checkArgs (query, arr) {
  let sw = false
  arr.forEach((str) => {
    if (query.args.includes(str)) sw = true
  })

  return sw
}

module.exports = { checkArgs }
