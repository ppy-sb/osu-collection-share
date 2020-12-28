const Controller = require('../collectionDB/controller/writer')
module.exports = async (req, res, next) => {
  const result = await new Controller(req.body).save()
  res.json(result)
}
