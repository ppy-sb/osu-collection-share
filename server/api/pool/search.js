const { Pool } = require('../../database/models.js')
module.exports = async (req, res, next) => {
  const searchText = req.params.name

  res.json(await Pool.find({ $text: { $search: searchText } }).limit(10).exec())
}
