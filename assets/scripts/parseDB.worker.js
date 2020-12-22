const OsuDBParser = require('osu-db-parser')

self.addEventListener('message', (message) => {
  const { osuDBBuffer, poolBuffer } = message.data
  const ultimateDB = new OsuDBParser(osuDBBuffer, poolBuffer)

  const osuDBData = ultimateDB.getOsuDBData()
  const osuCollectionData = ultimateDB.getCollectionData()
  self.postMessage({ osuDBData, osuCollectionData })
})
