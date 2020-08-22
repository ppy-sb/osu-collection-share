const Controller = require('../controller/writer')
module.exports = (req, res, next) => {
  const result = new Controller(req.body).save()
  res.json(result)
}
