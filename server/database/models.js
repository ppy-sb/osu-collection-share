const Mongoose = require('./connect')
const Schemas = require('./schemas')

// const User = Mongoose.model('User', Schemas.User)
// const MapCollection = Mongoose.model('MapCollection', Schemas.MapCollection)
// const Set = Mongoose.model('Set', Schemas.Set)
// const CollectionBeatmap = Mongoose.model('CollectionBeatmap', Schemas.CollectionBeatmap)
// const Beatmap = Mongoose.model('Beatmap', Schemas.Beatmap)
// const models = {
//   User,
//   MapCollection,
//   Set,
//   CollectionBeatmap,
//   Beatmap
// }

// module.exports = models

Object.entries(Schemas).map(([name, schema]) => {
  module.exports[name] = Mongoose.model(name, schema)
})
