const models = require('~models')
const getSlug = require('~controllers/slug')
module.exports = async (req, res, next) => {
  const target = req.params[0] || undefined
  // if (target === undefined) { next(Error('slug required')) }
  const model = models.CollectionDB
  const result = await getSlug(target, model)
  res.json(result)
}
