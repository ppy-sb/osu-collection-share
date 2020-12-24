const Mongoose = require('mongoose')
const Schemas = {
  User: new Mongoose.Schema({
    id: { type: Number, default: -1 },
    name: { type: String, default: 'Unknown' }
  }),
  CollectionDB: new Mongoose.Schema({
    name: { type: String, default: 'Unnamed' },
    slug: { type: String, default: 'Unnamed', index: true },
    description: { type: String, default: 'no' },
    user: {
      _id: {
        type: Mongoose.Types.ObjectId, index: true
      }
    }
  }),
  CollectionSet: new Mongoose.Schema({
    name: { type: String, default: 'Unnamed', index: true },
    slug: { type: String, default: 'Unnamed', index: true },
    collectionDB: {
      _id: {
        type: Mongoose.Types.ObjectId, index: true
      }
    }
  }),
  Set: new Mongoose.Schema({
    name: { type: String, default: 'Unnamed' },
    folderName: { type: String },
    id: { type: Number, default: -1 },
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
  }),
  CollectionBeatmap: new Mongoose.Schema({
    localOffset: { type: Number, default: 0 },
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
  }),
  Beatmap: new Mongoose.Schema({
    approach_rate: { type: Number, default: -1 },
    artist_name: { type: String, default: 'Unnamed', index: true },
    artist_name_unicode: { type: String, default: 'Unnamed' },
    beatmap_id: { type: Number, default: -1, index: true },
    beatmapset_id: { type: Number, default: -1, index: true },
    circle_size: { type: Number, default: -1 },
    creator_name: { type: String, default: 'Unnamed', index: true },
    difficulty: { type: String },
    drain_time: { type: Number, default: -1 },
    hp_drain: { type: Number, default: -1 },
    md5: { type: String, required: true, index: true },
    folder_name: { type: String },
    mode: { type: Number, default: 0 },
    n_hitcircles: { type: Number, default: -1 },
    n_sliders: { type: Number, default: -1 },
    n_spinners: { type: Number, default: -1 },
    online_offset: { type: Number, default: -1 },
    overall_difficulty: { type: Number, default: -1 },
    ranked_status: { type: Number, default: 5 },
    slider_velocity: { type: Number, default: -1 },
    song_source: { type: String, default: 'Unnamed' },
    song_tags: { type: String, default: 'Unnamed' },
    song_title: { type: String, default: 'Unknown' },
    song_title_unicode: { type: String, default: 'Unknown' },
    star_rating_ctb: Object,
    star_rating_mania: Object,
    star_rating_standard: {
      0: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      16: { type: Number, default: 0 },
      64: { type: Number, default: 0 },
      66: { type: Number, default: 0 },
      80: { type: Number, default: 0 },
      256: { type: Number, default: 0 },
      258: { type: Number, default: 0 },
      272: { type: Number, default: 0 }
    },
    star_rating_taiko: Object,
    thread_id: { type: Number, default: -1 }
  })
}
Schemas.CollectionDB.index({ name: 'text', description: 'text' })

module.exports = Schemas
