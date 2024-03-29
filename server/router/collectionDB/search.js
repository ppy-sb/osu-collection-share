const { CollectionDB } = require('~models')
module.exports = async (req, res, next) => {
  const searchText = req.params.name

  res.json(await CollectionDB.find({ $text: { $search: searchText } }).limit(10).exec())
}
