const Reader = require('~controllers/Collection/reader')
module.exports = async (req, res, next) => {
  const result = new Reader({ slug: req.params.slug })
  const collection = await result.toCollection()
  // WIP user system
  if (req.session.user) {
    collection.myVote = { vote: 0 }
  } else if (req.session) {
    collection.myVote = req.session.votes.find(voted => voted.collectionDB._id.equals(collection.collectionDB._id)) || { vote: 0 }
  }
  res.json(collection)
}
