const Controller = require('../../controller/reader')
module.exports = async (req, res, next) => {
  const result = new Controller({ slug: req.params.slug })
  const collection = await result.toCollection()
  res.json(collection)
}
