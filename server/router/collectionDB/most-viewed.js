const mostViewed = require('../../controller/Collection/most-viewed')
module.exports = async (req, res, next) => {
  res.json(await mostViewed())
}
