const recent = require('../../controller/Collection/recent')
module.exports = async (req, res, next) => {
  res.json(await recent())
}
