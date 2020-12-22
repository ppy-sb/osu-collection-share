const Controller = require('../../controller/reader')
module.exports = async (req, res, next) => {
  const result = await new Controller({ slug: req.params.slug }).toPool()
  res.json(result)
}
