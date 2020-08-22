const slug = require('slug')
const models = require('../database/models')
module.exports = async (req, res, next) => {
  const target = req.params[0] || undefined
  if (target === undefined) { next(Error('slug required')) }
  const s = slug(target)
  const sameDBExists = await models.CollectionDB.exists({ slug: s })
  let increase = 2
  if (sameDBExists) {
    while (await models.CollectionDB.exists({ slug: slug(`${target}-${increase}`) })) {
      increase = increase + 1
    }
  }
  res.json({
    slug: s,
    sameCollectionDBExitsts: sameDBExists,
    nextAvailable: slug(`${target}-${increase}`)
  })
}
