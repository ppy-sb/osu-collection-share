const Mongoose = require('mongoose')
const schema = new Mongoose.Schema({
  user: {
    _id: { type: Mongoose.Types.ObjectId }
  },
  collectionDB: {
    _id: { type: Mongoose.Types.ObjectId, required: true, indexed: true }
  },
  comment: {
    type: String
  },
  show: {
    type: Boolean,
    default: true
  }
})

module.exports = schema
