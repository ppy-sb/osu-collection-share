const Mongoose = require('mongoose')
module.exports = new Mongoose.Schema({
  name: { type: String },
  folderName: { type: String },
  id: { type: Number }
})
