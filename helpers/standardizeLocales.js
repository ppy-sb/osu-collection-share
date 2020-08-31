/* eslint-disable import/order */
const stringify = require('json-stable-stringify')
const path = require('path')
const fs = require('fs')
const fsp = require('fs').promises
const glob = require('glob')
// joining path of directory
const directoryPath = path.join(__dirname, '../locales')
const backup = path.join(__dirname, '../locales/backup')
if (!fs.existsSync(backup)) {
  fs.mkdirSync(backup)
}
glob(`${directoryPath}/*.json`, function (err, files) {
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.
  // handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err)
  }
  // listing all files using forEach
  files.map(async function (file) {
    try {
      const base = path.basename(file)
      console.log('formatting', base, '...')
      let data = await fsp.readFile(file, 'utf-8')
      console.log('save backup to', `${backup}/${base}`)
      await fsp.writeFile(`${backup}/${base}`, data)
      data = JSON.stringify(JSON.parse(stringify(JSON.parse(data))), null, 2)
      console.log('save to', file)
      await fsp.writeFile(file, data)
    } catch (error) {
      console.log('error on formatting file:', file)
      console.log(error)
    }
  })
})
