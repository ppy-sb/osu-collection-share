const Mongoose = require('mongoose')
module.exports = new Mongoose.Schema({
  localOffset: { type: Number, default: 0 },
  index: { type: Number },
  beatmap: {
    _id: {
      type: Mongoose.Types.ObjectId, index: true
    }
  },
  set: {
    _id: {
      type: Mongoose.Types.ObjectId, index: true
    }
  },
  collectionSet: {
    _id: {
      type: Mongoose.Types.ObjectId, index: true
    }
  },
  collectionDB: {
    _id: {
      type: Mongoose.Types.ObjectId, index: true
    }
  }
})
