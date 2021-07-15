const { CollectionDB, User } = require('../../database/models.js')
module.exports = async (req, res, next) => {
  const result = await CollectionDB.find().sort({ 'count.view': -1, _id: -1 }).limit(20).exec().then(results => results.map(result => result.toObject())).catch(_ => {
    console.error(_)
    return []
  })
  const returnResults = await Promise.all(result.map(async (collection) => {
    collection.user = await User.findOne(collection.user).exec()
    return collection
  }))
  res.json(returnResults)
}
