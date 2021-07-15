const mongoose = require('../server/database/connect')
const db = require('../server/database/models')
const c = mongoose.connection
async function fixDuplicateSet () {
  const aggregate = [{
    $match: {
      id: { $exists: true },
      folderName: { $exists: true }
    }
  }, {
    $group: {
      _id: '$folderName',
      id: { $push: '$id' },
      oid: { $push: '$_id' },
      oidCount: { $sum: 1 }
    }
  }, {
    $match: {
      oidCount: { $gt: 1 }
    }
  }]
  // const setMap = new Map()
  const pointer = db.Set.aggregate(aggregate)
  for await (const dup of pointer) {
    // {
    //   _id: '809913 Porta - Dragon Ball Rap',
    //   id: [ 809913, 809913 ],
    //   oid: [ 60b81853b867b61a8ea72582, 60b81853b867b61a8ea725c9 ],
    //   oidCount: 2
    // }
    // console.log(dup._id)
    const same = dup.id.every(value => value === dup.id[0])
    let useOid, removeOidFromCollectionBeatmaps
    if (!same) {
      const potentialSid = parseInt(dup._id.split(' ')[0])
      console.log(potentialSid)
      if (!dup.id.includes(potentialSid)) { console.log(dup._id, potentialSid); continue }
      const oidIndex = dup.id.findIndex(i => i === potentialSid)
      useOid = dup.oid.splice(oidIndex, 1)
      removeOidFromCollectionBeatmaps = dup.oid
      console.log(dup._id, 'will use sid', potentialSid)
    } else {
      useOid = dup.oid.pop()
      removeOidFromCollectionBeatmaps = dup.oid
    }

    // console.log('use', useOid, ', remove', removeOidFromCollectionBeatmaps)
    const result = await db.CollectionBeatmap.updateMany({
      'set._id': { $in: removeOidFromCollectionBeatmaps }
    }, {
      $set: {
        'set._id': useOid
      }
    })
    await db.Set.deleteMany({
      _id: { $in: removeOidFromCollectionBeatmaps }
    })
    console.log(result.nModified)
  }
  console.log('duplicate fix: done')
}
async function removeNulledCollectionBeatmap () {
  const aggregate = [{
    $lookup: {
      from: 'collectiondbs',
      localField: 'collectionDB._id',
      foreignField: '_id',
      as: 'collections'
    }
  }, {
    $unwind: {
      path: '$collections',
      preserveNullAndEmptyArrays: true
    }
  }, {
    $match: {
      collections: null
    }
  }, {
    $group: {
      _id: '$collectionDB._id'
    }
  }]
  const oids = []
  await db.CollectionSet.aggregate(aggregate).exec().then(res => res.map(b => oids.push(b._id)))
  console.log('remove anything related to', oids.length, 'deleted collections')
  const deletedBeatmap = await db.CollectionBeatmap.deleteMany({
    'collectionDB._id': { $in: oids }
  })
  const deletedSets = await db.CollectionSet.deleteMany({
    'collectionDB._id': { $in: oids }
  })
  console.log('deleted', deletedBeatmap.deletedCount, 'collection beatmaps,', deletedSets.deletedCount, 'collection sets')
}

c.on('error', function (err) {
  console.error('Failed to connect to database', err)
  process.exit(1)
})
c.once('open', async function () {
  console.info('Connected to database')
  await fixDuplicateSet()
  await removeNulledCollectionBeatmap()
  process.exit(0)
})
