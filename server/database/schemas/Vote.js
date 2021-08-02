const Mongoose = require('mongoose')
const schema = new Mongoose.Schema({
  user: {
    _id: { type: Mongoose.Types.ObjectId, required: true }
  },
  collectionDB: {
    _id: { type: Mongoose.Types.ObjectId, required: true }
  },
  vote: {
    type: Number, required: true
  }
})

schema.index({ 'user._id': 1, 'collection._id': 1 }, { unique: true })
