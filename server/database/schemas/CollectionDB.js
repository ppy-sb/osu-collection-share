const Mongoose = require('mongoose')
const schema = new Mongoose.Schema({
  name: { type: String },
  slug: { type: String, required: true, index: true },
  description: { type: String },
  uploader: {
    name: { type: String, index: true },
    link: { type: String },
    avatar: { type: String }
  },
  user: {
    _id: {
      type: Mongoose.Types.ObjectId, index: true
    },
    anonymous: { type: Boolean, default: true }
  },
  tournament: { type: Boolean },
  count: {
    view: { type: Number, default: 0 },
    vote: {
      up: { type: Number, default: 0 },
      down: { type: Number, default: 0 }
    }
  }
})
schema.index({ name: 'text', description: 'text' })
module.exports = schema
