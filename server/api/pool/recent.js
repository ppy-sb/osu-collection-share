const { CollectionDB, User } = require('../../database/models.js')
module.exports = async (req, res, next) => {
  const result = await CollectionDB.find().sort({ $natural: -1 }).limit(20).exec().then(results => results.map(result => result.toObject())).catch(_ => [])
  const returnResults = await Promise.all(result.map(async (collection) => {
    collection.user = await User.findOne(collection.user).exec()
    return collection
  }))
  res.json(returnResults)
}
