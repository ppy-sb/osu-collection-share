const fs = require('fs')
const slug = require('slug')
const OsuDBParser = require('osu-db-parser')
const osuDBbuffer = Buffer.from(fs.readFileSync('/Users/kousakananako/Documents/GitHub/osu-collection-share/example_data/osu!.db'))
const collectionBuffer = Buffer.from(fs.readFileSync('/Users/kousakananako/Documents/GitHub/osu-collection-share/example_data/collection.db'))
const ultimateDB = new OsuDBParser(osuDBbuffer, collectionBuffer)

const osuDBData = ultimateDB.getOsuDBData()
const osuCollectionData = ultimateDB.getCollectionData()
function findMapInOsuDB (map) {
  return osuDBData.beatmaps.find(beatmap => beatmap.md5 === map.md5)
}
// return { osuCollectionData, osuDBData }
// console.log(Object.keys(osuDBData))
// console.log(Object.keys(osuCollectionData))
const collections = osuCollectionData.collection.map((collection) => {
  return {
    name: collection.name,
    // slug: slug(osuDBData.username + '-' + collection.name),
    maps: collection.beatmapsMd5.map(md5 => findMapInOsuDB({ md5 }) || { md5, unknown: true })
  }
}).filter(collection => collection.maps.length)
// this.compiledCollectionData = collections.map((collection) => {
//   return {
//     name: collection.name,
//     id: collection.id,
//     mapsets: this.mapListToMapsetList(collection.maps)
//   }
// })
console.log(collections)
