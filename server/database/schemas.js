const Mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10
const Schemas = {
  User: new Mongoose.Schema({
    id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    hashed: { type: Number, default: SALT_WORK_FACTOR }
  }),
  CollectionDB: new Mongoose.Schema({
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
      view: { type: Number, default: 0 }
    }
  }),
  CollectionSet: new Mongoose.Schema({
    name: { type: String, index: true },
    slug: { type: String, index: true },
    mod: { type: Array, default: undefined },
    scoreType: { type: String },
    collectionDB: {
      _id: {
        type: Mongoose.Types.ObjectId, index: true
      }
    }
  }),
  Set: new Mongoose.Schema({
    name: { type: String },
    folderName: { type: String },
    id: { type: Number }
  }),
  CollectionBeatmap: new Mongoose.Schema({
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
  }),
  Beatmap: new Mongoose.Schema({
    approach_rate: { type: Number },
    artist_name: { type: String, index: true },
    artist_name_unicode: { type: String },
    beatmap_id: { type: Number, index: true },
    beatmapset_id: { type: Number, index: true },
    circle_size: { type: Number },
    creator_name: { type: String, index: true },
    difficulty: { type: String },
    drain_time: { type: Number },
    hp_drain: { type: Number },
    md5: { type: String, required: true, index: true },
    folder_name: { type: String },
    mode: { type: Number, default: 0 },
    n_hitcircles: { type: Number },
    n_sliders: { type: Number },
    n_spinners: { type: Number },
    online_offset: { type: Number },
    overall_difficulty: { type: Number },
    ranked_status: { type: Number, default: 5 },
    slider_velocity: { type: Number },
    song_source: { type: String },
    song_tags: { type: String },
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
    thread_id: { type: Number }
  })
}
Schemas.CollectionDB.index({ name: 'text', description: 'text' })
// Schemas.CollectionDB.virtual('user', {
//   ref: 'User',
//   localField: 'user._id',
//   foreignField: '_id'
// })
Schemas.User.pre('save', (next) => {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) { return next() }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) { return next(err) }

    // hash the password using our new salt
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) { return next(err) }
      // override the cleartext password with the hashed one
      this.password = hash
      next()
    })
  })
})

module.exports = Schemas
