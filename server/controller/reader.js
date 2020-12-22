const mongoose = require('mongoose')
const models = require('../database/models.js')
class PoolReader {
  constructor (query) {
    this.query = query
    this.models = models
  }

  strcmp (a, b) {
    return (a < b ? -1 : (a > b ? 1 : 0))
  }

  async toPool () {
    const { Pool, PoolSet, PoolBeatmap, User } = this.models
    const pool = await Pool.findOne(this.query).exec().then(doc => doc.toObject()).catch(_err => null)
    if (!pool) { return null }

    const user = await User.findOne(pool.user).exec().then(doc => doc.toObject()).catch(_err => null)
    const pools = await PoolSet.find({ pool: { _id: pool._id } }).exec().then(docs => docs.map(doc => doc.toObject())).catch(_err => null)

    const allPoolMaps = await PoolBeatmap.find({ pool: { _id: pool._id } }).exec().then(docs => docs.map(doc => doc.toObject())).catch(_err => null)
    const allBeatmaps = await this.docPoolBeatmapToMap(allPoolMaps)
    const poolResult = allPoolMaps.reduce((acc, map, index) => {
      const beatmap = allBeatmaps.find(beatmap => beatmap._id.toString() === map.beatmap._id.toString())
      const bracket = acc.find(what => what._id.toString() === map.poolSet._id.toString())
      if (!bracket.maps) { bracket.maps = [] }
      if (!beatmap) { console.log(map) }
      bracket.maps.push(beatmap)
      return acc
    }, pools)
    const compiledPoolData = poolResult.map((pool) => {
      return {
        name: pool.name,
        _id: pool._id,
        slug: pool.slug,
        mapsets: this.mapListToMapsetList(pool.maps)
      }
    })
    return {
      pool,
      user,
      compiledPoolData
    }
  }

  mapListToMapsetList (mapset) {
    return mapset.reduce((acc, beatmap) => {
      // if (beatmap.unknown) {
      //   console.log('unknown beatmap', beatmap.md5)
      //   return acc
      // }
      let set = acc.find(set => set.id === beatmap.beatmapset_id)
      if (!set) {
        set = {
          id: beatmap.beatmapset_id,
          artist: {
            name: beatmap.artist_name,
            unicodeName: beatmap.artist_name_unicode
          },
          song: {
            title: beatmap.song_title,
            unicodeTitle: beatmap.song_title_unicode
          },
          thread: beatmap.thread_id,
          maps: []
        }
        acc.push(set)
      }
      set.maps.push(beatmap)
      return acc
    }, [])
  }

  async docPoolBeatmapToMap (cbs) {
    const ids = cbs.map(cb => mongoose.Types.ObjectId(cb.beatmap._id))
    return await this.models.Beatmap.find().where('_id').in(ids).exec()
    // .then(res =>{
    //   return res.map(d => d.toObject())
    // })
  }
}

module.exports = PoolReader
