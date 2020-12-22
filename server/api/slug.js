const models = require('../database/models')
const getSlug = require('../controller/slug')
module.exports = async (req, res, next) => {
  const target = req.params[0] || undefined
  if (target === undefined) { next(Error('slug required')) }
  const model = models.Pool
  const result = await getSlug(target, model)
  res.json(result)
}
