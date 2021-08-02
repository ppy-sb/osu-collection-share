const Mongoose = require('mongoose')
const slug = require('slug')
const models = require('../../database/models.js')
const getSlug = require('../slug.js')
// const UserController = require('../User')

class CollectionSet {
  constructor ({ collectionDB, user, compiledCollectionData }) {
    this.collectionDB = collectionDB
    this.user = user
    this.compiledCollectionData = compiledCollectionData
    this.models = models
  }

  /**
 * Bulk-upsert an array of records
 * @param  {Array}    records  List of records to update
 * @param  {Model}    Model    Mongoose model to update
 * @param  {Object}   match    Database field to match
 * @return {Promise}  always resolves a BulkWriteResult
 */
  bulkSave (records, Model, match) {
    match = match || ['id']
    return new Promise(function (resolve, reject) {
      const bulk = Model.collection.initializeUnorderedBulkOp()
      records.map(function (record) {
        const query = {}
        match.map((m) => { query[m] = record[m] })
        bulk.find(query).upsert().updateOne(record)
      })
      bulk.execute(function (err, bulkres) {
        if (err) { return reject(err) }
        resolve(bulkres)
      })
    })
  }

  async populateBeatmap () {
    const allMaps = this.compiledCollectionData.reduce((acc, collection) => {
      collection.mapsets.map(set => acc.push(...set.maps))
      return acc
    }, [])
    const reducedMaps = allMaps.filter((thing, index, self) =>
      index === self.findIndex(t => (
        t.md5 === thing.md5
      )))
    // console.log(allMaps.length, reducedMaps.length)

    // upserting all maps to beamtap
    const beatmapDocs = await Promise.all(reducedMaps.map(async (beatmap) => {
      let doc = await this.models.Beatmap.findOne({ md5: beatmap.md5 }).exec()
      if (!doc) { doc = await this.models.Beatmap.create(beatmap) }
      return doc.toObject()
    }))
    return beatmapDocs
  }

  async save () {
    const { CollectionDB, CollectionSet, CollectionBeatmap } = this.models

    // insert new beatmaps to the beatmap collections
    const beatmapDocs = await this.populateBeatmap()
    const beatmapDocSets = new Map(beatmapDocs.map(b => [b.md5, b]))

    if (!this.user.anonymous) {
      // create or find user
      const user = await models.User.findOne({ _id: Mongoose.Types.ObjectId(this.user._id) })
      // const user = await this.findOrCreateUser()

      // create collectionDB
      if (user._id) { this.collectionDB.user = { _id: user._id } }
    } else {
    }
    const dbSlug = await getSlug(this.collectionDB.slug, CollectionDB)
    if (dbSlug.sameCollectionDBExists) { this.collectionDB.slug = dbSlug.nextAvailable } else { this.collectionDB.slug = dbSlug.slug }
    const collectionDB = await CollectionDB.create(this.collectionDB)

    // create CollectionSets
    const collectionSets = await CollectionSet.create(this.compiledCollectionData.map((collection) => {
      collection.collectionDB = collectionDB
      collection.slug = slug(collection.name)
      return collection
    })).then(b => b.map(collection => collection.toObject()))

    // create Sets
    const setCache = new Map()
    await Promise.all(this.compiledCollectionData.map(async (collection, collectionIndex) => {
      // const s = collection.mapsets.map((beatmapset) => {
      //   beatmapset.collectionSet = collection.collectionSet
      //   beatmapset.collectionDB = collectionDB
      //   return beatmapset
      // })
      const beatmapsets = await Promise.all(collection.mapsets.map(async (s) => {
        const hash = s.id + s.folderName
        if (setCache.has(hash)) { return setCache.get(hash) }
        const set = await this.findOrCreateSet(s)
        setCache.set(hash, set)
      }))

      // create CollectionBeatmap
      collection.mapsets.map((beatmapset, beatmapsetIndex) => {
        CollectionBeatmap.create(beatmapset.maps.map(map => ({
          beatmap: beatmapDocSets.get(map.md5),
          collectionSet: collectionSets[collectionIndex],
          set: beatmapsets[beatmapsetIndex],
          collectionDB,
          index: map.index
        }))).catch(error => console.warn(error))
      })
    }))
    return {
      collectionDB
    }
  }

  // findOrCreateUser () {
  //   return UserController.findOrCreateUser(this.user)
  // }

  async findOrCreateSet (s) {
    const { Set } = this.models
    let set
    const _set = await Set.findOne({ $or: [{ id: s.id }, { folderName: s.folderName }] }).exec()
    if (_set) { set = _set } else { set = await Set.create(s) }

    return set
  }
}

module.exports = CollectionSet

// {
//   collectionDB: { name: "arily's collection", slug: 'arilys-collection' },
//   user: { name: 'arily' },
//   compiledCollectionData: [
//     { name: 'A', id: 'A', mapsets: [Array], upload: true },
//     { name: 'Fav', id: 'Fav', mapsets: [Array], upload: true },
//     {
//       name: 'HD HDDT1',
//       id: 'HD_HDDT1',
//       mapsets: [Array],
//       upload: true
//     },
//     {
//       name: 'HD HDDT2',
//       id: 'HD_HDDT2',
//       mapsets: [Array],
//       upload: true
//     },
//     {
//       name: 'HD HDHR1',
//       id: 'HD_HDHR1',
//       mapsets: [Array],
//       upload: true
//     },
//     {
//       name: 'HD HDHR2',
//       id: 'HD_HDHR2',
//       mapsets: [Array],
//       upload: true
//     },
//     {
//       name: 'HD LowAR1',
//       id: 'HD_LowAR1',
//       mapsets: [Array],
//       upload: true
//     },
//     {
//       name: 'HD LowAR2',
//       id: 'HD_LowAR2',
//       mapsets: [Array],
//       upload: true
//     },
//     { name: 'HD NM1', id: 'HD_NM1', mapsets: [Array], upload: true },
//     { name: 'HD NM2', id: 'HD_NM2', mapsets: [Array], upload: true },
//     { name: 'HD TB', id: 'HD_TB', mapsets: [Array], upload: true },
//     { name: 'HD TB2', id: 'HD_TB2', mapsets: [Array], upload: true },
//     { name: 'pp', id: 'pp', mapsets: [Array], upload: true },
//     { name: 'tech', id: 'tech', mapsets: [Array], upload: true },
//     { name: 'zhou', id: 'zhou', mapsets: [Array], upload: true }
//   ]
// }
