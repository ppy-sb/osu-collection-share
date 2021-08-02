const Mongoose = require('mongoose')
module.exports = new Mongoose.Schema({
  name: { type: String, index: true },
  slug: { type: String, index: true },
  mod: { type: Array, default: undefined },
  scoreType: { type: String },
  collectionDB: {
    _id: {
      type: Mongoose.Types.ObjectId, index: true
    }
  }
})
