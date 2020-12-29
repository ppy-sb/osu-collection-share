const mongoose = require('mongoose')
const models = require('../database/models.js')
class CollectionReader {
  constructor (query) {
    this.query = query
    this.models = models
  }

  strcmp (a, b) {
    return (a < b ? -1 : (a > b ? 1 : 0))
  }

  async toCollection () {
    const { CollectionDB, CollectionSet, CollectionBeatmap, User } = this.models
    const collectionDB = await CollectionDB.findOne(this.query).exec().then(doc => doc.toObject()).catch(_err => null)
    if (!collectionDB) { return null }
    this.collectionDB = collectionDB

    const user = await User.findOne(collectionDB.user).exec().then(doc => doc.toObject()).catch(_err => null)
    const collections = await CollectionSet.find({ collectionDB: { _id: collectionDB._id } }).exec().then(docs => docs.map(doc => doc.toObject())).catch(_err => null)
    const allCollectionMaps = await CollectionBeatmap.find({ collectionDB: { _id: collectionDB._id } }).exec().then(docs => docs.map(doc => doc.toObject())).catch(_err => null)
    const allBeatmaps = await this.docCollectionBeatmapToMap(allCollectionMaps)
    const collectionResult = allCollectionMaps.reduce((acc, map, index) => {
      const beatmap = allBeatmaps.find(beatmap => beatmap._id.toString() === map.beatmap._id.toString())
      const collection = acc.find(what => what._id.toString() === map.collectionSet._id.toString())
      if (!collection.maps) { collection.maps = [] }
      if (!beatmap) { console.log(map) }
      beatmap.index = map.index
      beatmap.localOffset = map.localOffset
      collection.maps.push(beatmap)
      return acc
    }, collections)
    const compiledCollectionData = collectionResult.map((collection) => {
      return {
        name: collection.name,
        _id: collection._id,
        slug: collection.slug,
        mod: collection.mod,
        scoreType: collection.scoreType,
        tournament: collection.tournament,
        mapsets: this.mapListToMapsetList(collection.maps)
      }
    })
    return {
      collectionDB,
      user,
      compiledCollectionData
    }
  }

  mapListToMapsetList (mapset) {
    if (this.collectionDB.tournament) { mapset.sort((a, b) => a.index - b.index) }
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

  async docCollectionBeatmapToMap (cbs) {
    const ids = cbs.map(cb => mongoose.Types.ObjectId(cb.beatmap._id))
    return await this.models.Beatmap.find().where('_id').in(ids).exec()
      .then((res) => {
        return res.map(d => d.toObject())
      })
  }
}

module.exports = CollectionReader
