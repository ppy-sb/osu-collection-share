const recent = require('~controllers/Collection/recent')
module.exports = async (req, res, next) => {
  res.json(await recent())
}
