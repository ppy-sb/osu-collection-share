const Mongoose = require('mongoose')
module.exports = {
  User: new Mongoose.Schema({
    id: { type: Number, default: -1 },
    name: { type: String, default: 'Unknown' }
  }),
  CollectionDB: new Mongoose.Schema({
    name: { type: String, default: 'Unnamed' },
    slug: { type: String, default: 'Unnamed' },
    description: { type: String, default: 'no' },
    user: {
      _id: Mongoose.Types.ObjectId
    }
  }),
  CollectionSet: new Mongoose.Schema({
    name: { type: String, default: 'Unnamed' },
    slug: { type: String, default: 'Unnamed' },
    collectionDB: {
      _id: Mongoose.Types.ObjectId
    }
  }),
  Set: new Mongoose.Schema({
    name: { type: String, default: 'Unnamed' },
    id: { type: Number, default: -1 },
    collectionSets: {
      _id: Mongoose.Types.ObjectId
    },
    collectionDB: {
      _id: Mongoose.Types.ObjectId
    }
  }),
  CollectionBeatmap: new Mongoose.Schema({
    localOffset: { type: Number, default: 0 },
    beatmap: {
      _id: Mongoose.Types.ObjectId
    },
    set: {
      _id: Mongoose.Types.ObjectId
    },
    collectionSet: {
      _id: Mongoose.Types.ObjectId
    },
    collectionDB: {
      _id: Mongoose.Types.ObjectId
    }
  }),
  Beatmap: new Mongoose.Schema({
    approach_rate: { type: Number, default: -1 },
    artist_name: { type: String, default: 'Unnamed' },
    artist_name_unicode: { type: String, default: 'Unnamed' },
    beatmap_id: { type: Number, default: -1, required: true },
    beatmapset_id: { type: Number, default: -1, required: true },
    circle_size: { type: Number, default: -1 },
    creator_name: { type: String, default: 'Unnamed' },
    difficulty: { type: String, required: true },
    drain_time: { type: Number, default: -1 },
    hp_drain: { type: Number, default: -1 },
    md5: { type: String, default: 'Unnamed' },
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
