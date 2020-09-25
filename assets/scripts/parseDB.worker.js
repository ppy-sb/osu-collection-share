const OsuDBParser = require('osu-db-parser')

self.addEventListener('message', (message) => {
  const { osuDBBuffer, collectionDBBuffer } = message.data
  const ultimateDB = new OsuDBParser(osuDBBuffer, collectionDBBuffer)

  const osuDBData = ultimateDB.getOsuDBData()
  const osuCollectionData = ultimateDB.getCollectionData()
  self.postMessage({ osuDBData, osuCollectionData })
})
