const { readdirSync, statSync } = require('fs')

// from https://gist.github.com/kethinov/6658166
function readRecursively (dir, filelist = []) {
  const files = readdirSync(dir)
  files.forEach((file) => {
    if (statSync(dir + '/' + file).isDirectory()) filelist = readRecursively(dir + '/' + file, filelist)
    else filelist.push(dir + '/' + file)
  })

  return filelist
}

// from https://stackoverflow.com/a/3710226
function isJsonStr (str) {
  try { JSON.parse(str) } catch (e) { return false }
  return true
}

module.exports = { readRecursively, isJsonStr }
