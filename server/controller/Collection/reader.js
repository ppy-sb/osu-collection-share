const mongoose = require('mongoose')
const models = require('~models')
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
    const collectionDB = await CollectionDB.findOneAndUpdate(this.query, { $inc: { 'count.view': 1 } }, { setDefaultsOnInsert: true, new: true }).exec().then(doc => doc.toObject()).catch((_err) => {
      return {
        error: _err
      }
    })
    if (!collectionDB) { return null }
    this.collectionDB = collectionDB

    const user = await User.findOne(collectionDB.user).exec().then(doc => doc.toObject()).catch(_err => null)
    const collections = await CollectionSet.find({ collectionDB: { _id: collectionDB._id } }).exec().then(docs => docs.map(doc => doc.toObject())).catch(_err => console.warn)
    collections.map((c) => { c.maps = [] })
    const allCollectionMaps = await CollectionBeatmap.find({ collectionDB: { _id: collectionDB._id } }).exec().then(docs => docs.map(doc => doc.toObject())).catch(_err => null)
    const allBeatmaps = await this.docCollectionBeatmapToMap(allCollectionMaps)
    allCollectionMaps.map((map, index) => {
      const beatmap = allBeatmaps.find(beatmap => beatmap._id.toString() === map.beatmap._id.toString())
      const collection = collections.find(what => what._id.toString() === map.collectionSet._id.toString())
      if (!beatmap) { console.log(map) }
      beatmap.index = map.index
      beatmap.localOffset = map.localOffset
      collection.maps.push(beatmap)
    })
    const compiledCollectionData = collections.map((collection) => {
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
