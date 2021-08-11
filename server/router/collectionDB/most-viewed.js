const mostViewed = require('~controllers/Collection/most-viewed')
module.exports = async (req, res, next) => {
  res.json(await mostViewed())
}
